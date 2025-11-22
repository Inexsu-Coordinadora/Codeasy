import { ejecutarConsulta } from "./clientepostgres.js";
import type { IEquipoConsultor } from "../../dominio/equipos-consultores/IEquipoConsultor.js";
import type { IEquipoConsultorRepositorio } from "../../dominio/equipos-consultores/repositorio/IEquipoConsultorRepositorio.js";
import { toSnakeCase } from "../../utils/toSnakeCase.js";
import { toCamelCase } from "../../utils/toCamelCase.js";

export class EquipoConsultorRepositorio implements IEquipoConsultorRepositorio {

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

  async crear(asignacion: IEquipoConsultor): Promise<IEquipoConsultor> {
    const data = toSnakeCase(asignacion);
    delete (data as any).id_equipo_consultores;
    delete (data as any).nombre_consultor;
    delete (data as any).nombre_equipo_proyecto;
    delete (data as any).nombre_rol;
    delete (data as any).nombre_proyecto;
    delete (data as any).id_proyecto;

    const columnas = Object.keys(data);
    const valores = Object.values(data).map(v => (v === undefined ? null : v));
    const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO equipos_consultores (${columnas.join(", ")})
      VALUES (${placeholders})
      RETURNING *;
    `;

    const result = await ejecutarConsulta(query, valores);
    const nuevaAsignacion = toCamelCase(result.rows[0]) as IEquipoConsultor;

    // Fetch additional details
    const queryDetalles = `
      SELECT 
        c.nombre as nombre_consultor,
        ep.nombre as nombre_equipo_proyecto,
        p.id_proyecto,
        p.nombre as nombre_proyecto,
        r.nombre_rol
      FROM consultores c
      JOIN equipos_proyectos ep ON ep.id_equipo_proyecto = $1
      JOIN proyectos p ON ep.id_proyecto = p.id_proyecto
      JOIN roles r ON r.id_rol = $3
      WHERE c.id_consultor = $2
    `;
    const resDetalles = await ejecutarConsulta(queryDetalles, [nuevaAsignacion.idEquipoProyecto, nuevaAsignacion.idConsultor, nuevaAsignacion.idRol]);

    let detalles: any = {};
    if (resDetalles.rows.length > 0) {
      detalles = resDetalles.rows[0];
    }

    return {
      idEquipoConsultores: nuevaAsignacion.idEquipoConsultores,
      idConsultor: nuevaAsignacion.idConsultor,
      nombreConsultor: detalles.nombre_consultor,
      idEquipoProyecto: nuevaAsignacion.idEquipoProyecto,
      nombreEquipoProyecto: detalles.nombre_equipo_proyecto,
      idRol: nuevaAsignacion.idRol,
      nombreRol: detalles.nombre_rol,
      porcentajeDedicacion: nuevaAsignacion.porcentajeDedicacion,
      fechaInicio: nuevaAsignacion.fechaInicio,
      fechaFin: nuevaAsignacion.fechaFin,
      estado: nuevaAsignacion.estado,
      idProyecto: detalles.id_proyecto,
      nombreProyecto: detalles.nombre_proyecto
    };
  }

  async obtenerTodos(): Promise<IEquipoConsultor[]> {
    const query = `
      SELECT 
        ec.id_equipo_consultores,
        ec.id_consultor,
        c.nombre as nombre_consultor,
        ec.id_equipo_proyecto,
        ep.nombre as nombre_equipo_proyecto,
        ec.id_rol,
        r.nombre_rol,
        ec.porcentaje_dedicacion,
        ec.fecha_inicio,
        ec.fecha_fin,
        ec.estado,
        p.id_proyecto,
        p.nombre as nombre_proyecto
      FROM equipos_consultores ec
      JOIN consultores c ON ec.id_consultor = c.id_consultor
      JOIN equipos_proyectos ep ON ec.id_equipo_proyecto = ep.id_equipo_proyecto
      JOIN proyectos p ON ep.id_proyecto = p.id_proyecto
      JOIN roles r ON ec.id_rol = r.id_rol
      WHERE ec.estado = 'Activo'
      ORDER BY ec.fecha_inicio ASC;
    `;
    const result = await ejecutarConsulta(query, []);
    return toCamelCase(result.rows);
  }

  async obtenerPorId(id: string): Promise<IEquipoConsultor | null> {
    const query = `
      SELECT 
        ec.id_equipo_consultores,
        ec.id_consultor,
        c.nombre as nombre_consultor,
        ec.id_equipo_proyecto,
        ep.nombre as nombre_equipo_proyecto,
        ec.id_rol,
        r.nombre_rol,
        ec.porcentaje_dedicacion,
        ec.fecha_inicio,
        ec.fecha_fin,
        ec.estado,
        p.id_proyecto,
        p.nombre as nombre_proyecto
      FROM equipos_consultores ec
      JOIN consultores c ON ec.id_consultor = c.id_consultor
      JOIN equipos_proyectos ep ON ec.id_equipo_proyecto = ep.id_equipo_proyecto
      JOIN proyectos p ON ep.id_proyecto = p.id_proyecto
      JOIN roles r ON ec.id_rol = r.id_rol
      WHERE ec.id_equipo_consultores = $1
      LIMIT 1;
    `;
    const result = await ejecutarConsulta(query, [id]);
    return result.rows[0] ? (toCamelCase(result.rows[0]) as IEquipoConsultor) : null;
  }

  async obtenerPorEquipo(idEquipoProyecto: string): Promise<IEquipoConsultor[]> {
    const query = `
      SELECT 
        ec.id_equipo_consultores,
        ec.id_consultor,
        c.nombre as nombre_consultor,
        ec.id_equipo_proyecto,
        ep.nombre as nombre_equipo_proyecto,
        ec.id_rol,
        r.nombre_rol,
        ec.porcentaje_dedicacion,
        ec.fecha_inicio,
        ec.fecha_fin,
        ec.estado,
        p.id_proyecto,
        p.nombre as nombre_proyecto
      FROM equipos_consultores ec
      JOIN consultores c ON ec.id_consultor = c.id_consultor
      JOIN equipos_proyectos ep ON ec.id_equipo_proyecto = ep.id_equipo_proyecto
      JOIN proyectos p ON ep.id_proyecto = p.id_proyecto
      JOIN roles r ON ec.id_rol = r.id_rol
      WHERE ec.id_equipo_proyecto = $1
      AND ec.estado = 'Activo'
      ORDER BY ec.fecha_inicio ASC;
    `;
    const result = await ejecutarConsulta(query, [idEquipoProyecto]);
    return toCamelCase(result.rows);
  }

  async obtenerPorConsultor(idConsultor: string): Promise<IEquipoConsultor[]> {
    const query = `
      SELECT 
        ec.id_equipo_consultores,
        ec.id_consultor,
        c.nombre as nombre_consultor,
        ec.id_equipo_proyecto,
        ep.nombre as nombre_equipo_proyecto,
        ec.id_rol,
        r.nombre_rol,
        ec.porcentaje_dedicacion,
        ec.fecha_inicio,
        ec.fecha_fin,
        ec.estado,
        p.id_proyecto,
        p.nombre as nombre_proyecto
      FROM equipos_consultores ec
      JOIN consultores c ON ec.id_consultor = c.id_consultor
      JOIN equipos_proyectos ep ON ec.id_equipo_proyecto = ep.id_equipo_proyecto
      JOIN proyectos p ON ep.id_proyecto = p.id_proyecto
      JOIN roles r ON ec.id_rol = r.id_rol
      WHERE ec.id_consultor = $1
      AND ec.estado = 'Activo'
      ORDER BY ec.fecha_inicio ASC;
    `;
    const result = await ejecutarConsulta(query, [idConsultor]);
    return toCamelCase(result.rows);
  }

  async actualizar(id: string, datos: Partial<IEquipoConsultor>): Promise<IEquipoConsultor> {
    const datosBD = toSnakeCase(
      Object.fromEntries(
        Object.entries(datos).filter(([_, v]) => v !== undefined && v !== null)
      )
    );
    delete (datosBD as any).nombre_consultor;
    delete (datosBD as any).nombre_equipo_proyecto;
    delete (datosBD as any).nombre_rol;
    delete (datosBD as any).nombre_proyecto;
    delete (datosBD as any).id_proyecto;

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
    const asignacionActualizada = toCamelCase(result.rows[0]) as IEquipoConsultor;

    // Fetch additional details
    const queryDetalles = `
      SELECT 
        c.nombre as nombre_consultor,
        ep.nombre as nombre_equipo_proyecto,
        p.id_proyecto,
        p.nombre as nombre_proyecto,
        r.nombre_rol
      FROM consultores c
      JOIN equipos_proyectos ep ON ep.id_equipo_proyecto = $1
      JOIN proyectos p ON ep.id_proyecto = p.id_proyecto
      JOIN roles r ON r.id_rol = $3
      WHERE c.id_consultor = $2
    `;
    const resDetalles = await ejecutarConsulta(queryDetalles, [asignacionActualizada.idEquipoProyecto, asignacionActualizada.idConsultor, asignacionActualizada.idRol]);

    let detalles: any = {};
    if (resDetalles.rows.length > 0) {
      detalles = resDetalles.rows[0];
    }

    return {
      idEquipoConsultores: asignacionActualizada.idEquipoConsultores,
      idConsultor: asignacionActualizada.idConsultor,
      nombreConsultor: detalles.nombre_consultor,
      idEquipoProyecto: asignacionActualizada.idEquipoProyecto,
      nombreEquipoProyecto: detalles.nombre_equipo_proyecto,
      idRol: asignacionActualizada.idRol,
      nombreRol: detalles.nombre_rol,
      porcentajeDedicacion: asignacionActualizada.porcentajeDedicacion,
      fechaInicio: asignacionActualizada.fechaInicio,
      fechaFin: asignacionActualizada.fechaFin,
      estado: asignacionActualizada.estado,
      idProyecto: detalles.id_proyecto,
      nombreProyecto: detalles.nombre_proyecto
    };
  }

  async eliminar(id: string): Promise<IEquipoConsultor> {
    const query = `
      UPDATE equipos_consultores
      SET estado = 'Eliminado'
      WHERE id_equipo_consultores = $1
      RETURNING *;
    `;
    const result = await ejecutarConsulta(query, [id]);
    return toCamelCase(result.rows[0]) as IEquipoConsultor;
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
