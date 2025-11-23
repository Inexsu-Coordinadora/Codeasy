import { ejecutarConsulta } from "./clientepostgres.js";
import type { IEquipoProyecto } from "../../dominio/equipo-proyecto/IEquipoProyecto.js";
import type { IEquipoProyectoRepositorio } from "../../dominio/equipo-proyecto/repositorio/IEquipoProyectoRepositorio.js";
import { toSnakeCase } from "../../utils/toSnakeCase.js";
import { toCamelCase } from "../../utils/toCamelCase.js";

export class EquipoProyectoRepositorio implements IEquipoProyectoRepositorio {

  async crear(equipo: IEquipoProyecto): Promise<IEquipoProyecto> {
    const equipoBD = toSnakeCase(equipo);
    delete (equipoBD as any).id_equipo_proyecto;
    delete (equipoBD as any).nombre_proyecto;

    const columnas = Object.keys(equipoBD);
    const valores = Object.values(equipoBD).map((v) => v ?? null);
    const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO equipos_proyectos (${columnas.join(", ")})
      VALUES (${placeholders})
      RETURNING *;
    `;

    const resultado = await ejecutarConsulta(query, valores);
    const nuevoEquipo = toCamelCase(resultado.rows[0]) as IEquipoProyecto;

    // Fetch project name
    const queryProyecto = `SELECT nombre FROM proyectos WHERE id_proyecto = $1`;
    const resProyecto = await ejecutarConsulta(queryProyecto, [nuevoEquipo.idProyecto]);

    let nombreProyecto = undefined;
    if (resProyecto.rows.length > 0) {
      nombreProyecto = resProyecto.rows[0].nombre;
    }

    return {
      idEquipoProyecto: nuevoEquipo.idEquipoProyecto,
      nombre: nuevoEquipo.nombre,
      idProyecto: nuevoEquipo.idProyecto,
      nombreProyecto: nombreProyecto,
      fechaInicio: nuevoEquipo.fechaInicio,
      fechaFin: nuevoEquipo.fechaFin,
      estado: nuevoEquipo.estado
    };
  }

  async obtenerTodos(): Promise<IEquipoProyecto[]> {
    const query = `
      SELECT ep.id_equipo_proyecto, ep.nombre, ep.id_proyecto, p.nombre as nombre_proyecto, ep.fecha_inicio, ep.fecha_fin, ep.estado
      FROM equipos_proyectos ep
      JOIN proyectos p ON ep.id_proyecto = p.id_proyecto
      WHERE ep.estado = 'Activo'
      ORDER BY ep.fecha_inicio DESC;
    `;
    const resultado = await ejecutarConsulta(query, []);
    return toCamelCase(resultado.rows);
  }

  async obtenerPorId(idEquipoProyecto: string): Promise<IEquipoProyecto | null> {
    const query = `
      SELECT ep.id_equipo_proyecto, ep.nombre, ep.id_proyecto, p.nombre as nombre_proyecto, ep.fecha_inicio, ep.fecha_fin, ep.estado
      FROM equipos_proyectos ep
      JOIN proyectos p ON ep.id_proyecto = p.id_proyecto
      WHERE ep.id_equipo_proyecto = $1
      AND ep.estado = 'Activo'
      LIMIT 1;
    `;
    const resultado = await ejecutarConsulta(query, [idEquipoProyecto]);
    return resultado.rows[0] ? (toCamelCase(resultado.rows[0]) as IEquipoProyecto) : null;
  }

  async obtenerPorProyecto(idProyecto: string): Promise<IEquipoProyecto | null> {
    const query = `
      SELECT ep.id_equipo_proyecto, ep.nombre, ep.id_proyecto, p.nombre as nombre_proyecto, ep.fecha_inicio, ep.fecha_fin, ep.estado
      FROM equipos_proyectos ep
      JOIN proyectos p ON ep.id_proyecto = p.id_proyecto
      WHERE ep.id_proyecto = $1
      AND ep.estado = 'Activo'
      LIMIT 1;
    `;
    const resultado = await ejecutarConsulta(query, [idProyecto]);
    return resultado.rows[0] ? (toCamelCase(resultado.rows[0]) as IEquipoProyecto) : null;
  }

  async actualizar(idEquipoProyecto: string, datos: Partial<IEquipoProyecto>): Promise<IEquipoProyecto> {
    const datosBD = toSnakeCase(
      Object.fromEntries(Object.entries(datos).filter(([_, v]) => v !== undefined && v !== null))
    );
    delete (datosBD as any).nombre_proyecto;

    const columnas = Object.keys(datosBD);
    const valores = Object.values(datosBD);

    if (columnas.length === 0) {
      throw new Error("No se proporcionó ningún dato para actualizar.");
    }

    const setClause = columnas.map((col, i) => `${col} = $${i + 1}`).join(", ");
    valores.push(idEquipoProyecto);

    const query = `
      UPDATE equipos_proyectos
      SET ${setClause}
      WHERE id_equipo_proyecto = $${valores.length}
      RETURNING *;
    `;

    const resultado = await ejecutarConsulta(query, valores);
    const equipoActualizado = toCamelCase(resultado.rows[0]) as IEquipoProyecto;

    // Fetch project name
    const queryProyecto = `SELECT nombre FROM proyectos WHERE id_proyecto = $1`;
    const resProyecto = await ejecutarConsulta(queryProyecto, [equipoActualizado.idProyecto]);

    let nombreProyecto = undefined;
    if (resProyecto.rows.length > 0) {
      nombreProyecto = resProyecto.rows[0].nombre;
    }

    return {
      idEquipoProyecto: equipoActualizado.idEquipoProyecto,
      nombre: equipoActualizado.nombre,
      idProyecto: equipoActualizado.idProyecto,
      nombreProyecto: nombreProyecto,
      fechaInicio: equipoActualizado.fechaInicio,
      fechaFin: equipoActualizado.fechaFin,
      estado: equipoActualizado.estado
    };
  }

  async eliminar(idEquipoProyecto: string): Promise<IEquipoProyecto> {
    const query = `
      UPDATE equipos_proyectos
      SET estado = 'Eliminado'
      WHERE id_equipo_proyecto = $1
      RETURNING *;
    `;
    const resultado = await ejecutarConsulta(query, [idEquipoProyecto]);
    return toCamelCase(resultado.rows[0]) as IEquipoProyecto;
  }
}
