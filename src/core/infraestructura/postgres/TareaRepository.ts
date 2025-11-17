import { ITareaRepositorio } from "../../dominio/tarea/repositorio/ITareaRepositorio.js";
import { ITarea } from "../../dominio/tarea/ITarea.js";
import { ejecutarConsulta } from "./clientepostgres.js";
import { AppError } from "../../../presentacion/esquemas/middlewares/AppError.js";

export class TareaRepositorio implements ITareaRepositorio {

  /**
   * Obtiene el id_proyecto asociado a un equipo_consultor
   */
  private async obtenerIdProyecto(idEquipoConsultor: string): Promise<string> {
    const query = `
      SELECT ep.id_proyecto 
      FROM equipos_consultores ec
      INNER JOIN equipos_proyectos ep ON ec.id_equipo_proyecto = ep.id_equipo_proyecto
      WHERE ec.id_equipo_consultores = $1;
    `;
    const result = await ejecutarConsulta(query, [idEquipoConsultor]);
    
    if ((result.rowCount ?? 0) === 0) {
      throw new AppError(
        'El equipo_consultor especificado no existe o no está asociado a un proyecto.', 
        404, 
        { idEquipoConsultor }
      );
    }
    
    return result.rows[0].id_proyecto;
  }

  /**
   * Valida que no exista una tarea con el mismo título en el proyecto
   */
  private async validarDuplicidadPorProyecto(
    idEquipoConsultor: string,
    titulo: string,
    idTareaExcluir?: string
  ): Promise<void> {
    // Obtener id_proyecto a través de equipos_consultores -> equipos_proyectos
    const idProyecto = await this.obtenerIdProyecto(idEquipoConsultor);

    // Validar duplicidad por proyecto
    const dupQuery = idTareaExcluir
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
    
    const dup = await ejecutarConsulta(dupQuery, params);
    
    if ((dup.rowCount ?? 0) > 0) {
      throw new AppError(
        `Ya existe una tarea con el título '${titulo}' en el proyecto asociado.`,
        409,
        { idProyecto, titulo }
      );
    }
  }

  /**
   * Valida que la fecha límite esté dentro del rango de la asignación del consultor
   */
  private async validarFechaLimiteConsultor(
    idEquipoConsultor: string,
    fechaLimite: Date | null
  ): Promise<void> {
    if (!fechaLimite) return;

    // Obtener fechas de la asignación del consultor
    const equipoConsultorRes = await ejecutarConsulta(
      `SELECT fecha_inicio, fecha_fin FROM equipos_consultores WHERE id_equipo_consultores = $1`,
      [idEquipoConsultor]
    );
    
    if ((equipoConsultorRes.rowCount ?? 0) === 0) {
      throw new AppError(
        'El equipo_consultor especificado no existe.', 
        404, 
        { idEquipoConsultor }
      );
    }

    const fechaInicioConsultor = equipoConsultorRes.rows[0].fecha_inicio 
      ? new Date(equipoConsultorRes.rows[0].fecha_inicio) 
      : null;
    const fechaFinConsultor = equipoConsultorRes.rows[0].fecha_fin 
      ? new Date(equipoConsultorRes.rows[0].fecha_fin) 
      : null;

    // Validar contra fecha_inicio del consultor (si existe)
    if (fechaInicioConsultor && fechaLimite < fechaInicioConsultor) {
      throw new AppError(
        'La fecha límite de la tarea no puede ser anterior a la fecha de inicio de la asignación del consultor.', 
        400, 
        { fechaLimite: fechaLimite.toISOString(), fechaInicioConsultor: fechaInicioConsultor.toISOString() }
      );
    }

    // Validar contra fecha_fin del consultor (si existe)
    if (fechaFinConsultor && fechaLimite > fechaFinConsultor) {
      throw new AppError(
        'La fecha límite de la tarea no puede superar la fecha fin de la asignación del consultor.', 
        400, 
        { fechaLimite: fechaLimite.toISOString(), fechaFinConsultor: fechaFinConsultor.toISOString() }
      );
    }
  }

