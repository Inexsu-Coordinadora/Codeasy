import type { IProyecto } from '../../core/dominio/proyecto/IProyecto';

// Valida los datos de un proyecto

export function validarProyecto(
  data: Partial<IProyecto>,
  esCreacion: boolean = false
): string[] {
  const errores: string[] = [];

  // Campos permitidos por operación
  const camposPermitidos = esCreacion
    ? ['nombre', 'descripcion', 'id_cliente', 'fecha_inicio', 'fecha_entrega']
    : ['nombre', 'descripcion', 'id_cliente', 'fecha_inicio', 'fecha_entrega', 'estado'];

  // Detectar campos no permitidos
  const camposRecibidos = Object.keys(data);
  const adicionales = camposRecibidos.filter((c) => !camposPermitidos.includes(c));
  if (adicionales.length > 0) {
    errores.push(`Se enviaron campos no permitidos: ${adicionales.join(', ')}`);
  }

  // Requeridos en creación
  if (esCreacion) {
    const faltantes = ['nombre', 'descripcion', 'id_cliente', 'fecha_inicio', 'fecha_entrega']
      .filter((c) => !(c in data));
    if (faltantes.length > 0) {
      errores.push(`Faltan campos obligatorios: ${faltantes.join(', ')}`);
    }
  }

  // Validaciones básicas
  if (data.nombre && data.nombre.trim().length < 3) {
    errores.push('El nombre debe tener al menos 3 caracteres');
  }

  if (data.descripcion && data.descripcion.trim().length < 5) {
    errores.push('La descripción debe tener al menos 5 caracteres');
  }

  if (data.estado) {
    const validos = ['Creado', 'En proceso', 'Finalizado'];
    if (!validos.includes(data.estado)) {
      errores.push(`Estado inválido. Debe ser uno de: ${validos.join(', ')}`);
    }
  }

  if (data.id_cliente !== undefined) {
    if (isNaN(Number(data.id_cliente)) || data.id_cliente <= 0) {
      errores.push('ID de cliente inválido (debe ser un número entero positivo)');
    }
  }

  // Validar fechas
  if (data.fecha_inicio && data.fecha_entrega) {
  const fInicio = new Date(data.fecha_inicio);
  const fEntrega = new Date(data.fecha_entrega);

  if (isNaN(fInicio.getTime())) errores.push('La fecha de inicio no es válida');
  if (isNaN(fEntrega.getTime())) errores.push('La fecha de entrega no es válida');

  // Validar coherencia entre fechas
  if (fEntrega < fInicio)
    errores.push('La fecha de entrega no puede ser anterior a la fecha de inicio');

  // Validar que la fecha de inicio no esté en el pasado
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // eliminar horas para comparar solo fecha
  if (fInicio < hoy)
    errores.push('La fecha de inicio no puede ser anterior a la fecha actual');
  } else if (esCreacion) {
    errores.push('Ambas fechas son obligatorias');
  }

  return errores;
}
