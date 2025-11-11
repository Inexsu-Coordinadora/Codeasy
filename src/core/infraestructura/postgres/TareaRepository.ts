import { ITareaRepositorio } from "../../dominio/tarea/repositorio/ITareaRepositorio";
import { ITarea } from "../../dominio/tarea/ITarea";
import { ejecutarConsulta } from "./clientepostgres";

export class TareaRepositorio implements ITareaRepositorio {

  
async registrarTarea(tarea: ITarea): Promise<ITarea> {

  // 1️⃣ Validar que el staff exista
  const validarStaffQuery = `
    SELECT id_staff_proyecto 
    FROM staff_proyecto 
    WHERE id_staff_proyecto = $1;
  `;
  const staff = await ejecutarConsulta(validarStaffQuery, [tarea.asignadoA]);

  if (staff.rowCount === 0) {
    throw new Error('El consultor no está asignado.');
  }
 // Evitar título duplicado para el mismo asignado (case-insensitive) en tareas no eliminadas
  const dupQuery = `
  SELECT 1
  FROM tareas
  WHERE id_staff_proyecto = $1
    AND lower(titulo) = lower($2)
    AND estado != 'Eliminado'
  LIMIT 1;
  `;
  const dup = await ejecutarConsulta(dupQuery, [tarea.asignadoA, tarea.titulo]);
  if (dup.rowCount > 0) {
  throw new Error(`Ya existe una tarea con el mismo título para este asignado.`);
  }


   // No permitir que la fecha de finalización supere la fecha_fin del staff_proyecto
   const staffFechaRes = await ejecutarConsulta(
    `SELECT fecha_fin FROM staff_proyecto WHERE id_staff_proyecto = $1`,
    [tarea.asignadoA]
  );
  const fechaFinStaff: Date | null = staffFechaRes.rows[0]?.fecha_fin ?? null;

  if (tarea.fechaFinalizacion && fechaFinStaff && tarea.fechaFinalizacion > fechaFinStaff) {
    throw new Error(`La fecha de finalización de la tarea no puede superar la fecha fin de la asignación del staff.`);
  }

  // Mapear ITarea (camelCase) a columnas de BD (snake_case)
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
    return result.rows[0] || null;
  }


  async actualizarTarea(idTarea: string, datos: Partial<ITarea>): Promise<ITarea> {
    // Mapear camelCase -> snake_case
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

    for (const [k, v] of Object.entries(datos)) {
      if (v === undefined || v === null) continue;
      const col = fieldMap[k];
      if (!col) continue;
      columnas.push(`${col}=$${idx++}`);
      parametros.push(v);
    }

    if (columnas.length === 0) {
      const existente = await this.obtenerTareaPorId(idTarea);
      if (!existente) throw new Error(`Tarea con ID ${idTarea} no encontrada`);
      return existente;
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
    if (!row) throw new Error(`No se pudo actualizar la tarea con ID ${idTarea}`);

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
      throw new Error(`No se encontró la tarea con ID ${idTarea} para eliminar`);
    }
  }

}
