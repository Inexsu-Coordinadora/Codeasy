import { ejecutarConsulta } from "./clientepostgres";
import type { IStaffProyecto } from "../../dominio/staff-proyecto/IStaffProyecto";
import type { IStaffProyectoRepositorio } from "../../dominio/staff-proyecto/repositorio/IStaffProyectoRepositorio";

export class StaffProyectoRepositorio implements IStaffProyectoRepositorio {
  
  // Crear una nueva asignación
  async crearAsignacion(asignacion: IStaffProyecto): Promise<IStaffProyecto> {
    const { id_consultor, id_proyecto, id_rol, porcentaje_dedicacion, fecha_inicio, fecha_fin } = asignacion;

    const query = `
      INSERT INTO staff_proyecto (id_consultor, id_proyecto, id_rol, porcentaje_dedicacion, fecha_inicio, fecha_fin)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const valores = [id_consultor, id_proyecto, id_rol || null, porcentaje_dedicacion, fecha_inicio, fecha_fin];

    const resultado = await ejecutarConsulta(query, valores);
    return resultado.rows[0];
  }

  // Buscar duplicado (consultor, proyecto, rol)
  async buscarDuplicado(
    id_consultor: string,
    id_proyecto: string,
    id_rol?: string
  ): Promise<boolean> {
    const query = `
      SELECT 1 FROM staff_proyecto
      WHERE id_consultor = $1 AND id_proyecto = $2 AND (id_rol = $3 OR ($3 IS NULL AND id_rol IS NULL))
      LIMIT 1;
    `;
    const valores = [id_consultor, id_proyecto, id_rol || null];
    const resultado = await ejecutarConsulta(query, valores);
    return resultado.rowCount > 0;
  }

  // Obtener todas las asignaciones de un consultor (para validar dedicación)
  async obtenerAsignacionesPorConsultor(id_consultor: string): Promise<IStaffProyecto[]> {
    const query = `
      SELECT * FROM staff_proyecto
      WHERE id_consultor = $1
      ORDER BY fecha_inicio ASC;
    `;
    const resultado = await ejecutarConsulta(query, [id_consultor]);
    return resultado.rows;
  }


  async obtenerAsignaciones(id_proyecto?: string): Promise<IStaffProyecto[]> {
    let query = `
      SELECT sp.*, c.nombre AS nombre_consultor, p.nombre AS nombre_proyecto
      FROM staff_proyecto sp
      INNER JOIN consultores c ON sp.id_consultor = c.idConsultor
      INNER JOIN proyectos p ON sp.id_proyecto = p.id
    `;
    const valores: any[] = [];

    if (id_proyecto) {
      query += " WHERE sp.id_proyecto = $1";
      valores.push(id_proyecto);
    }

    query += " ORDER BY p.nombre, c.nombre;";

    const resultado = await ejecutarConsulta(query, valores);
    return resultado.rows;
  }
}


