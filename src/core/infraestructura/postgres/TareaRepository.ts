import { ITareaRepositorio } from "../../dominio/tarea/repositorio/ITareaRepositorio.js";
import { ITarea } from "../../dominio/tarea/ITarea.js";
import { ejecutarConsulta } from "./clientepostgres.js";
import { AppError } from "../../../presentacion/esquemas/middlewares/AppError.js";

export class TareaRepositorio implements ITareaRepositorio {

  
  private async validarDuplicidadPorProyecto(
    idStaffProyecto: string,
    titulo: string,
    idTareaExcluir?: string
  ): Promise<void> {
    // Obtener id_proyecto desde staff_proyecto
    const staffInfoRes = await ejecutarConsulta(
      `SELECT id_proyecto FROM staff_proyecto WHERE id_staff_proyecto = $1`,
      [idStaffProyecto]
    );
    if ((staffInfoRes.rowCount ?? 0) === 0) {
      throw new AppError('El staff_proyecto especificado no existe.', 404, { idStaffProyecto });
    }
    const idProyecto = staffInfoRes.rows[0].id_proyecto;

    // Validar duplicidad por proyecto
    const dupQuery = idTareaExcluir
      ? `
        SELECT 1
        FROM tareas t
        INNER JOIN staff_proyecto sp ON t.id_staff_proyecto = sp.id_staff_proyecto
        WHERE sp.id_proyecto = $1
          AND lower(t.titulo) = lower($2)
          AND t.estado != 'Eliminado'
          AND t.id_tarea <> $3
        LIMIT 1;
      `
      : `
        SELECT 1
        FROM tareas t
        INNER JOIN staff_proyecto sp ON t.id_staff_proyecto = sp.id_staff_proyecto
        WHERE sp.id_proyecto = $1
          AND lower(t.titulo) = lower($2)
          AND t.estado != 'Eliminado'
        LIMIT 1;
      `;

    const params = idTareaExcluir ? [idProyecto, titulo, idTareaExcluir] : [idProyecto, titulo];
    const dup = await ejecutarConsulta(dupQuery, params);
    
    if ((dup.rowCount ?? 0) > 0) {
      throw new AppError('Ya existe una tarea con el mismo título en este proyecto.', 409, { titulo });
    }
  }


  private async validarFechaLimiteProyecto(
    idStaffProyecto: string,
    fechaLimite: Date | null
  ): Promise<void> {
    if (!fechaLimite) return; // Si no hay fecha límite, no validar

    // Obtener id_proyecto desde staff_proyecto
    const staffInfoRes = await ejecutarConsulta(
      `SELECT id_proyecto FROM staff_proyecto WHERE id_staff_proyecto = $1`,
      [idStaffProyecto]
    );
    if ((staffInfoRes.rowCount ?? 0) === 0) {
      throw new AppError('El staff_proyecto especificado no existe.', 404, { idStaffProyecto });
    }
    const idProyecto = staffInfoRes.rows[0].id_proyecto;

    // Obtener rango de fechas del proyecto
    const proyectoRes = await ejecutarConsulta(
      `SELECT fecha_inicio, fecha_entrega FROM proyectos WHERE id_proyecto = $1`,
      [idProyecto]
    );
    if ((proyectoRes.rowCount ?? 0) === 0) {
      throw new AppError('El proyecto asociado no existe.', 404, { idProyecto });
    }

    const fechaInicioProyecto = new Date(proyectoRes.rows[0].fecha_inicio);
    const fechaEntregaProyecto = new Date(proyectoRes.rows[0].fecha_entrega);

    // Validar que la fecha límite esté dentro del rango del proyecto
    if (fechaLimite < fechaInicioProyecto) {
      throw new AppError('La fecha límite de la tarea no puede ser anterior a la fecha de inicio del proyecto.', 400, `fechaLimite: ${fechaLimite}, fechaInicioProyecto: ${fechaInicioProyecto}`);
    }
    if (fechaLimite > fechaEntregaProyecto) {
      throw new AppError('La fecha límite de la tarea no puede ser posterior a la fecha de entrega del proyecto.', 400, `fechaLimite: ${fechaLimite}, fechaEntregaProyecto: ${fechaEntregaProyecto}`);
    }

    // También validar contra fecha_fin del staff_proyecto (si existe)
    const staffFechaRes = await ejecutarConsulta(
      `SELECT fecha_fin FROM staff_proyecto WHERE id_staff_proyecto = $1`,
      [idStaffProyecto]
    );
    const fechaFinStaff: Date | null = staffFechaRes.rows[0]?.fecha_fin ?? null;

    if (fechaFinStaff && fechaLimite > fechaFinStaff) {
      throw new AppError('La fecha límite de la tarea no puede superar la fecha fin de la asignación del staff.', 400, `fechaLimite: ${fechaLimite}, fechaFinStaff: ${fechaFinStaff}`);
    }
  }




