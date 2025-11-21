import { ITareaRepositorio } from "../../dominio/tarea/repositorio/ITareaRepositorio.js";
import { ITarea } from "../../dominio/tarea/ITarea.js";
import { ejecutarConsulta } from "./clientepostgres.js";


export class TareaRepositorio implements ITareaRepositorio {

  /**
   * Obtiene el id_proyecto asociado a un equipo_consultor
   */
  async obtenerIdProyecto(idEquipoConsultor: string): Promise<string | null> {
    const query = `
      SELECT ep.id_proyecto 
      FROM equipos_consultores ec
      INNER JOIN equipos_proyectos ep ON ec.id_equipo_proyecto = ep.id_equipo_proyecto
      WHERE ec.id_equipo_consultores = $1
        AND ep.estado = 'Activo';
    `;
    const result = await ejecutarConsulta(query, [idEquipoConsultor]);
    
    return result.rows.length > 0 ? result.rows[0].id_proyecto : null;
  }

  /**
   * Verifica si existe una tarea con el mismo título en el proyecto
   */
  async existeTituloEnProyecto(
    idProyecto: string,
    titulo: string,
    idTareaExcluir?: string
  ): Promise<boolean> {
    const query = idTareaExcluir
      ? `
        SELECT 1
        FROM tareas t
        INNER JOIN equipos_consultores ec ON t.id_equipos_consultores = ec.id_equipo_consultores
        INNER JOIN equipos_proyectos ep ON ec.id_equipo_proyecto = ep.id_equipo_proyecto
        WHERE ep.id_proyecto = $1
          AND lower(t.titulo) = lower($2)
          AND t.estado != 'Eliminado'
          AND t.id_tarea != $3
        LIMIT 1;
      `
      : `
        SELECT 1
        FROM tareas t
        INNER JOIN equipos_consultores ec ON t.id_equipos_consultores = ec.id_equipo_consultores
        INNER JOIN equipos_proyectos ep ON ec.id_equipo_proyecto = ep.id_equipo_proyecto
        WHERE ep.id_proyecto = $1
          AND lower(t.titulo) = lower($2)
          AND t.estado != 'Eliminado'
        LIMIT 1;
      `;

    const params = idTareaExcluir 
      ? [idProyecto, titulo, idTareaExcluir] 
      : [idProyecto, titulo];
    
    const result = await ejecutarConsulta(query, params);
    
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Obtiene el rango de fechas de asignación de un consultor
   */
  async obtenerRangoFechasConsultor(
    idEquipoConsultor: string
  ): Promise<{ fechaInicio: Date | null; fechaFin: Date | null } | null> {
    const query = `
      SELECT fecha_inicio, fecha_fin 
      FROM equipos_consultores 
      WHERE id_equipo_consultores = $1;
    `;
    
    const result = await ejecutarConsulta(query, [idEquipoConsultor]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      fechaInicio: row.fecha_inicio ? new Date(row.fecha_inicio) : null,
      fechaFin: row.fecha_fin ? new Date(row.fecha_fin) : null,
    };
  }

  /**
   * Verifica si un equipo consultor existe y está activo
   */
  async equipoConsultorEstaActivo(idEquipoConsultor: string): Promise<boolean> {
    const query = `
      SELECT 1
      FROM equipos_consultores 
      WHERE id_equipo_consultores = $1 
        AND estado = 'Activo'
      LIMIT 1;
    `;
    
    const result = await ejecutarConsulta(query, [idEquipoConsultor]);
    
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Registra una nueva tarea en el sistema
   */
  async registrarTarea(tarea: ITarea): Promise<ITarea> {
    const insertQuery = `
      INSERT INTO tareas (
        titulo, 
        descripcion, 
        estado_tarea, 
        prioridad, 
        fecha_creacion, 
        fecha_limite, 
        id_equipos_consultores, 
        estado
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      ) RETURNING *;
    `;
    
    const insertParams = [
      tarea.titulo,
      tarea.descripcion,
      tarea.estadoTarea ?? 'pendiente',
      tarea.prioridad ?? 'Media',
      tarea.fechaCreacion ?? new Date(),
      tarea.fechaFinalizacion ?? null,
      tarea.asignadoA,
      tarea.estado ?? 'Activo',
    ];

    const insertResult = await ejecutarConsulta(insertQuery, insertParams);
    const row = insertResult.rows[0];

    return {
      idTarea: row.id_tarea,
      titulo: row.titulo,
      descripcion: row.descripcion,
      estadoTarea: row.estado_tarea,
      prioridad: row.prioridad,
      fechaCreacion: row.fecha_creacion,
      fechaFinalizacion: row.fecha_limite,
      asignadoA: row.id_equipos_consultores,
      estado: row.estado,
    };
  }

  /**
   * Lista todas las tareas activas del sistema
   */
  async listarTodasTareas(): Promise<ITarea[]> {
    const query = `
      SELECT * 
      FROM tareas 
      WHERE estado != 'Eliminado'
      ORDER BY fecha_creacion DESC;
    `;
    const result = await ejecutarConsulta(query, []);
    
    return result.rows.map(row => ({
      idTarea: row.id_tarea,
      titulo: row.titulo,
      descripcion: row.descripcion,
      estadoTarea: row.estado_tarea,
      prioridad: row.prioridad,
      fechaCreacion: row.fecha_creacion,
      fechaFinalizacion: row.fecha_limite,
      asignadoA: row.id_equipos_consultores,
      estado: row.estado,
    }));
  }

  /**
   * Obtiene una tarea por su ID
   */
  async obtenerTareaPorId(idTarea: string): Promise<ITarea | null> {
    const query = `
      SELECT * 
      FROM tareas 
      WHERE id_tarea = $1 
        AND estado != 'Eliminado';
    `;
    const result = await ejecutarConsulta(query, [idTarea]);
    const row = result.rows[0];
    
    if (!row) return null;

    return {
      idTarea: row.id_tarea,
      titulo: row.titulo,
      descripcion: row.descripcion,
      estadoTarea: row.estado_tarea,
      prioridad: row.prioridad,
      fechaCreacion: row.fecha_creacion,
      fechaFinalizacion: row.fecha_limite,
      asignadoA: row.id_equipos_consultores,
      estado: row.estado,
    };
  }

  /**
   * Actualiza una tarea existente
   */
  async actualizarTarea(idTarea: string, datos: Partial<ITarea> | null): Promise<ITarea | null> {
    // Si no hay datos para actualizar, retornar la tarea actual
    if (!datos) {
      return await this.obtenerTareaPorId(idTarea);
    }

    const fieldMap: Record<string, string> = {
      titulo: 'titulo',
      descripcion: 'descripcion',
      estadoTarea: 'estado_tarea',
      prioridad: 'prioridad',
      fechaCreacion: 'fecha_creacion',
      fechaFinalizacion: 'fecha_limite',
      asignadoA: 'id_equipos_consultores',
      estado: 'estado',
    };

    const columnas: string[] = [];
    const parametros: any[] = [];
    let idx = 1;

    // Solo incluir campos definidos (undefined = no actualizar, null = actualizar a null)
    for (const [k, v] of Object.entries(datos)) {
      if (v === undefined) continue;
      const col = fieldMap[k];
      if (!col) continue;
      columnas.push(`${col} = $${idx++}`);
      parametros.push(v);
    }

    if (columnas.length === 0) {
      return await this.obtenerTareaPorId(idTarea);
    }

    parametros.push(idTarea);

    const query = `
      UPDATE tareas
      SET ${columnas.join(", ")}
      WHERE id_tarea = $${parametros.length}
        AND estado != 'Eliminado'
      RETURNING *;
    `;

    const result = await ejecutarConsulta(query, parametros);
    const row = result.rows[0];
    
    if (!row) return null;

    return {
      idTarea: row.id_tarea,
      titulo: row.titulo,
      descripcion: row.descripcion,
      estadoTarea: row.estado_tarea,
      prioridad: row.prioridad,
      fechaCreacion: row.fecha_creacion,
      fechaFinalizacion: row.fecha_limite,
      asignadoA: row.id_equipos_consultores,
      estado: row.estado,
    };
  }

  /**
   * Elimina lógicamente una tarea (soft delete)
   */
  async eliminarTarea(idTarea: string): Promise<void> {
    const query = `
      UPDATE tareas
      SET estado = 'Eliminado'
      WHERE id_tarea = $1;
    `;
    await ejecutarConsulta(query, [idTarea]);
  }
}
