import { ejecutarConsulta } from './clientepostgres';
import type { IProyecto } from '../../dominio/proyecto/IProyecto';
import type { IProyectoRepositorio } from '../../dominio/proyecto/repositorio/IProyectoRepositorio';
import  { Proyecto } from '../../dominio/proyecto/Proyecto';


export class ProyectoRepositorio implements IProyectoRepositorio {

  // Crear un nuevo proyecto
  async registrarProyecto(proyecto: IProyecto): Promise<IProyecto> {
    const proyectoSinId = { ...proyecto };
    delete (proyectoSinId as any).id_proyecto;

    const columnas = Object.keys(proyectoSinId);
    const valores = Object.values(proyectoSinId).filter(v => v !== undefined && v !== null);
    const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO proyectos (${columnas.join(", ")})
      VALUES (${placeholders})
      RETURNING *;
    `;

    const resultado = await ejecutarConsulta(query, valores);
    return resultado.rows[0];
  }

  // Listar todos los proyectos activos
  async listarTodosProyectos(): Promise<IProyecto[]> {
    const query = `SELECT * FROM proyectos WHERE estado = 'Activo' ORDER BY id_proyecto ASC;`;
    const resultado = await ejecutarConsulta(query, []);
    return resultado.rows;
  }

  // Obtener un proyecto por su ID
  async obtenerProyectoPorId(idProyecto: number): Promise<IProyecto | null> {
    const query = `SELECT * FROM proyectos WHERE id_proyecto = $1 AND estado = 'Activo';`;
    const resultado = await ejecutarConsulta(query, [idProyecto]);
    return resultado.rows[0] || null;
  }

  // Actualizar un proyecto
  async actualizarProyecto(idProyecto: number, datos: Partial<IProyecto>): Promise<IProyecto> {
    const datosLimpios = Object.fromEntries(
      Object.entries(datos).filter(([_, v]) => v !== null && v !== undefined)
    );

    const columnas = Object.keys(datosLimpios).map((key) => key.toLowerCase());
    const parametros = Object.values(datosLimpios);
    const setClause = columnas.map((col, i) => `${col}=$${i + 1}`).join(", ");
    parametros.push(idProyecto);

    const query = `
      UPDATE proyectos
      SET ${setClause}
      WHERE id_proyecto=$${parametros.length}
      RETURNING *;
    `;

    const resultado = await ejecutarConsulta(query, parametros);
    return resultado.rows[0];
  }

  // Eliminación lógica del proyecto
  async eliminarProyecto(idProyecto: number): Promise<void> {
    const query = `UPDATE proyectos SET estado ='Eliminado' WHERE id_proyecto=$1;`;
    await ejecutarConsulta(query, [idProyecto]);
  }
  // Listar proyectos por cliente

async obtenerPorCliente(
  id_cliente: string,
  filtros?: { estado?: string; fecha_inicio?: Date; fecha_fin?: Date }
): Promise<Proyecto[]> {
  let query = `
    SELECT 
      p.id_proyecto,
      p.nombre,
      p.estado_proyecto,
      p.fecha_inicio
    FROM proyectos p
    WHERE p.id_cliente = $1
  `;

  const params: any[] = [id_cliente];
  let index = 2;

  if (filtros?.estado) {
    query += ` AND p.estado_proyecto = $${index++}`;
    params.push(filtros.estado);
  }

  if (filtros?.fecha_inicio) {
    const fecha = new Date(filtros.fecha_inicio).toISOString().slice(0, 10);
    query += ` AND DATE(p.fecha_inicio) = $${index}::date`;
    params.push(fecha);
    index++;
  }

  const result = await ejecutarConsulta(query, params);

 
  const proyectos = await Promise.all(
    result.rows.map(async (p: any) => {
      const consultoresQuery = await ejecutarConsulta(
        `
        SELECT 
          c.nombre AS nombre,
          r.nombre AS rol
        FROM staff_proyecto sp
        JOIN consultores c ON sp.id_consultor = c.id_consultor
        JOIN roles r ON sp.id_rol = r.id_rol
        WHERE sp.id_proyecto = $1
        `,
        [p.id_proyecto] 
      );

      return {
        ...p,
        consultores: consultoresQuery.rows,
      };
    })
  );

  return proyectos;
}

 
}