import { ejecutarConsulta } from './clientepostgres';
import type { IProyecto } from '../../dominio/proyecto/IProyecto';
import type { IProyectoRepositorio } from '../../dominio/proyecto/repositorio/IProyectoRepositorio';
import { toSnakeCase } from "../../utils/toSnakeCase";
import { toCamelCase } from "../../utils/toCamelCase";


export class ProyectoRepositorio implements IProyectoRepositorio {
  // Crear un nuevo proyecto
  async registrarProyecto(proyecto: IProyecto): Promise<IProyecto> {
    // Convertir claves a snake_case para BD
    const proyectoBD = toSnakeCase(proyecto);
    delete (proyectoBD as any).id_proyecto;

    const columnas = Object.keys(proyectoBD);
    console.log("🔥 proyectoBD:", proyectoBD);
    console.log("🔥 Valores antes de insert:", Object.values(proyectoBD));

    const valores = Object.values(proyectoBD).map((v) =>
      v === null || v === undefined ? null : v
    ) as (string | Date | number | null)[];

    const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO proyectos (${columnas.join(", ")})
      VALUES (${placeholders})
      RETURNING *;
    `;

    const resultado = await ejecutarConsulta(query, valores);
    return toCamelCase(resultado.rows[0]);
  }

  // Listar todos los proyectos activos
  async listarTodosProyectos(): Promise<IProyecto[]> {
    const query = `
      SELECT * FROM proyectos
      WHERE estado = 'Activo'
      ORDER BY fecha_creacion DESC;
    `;
    const resultado = await ejecutarConsulta(query, []);
    return toCamelCase(resultado.rows);
  }

  // Obtener un proyecto por su ID
  async obtenerProyectoPorId(idProyecto: string): Promise<IProyecto | null> {
    const query = `
      SELECT * FROM proyectos
      WHERE id_proyecto = $1
      AND estado = 'Activo'
      LIMIT 1;
    `;
    const resultado = await ejecutarConsulta(query, [idProyecto]);
    const proyecto = resultado.rows[0];
    return proyecto ? toCamelCase(proyecto) : null;
  }

  // Actualizar un proyecto
  async actualizarProyecto(idProyecto: string, datos: Partial<IProyecto>): Promise<IProyecto> {
    // Convertir datos a snake_case para SQL
    const datosBD = toSnakeCase(
      Object.fromEntries(
        Object.entries(datos).filter(([_, v]) => v !== null && v !== undefined)
      )
    );

    const columnas = Object.keys(datosBD);
    const parametros = Object.values(datosBD);
    const setClause = columnas.map((col, i) => `${col} = $${i + 1}`).join(", ");
    parametros.push(idProyecto);

    const query = `
      UPDATE proyectos
      SET ${setClause}
      WHERE id_proyecto = $${parametros.length}
      RETURNING *;
    `;

    const resultado = await ejecutarConsulta(query, parametros);
    return toCamelCase(resultado.rows[0]);
  }

  // Eliminación lógica del proyecto
  async eliminarProyecto(idProyecto: string): Promise<IProyecto> {
    const query = `
      UPDATE proyectos
      SET estado = 'Eliminado'
      WHERE id_proyecto = $1
      RETURNING *;
    `;
    const resultado = await ejecutarConsulta(query, [idProyecto]);
    return toCamelCase(resultado.rows[0]);
  }
}