  async registrarTarea(tarea: ITarea): Promise<ITarea> {
    // 1️⃣ Validar que el staff exista
    const validarStaffQuery = `
      SELECT id_staff_proyecto 
      FROM staff_proyecto 
      WHERE id_staff_proyecto = $1;
    `;
    const staff = await ejecutarConsulta(validarStaffQuery, [tarea.asignadoA]);

    if ((staff.rowCount ?? 0) === 0) {
      throw new AppError('El consultor no está asignado.', 404, { idStaffProyecto: tarea.asignadoA });
    }

    // 2️⃣ Validar duplicidad por proyecto
    await this.validarDuplicidadPorProyecto(tarea.asignadoA, tarea.titulo);

    // 3️⃣ Validar fecha límite dentro del rango del proyecto
    await this.validarFechaLimiteProyecto(tarea.asignadoA, tarea.fechaFinalizacion);

    // 4️⃣ Insertar la tarea
    const insertQuery = `
      INSERT INTO tareas (
        titulo, descripcion, estado_tarea, prioridad, fecha_creacion, fecha_limite, id_staff_proyecto, estado
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
      tarea.estatus ?? 'Activo',
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
      asignadoA: row.id_staff_proyecto,
      estatus: row.estado,
    };

    return tareaCreada;
  }



  async listarTodasTareas(): Promise<ITarea[]> {
    const query = `SELECT * FROM tareas WHERE estado != 'Eliminado';`;
    const result = await ejecutarConsulta(query, []);
    return result.rows;
  }


  async obtenerTareaPorId(idTarea: string): Promise<ITarea | null> {
    const query = `SELECT * FROM tareas WHERE id_tarea = $1 AND estado != 'Eliminado';`;
    const result = await ejecutarConsulta(query, [idTarea]);
    const row = result.rows[0];
    if (!row) return null;
    // Mapear fila BD -> ITarea (camelCase)
    return {
      idTarea: row.id_tarea,
      titulo: row.titulo,
      descripcion: row.descripcion,
      estadoTarea: row.estado_tarea,
      prioridad: row.prioridad,
      fechaCreacion: row.fecha_creacion,
      fechaFinalizacion: row.fecha_limite,
      asignadoA: row.id_staff_proyecto, // <-- Mapear correctamente
      estatus: row.estado,
    };
  }


  async actualizarTarea(idTarea: string, datos: Partial<ITarea>): Promise<ITarea> {
    // Obtener tarea existente para valores por defecto
    const tareaExistente = await this.obtenerTareaPorId(idTarea);
    if (!tareaExistente) {
      throw new AppError(`Tarea con ID ${idTarea} no encontrada`, 404);
    }

    // Calcular valores efectivos después de la actualización
    const effTitulo = datos.titulo ?? tareaExistente.titulo;
    const effAsignadoA = datos.asignadoA ?? tareaExistente.asignadoA;
    const effFechaFinalizacion = datos.fechaFinalizacion ?? tareaExistente.fechaFinalizacion;

    // Validar duplicidad si se cambió título o asignadoA
    if (datos.titulo || datos.asignadoA) {
      await this.validarDuplicidadPorProyecto(effAsignadoA, effTitulo, idTarea);
    }

    // Validar fecha límite si se cambió fechaFinalizacion o asignadoA
    if (datos.fechaFinalizacion || datos.asignadoA) {
      await this.validarFechaLimiteProyecto(effAsignadoA, effFechaFinalizacion);
    }

    // Mapear camelCase -> snake_case (solo campos actualizables)
    const fieldMap: Record<string, string> = {
      titulo: 'titulo',
      descripcion: 'descripcion',
      estadoTarea: 'estado_tarea',
      prioridad: 'prioridad',
      fechaCreacion: 'fecha_creacion',
      fechaFinalizacion: 'fecha_limite',
      asignadoA: 'id_staff_proyecto',
      estatus: 'estado',
    };

    const columnas: string[] = [];
    const parametros: any[] = [];
    let idx = 1;

    // Solo incluir campos que están definidos en datos y en el fieldMap
    for (const [k, v] of Object.entries(datos)) {
      if (v === undefined || v === null) continue;
      const col = fieldMap[k];
      if (!col) continue; // Ignorar campos que no están en el mapa
      columnas.push(`${col}=$${idx++}`);
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
      RETURNING *;
    `;

    const result = await ejecutarConsulta(query, parametros);
    const row = result.rows[0];
    if (!row) throw new AppError(`No se pudo actualizar la tarea con ID ${idTarea}`, 400);

    // Mapear respuesta BD -> ITarea (camelCase)
    return {
      idTarea: row.id_tarea,
      titulo: row.titulo,
      descripcion: row.descripcion,
      estadoTarea: row.estado_tarea,
      prioridad: row.prioridad,
      fechaCreacion: row.fecha_creacion,
      fechaFinalizacion: row.fecha_limite,
      asignadoA: row.id_staff_proyecto,
      estatus: row.estado,
    };
  }


  async eliminarTarea(idTarea: string): Promise<void> {
    const query = `
      UPDATE tareas
      SET estado='Eliminado'
      WHERE id_tarea=$1
      AND estado != 'Eliminado';
    `;
    const result = await ejecutarConsulta(query, [idTarea]);
    if (result.rowCount === 0) {
      throw new AppError(`No se encontró la tarea con ID ${idTarea} para eliminar`, 404);
    }
  }

}