  /**
   * Registra una nueva tarea en el sistema
   */
  async registrarTarea(tarea: ITarea): Promise<ITarea> {
    // 1️⃣ Validar que el equipo_consultor exista y esté activo
    const validarEquipoQuery = `
      SELECT id_equipo_consultores 
      FROM equipos_consultores 
      WHERE id_equipo_consultores = $1 
        AND estado = 'Activo';
    `;
    const equipoConsultor = await ejecutarConsulta(validarEquipoQuery, [tarea.asignadoA]);

    if ((equipoConsultor.rowCount ?? 0) === 0) {
      throw new AppError(
        'El consultor no está asignado o no está activo en el equipo.', 
        404, 
        { idEquipoConsultor: tarea.asignadoA }
      );
    }

    // 2️⃣ Validar duplicidad por proyecto
    await this.validarDuplicidadPorProyecto(tarea.asignadoA, tarea.titulo);

    // 3️⃣ Validar fecha límite dentro del rango del consultor
    await this.validarFechaLimiteConsultor(tarea.asignadoA, tarea.fechaFinalizacion);

    // 4️⃣ Insertar la tarea
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

    // Mapear fila BD -> ITarea (camelCase)
    const tareaCreada: ITarea = {
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

    return tareaCreada;
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
  async actualizarTarea(idTarea: string, datos: Partial<ITarea>): Promise<ITarea> {
    // Obtener tarea existente
    const tareaExistente = await this.obtenerTareaPorId(idTarea);
    if (!tareaExistente) {
      throw new AppError(`Tarea con ID ${idTarea} no encontrada`, 404);
    }

    // Calcular valores efectivos después de la actualización
    const effTitulo = datos.titulo ?? tareaExistente.titulo;
    const effAsignadoA = datos.asignadoA ?? tareaExistente.asignadoA;
    const effFechaFinalizacion = datos.fechaFinalizacion !== undefined 
      ? datos.fechaFinalizacion 
      : tareaExistente.fechaFinalizacion;

    // Validar que el equipo_consultor existe si se está cambiando
    if (datos.asignadoA) {
      const validarEquipoQuery = `
        SELECT id_equipo_consultores 
        FROM equipos_consultores 
        WHERE id_equipo_consultores = $1 
          AND estado = 'Activo';
      `;
      const equipoConsultor = await ejecutarConsulta(validarEquipoQuery, [datos.asignadoA]);

      if ((equipoConsultor.rowCount ?? 0) === 0) {
        throw new AppError(
          'El consultor no está asignado o no está activo en el equipo.', 
          404, 
          { idEquipoConsultor: datos.asignadoA }
        );
      }
    }

    // Validar duplicidad si se cambió título o asignadoA
    if (datos.titulo !== undefined || datos.asignadoA !== undefined) {
      await this.validarDuplicidadPorProyecto(effAsignadoA, effTitulo, idTarea);
    }

    // Validar fecha límite si se cambió fechaFinalizacion o asignadoA
    if (datos.fechaFinalizacion !== undefined || datos.asignadoA !== undefined) {
      await this.validarFechaLimiteConsultor(effAsignadoA, effFechaFinalizacion);
    }

    // Mapear camelCase -> snake_case
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
      return tareaExistente;
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
    
    if (!row) {
      throw new AppError(`No se pudo actualizar la tarea con ID ${idTarea}`, 400);
    }

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
      WHERE id_tarea = $1
        AND estado != 'Eliminado';
    `;
    const result = await ejecutarConsulta(query, [idTarea]);
    
    if ((result.rowCount ?? 0) === 0) {
      throw new AppError(
        `No se encontró la tarea con ID ${idTarea} para eliminar`, 
        404
      );
    }
  }
}