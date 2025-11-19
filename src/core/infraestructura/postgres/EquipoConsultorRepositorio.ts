import { ejecutarConsulta } from "./clientepostgres";
import type { IEquipoConsultor } from "../../dominio/equipos-consultores/IEquipoConsultor";
import type { IEquipoConsultorRepositorio } from "../../dominio/equipos-consultores/repositorio/IEquipoConsultorRepositorio";
import { toSnakeCase } from "../../utils/toSnakeCase";
import { toCamelCase } from "../../utils/toCamelCase";

export class EquipoConsultorRepositorio implements IEquipoConsultorRepositorio {

  // VERIFICAR SI ROL EXISTE (desde BD)
  async rolExiste(idRol: string): Promise<boolean> {
    const query = `
      SELECT 1
      FROM roles
      WHERE id_rol = $1 AND estado = 'Activo'
      LIMIT 1;
    `;
    const result = await ejecutarConsulta(query, [idRol]);
    return result.rows.length > 0;
  }

  // CREAR ASIGNACIÓN
  async crearAsignacion(asignacion: IEquipoConsultor): Promise<IEquipoConsultor> {
    const data = toSnakeCase(asignacion);
    delete (data as any).id_equipo_consultores;

    const columnas = Object.keys(data);
    const valores = Object.values(data).map(v => (v === undefined ? null : v));
    const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO equipos_consultores (${columnas.join(", ")})
      VALUES (${placeholders})
      RETURNING *;
    `;

    const result = await ejecutarConsulta(query, valores);
    return toCamelCase(result.rows[0]);
  }

  // OBTENER POR ID
  async obtenerPorId(id: string): Promise<IEquipoConsultor | null> {
    const query = `
      SELECT *
      FROM equipos_consultores
      WHERE id_equipo_consultores = $1
      LIMIT 1;
    `;
    const result = await ejecutarConsulta(query, [id]);
    const row = result.rows[0];
    return row ? toCamelCase(row) : null;
  }

  // LISTAR POR EQUIPO
  async listarPorEquipo(idEquipoProyecto: string): Promise<IEquipoConsultor[]> {
    const query = `
      SELECT *
      FROM equipos_consultores
      WHERE id_equipo_proyecto = $1
      AND estado = 'Activo'
      ORDER BY fecha_inicio ASC;
    `;
    const result = await ejecutarConsulta(query, [idEquipoProyecto]);
    return toCamelCase(result.rows);
  }

  // LISTAR POR CONSULTOR
  async listarPorConsultor(idConsultor: string): Promise<IEquipoConsultor[]> {
    const query = `
      SELECT *
      FROM equipos_consultores
      WHERE id_consultor = $1
      AND estado = 'Activo'
      ORDER BY fecha_inicio ASC;
    `;
    const result = await ejecutarConsulta(query, [idConsultor]);
    return toCamelCase(result.rows);
  }

  // ACTUALIZAR ASIGNACIÓN
  async actualizarAsignacion(
    id: string,
    datos: Partial<IEquipoConsultor>
  ): Promise<IEquipoConsultor> {

    const datosBD = toSnakeCase(
      Object.fromEntries(
        Object.entries(datos).filter(([_, v]) => v !== undefined && v !== null)
      )
    );

    const columnas = Object.keys(datosBD);
    const valores = Object.values(datosBD);
    const setClause = columnas.map((col, i) => `${col} = $${i + 1}`).join(", ");

    valores.push(id);

    const query = `
      UPDATE equipos_consultores
      SET ${setClause}
      WHERE id_equipo_consultores = $${valores.length}
      RETURNING *;
    `;

    const result = await ejecutarConsulta(query, valores);
    return toCamelCase(result.rows[0]);
  }

  // ELIMINACIÓN LÓGICA
  async eliminarAsignacion(id: string): Promise<IEquipoConsultor> {
    const query = `
      UPDATE equipos_consultores
      SET estado = 'Eliminado'
      WHERE id_equipo_consultores = $1
      RETURNING *;
    `;
    const result = await ejecutarConsulta(query, [id]);
    return toCamelCase(result.rows[0]);
  }
  
  async eliminarPorConsultor(idConsultor: string): Promise<void> {
    const query = `
      UPDATE equipos_consultores
      SET estado = 'Eliminado'
      WHERE id_consultor = $1;
    `;
    await ejecutarConsulta(query, [idConsultor]);
  }

  async eliminarPorEquipo(idEquipoProyecto: string): Promise<void> {
    const query = `
      UPDATE equipos_consultores
      SET estado = 'Eliminado'
      WHERE id_equipo_proyecto = $1;
    `;
    await ejecutarConsulta(query, [idEquipoProyecto]);
  }

}
