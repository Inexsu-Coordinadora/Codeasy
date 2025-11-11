import { ejecutarConsulta } from './clientepostgres';
import type { IProyecto } from '../../dominio/proyecto/IProyecto';
import type { IProyectoRepositorio } from '../../dominio/proyecto/repositorio/IProyectoRepositorio';
import  { Proyecto } from '../../dominio/proyecto/Proyecto';


export class ProyectoRepositorio implements IProyectoRepositorio {

  // Crear un nuevo proyecto
  async registrarProyecto(proyecto: IProyecto): Promise<IProyecto> {
    const proyectoSinId = { ...proyecto };
    delete (proyectoSinId as any).id;

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
    const query = `SELECT * FROM proyectos WHERE estatus = 'Activo' ORDER BY id ASC;`;
    const resultado = await ejecutarConsulta(query, []);
    return resultado.rows;
  }

  // Obtener un proyecto por su ID
  async obtenerProyectoPorId(id: number): Promise<IProyecto | null> {
    const query = `SELECT * FROM proyectos WHERE id = $1 AND estatus = 'Activo';`;
    const resultado = await ejecutarConsulta(query, [id]);
    return resultado.rows[0] || null;
  }

  // Actualizar un proyecto
  async actualizarProyecto(id: number, datos: Partial<IProyecto>): Promise<IProyecto> {
    const datosLimpios = Object.fromEntries(
      Object.entries(datos).filter(([_, v]) => v !== null && v !== undefined)
    );

    const columnas = Object.keys(datosLimpios).map((key) => key.toLowerCase());
    const parametros = Object.values(datosLimpios);
    const setClause = columnas.map((col, i) => `${col}=$${i + 1}`).join(", ");
    parametros.push(id);

    const query = `
      UPDATE proyectos
      SET ${setClause}
      WHERE id=$${parametros.length}
      RETURNING *;
    `;

    const resultado = await ejecutarConsulta(query, parametros);
    return resultado.rows[0];
  }

  // Eliminación lógica del proyecto
  async eliminarProyecto(id: number): Promise<void> {
    const query = `UPDATE proyectos SET estatus='Eliminado' WHERE id=$1;`;
    await ejecutarConsulta(query, [id]);
  }

  // Listar proyectos por cliente

 async obtenerPorCliente(
  idCliente: string,
  filtros?: { estado?: string; fecha_inicio?: Date; fecha_fin?: Date }
): Promise<Proyecto[]> {
  let query = `
    SELECT 
      p.id,
      p.nombre,
      p.estado,
      p.fecha_inicio,
      p.fecha_fin
    FROM proyectos p
    WHERE p.idcliente = $1
  `;

  const params: any[] = [idCliente];
  let index = 2;

  if (filtros?.estado) {
    query += ` AND p.estado = $${index++}`;
    params.push(filtros.estado);
  }

  if (filtros?.fecha_inicio) {
  const fecha = new Date(filtros.fecha_inicio).toISOString().slice(0, 10);
  query += ` AND DATE(p.fecha_inicio) = $${index}::date`;
  params.push(fecha);
  index++;
}

  

  const result = await ejecutarConsulta(query, params);

  // Consultar los consultores asociados a cada proyecto
  const proyectos = await Promise.all(
    result.rows.map(async (p: any) => {
      const consultoresQuery = await ejecutarConsulta(
        `
        SELECT 
      c.nombre AS nombre,
      r.nombre_rol AS rol
      FROM staff_proyecto sp
      JOIN consultores c ON sp.idconsultor = c.idconsultor
      JOIN roles r ON sp.idrol = r.idrol
      WHERE sp.id = $1
  `,
        [p.id]
      );

      return ({
        ...p,
        consultores: consultoresQuery.rows,
      });
    })
  );

  return proyectos;
}
 
}