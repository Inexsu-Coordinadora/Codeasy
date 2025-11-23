// Mensajes de error y constantes para validaciones de Tarea para desacoplar el código

export const CONSULTOR_INACTIVO = 'El consultor no está asignado o no está activo en el equipo.';
export const EQUIPO_SIN_PROYECTO = 'El equipo_consultor especificado no existe o no está asociado a un proyecto.';
export const TITULO_DUPLICADO = "Ya existe una tarea con el título en el proyecto asociado.";
export const FECHA_FINALIZACION_INVALIDA = 'La fecha de finalización debe ser posterior a la fecha de creación';
export const RANGO_CONSULTOR_NO_OBTENIDO = 'No se pudo obtener el rango de fechas del consultor.';
export const FECHA_ANTERIOR_A_INICIO_CONSULTOR = 'La fecha límite de la tarea no puede ser anterior a la fecha de inicio de la asignación del consultor.';
export const FECHA_SUPERA_FIN_CONSULTOR = 'La fecha límite de la tarea no puede superar la fecha fin de la asignación del consultor.';
export const TAREA_YA_COMPLETADA = 'La tarea ya está marcada como completada. El estado ya fue aplicado.';
