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
    tarea.estadoTarea ?? 'Creada',
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
  const tareaData = { ...tarea };

  const columnas = Object.keys(tareaData);
  const valores = Object.values(tareaData).filter(v => v !== undefined && v !== null);
  const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

  const query = `
    INSERT INTO tareas (${columnas.join(", ")})
    VALUES (${placeholders})
    RETURNING *;
  `;

  const resultado = await ejecutarConsulta(query, valores);
  return resultado.rows[0];
}


  async listarTodasTareas(): Promise<ITarea[]> {
    const query = `SELECT * FROM Tareas WHERE estatus != 'Eliminado';`;
    const result = await ejecutarConsulta(query, []);
    return result.rows;
  }


  async obtenerTareaPorId(idTarea: number): Promise<ITarea | null> {
    const query = `SELECT * FROM Tareas WHERE idTarea = $1 AND estatus != 'Eliminado';`;
    const result = await ejecutarConsulta(query, [idTarea]);
    return result.rows[0] || null;
  }


 async actualizarTarea(idTarea: number, datos: Partial<ITarea>): Promise<ITarea> {
  const datosLimpios = Object.fromEntries(
    Object.entries(datos).filter(([_, v]) => v !== null && v !== undefined)
  );

  const columnas = Object.keys(datosLimpios); 
  const parametros = Object.values(datosLimpios);
  const setClause = columnas.map((col, i) => `${col}=$${i + 1}`).join(", ");

  parametros.push(idTarea);

  const query = `
    UPDATE tareas
    SET ${setClause}
    WHERE idtarea=$${parametros.length}
    RETURNING *;
  `;

  const result = await ejecutarConsulta(query, parametros);
  return result.rows[0];
}


  async eliminarTarea(idTarea: number): Promise<void> {
    const query = `
      UPDATE Tareas
      SET estatus='Eliminado'
      WHERE idTarea=$1
      AND estatus != 'Eliminado';
    `;
    const result = await ejecutarConsulta(query, [idTarea]);
    if (result.rowCount === 0) {
      throw new Error(`No se encontró la tarea con ID ${idTarea} para eliminar`);
    }
  }

}
