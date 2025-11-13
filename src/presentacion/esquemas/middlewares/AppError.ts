// AppError.ts
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly detalles?: any;

  constructor(mensaje: string, statusCode = 400, detalles?: any) {
    super(mensaje);
    this.statusCode = statusCode;
    this.detalles = detalles;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

//  Errores genéricos reutilizables
export class NoEncontradoError extends AppError {
  constructor(entidad: string, id?: number | string) {
    const mensaje = id 
      ? `${entidad} con ID ${id} no encontrado`
      : `${entidad} no encontrado`;
    super(mensaje, 404);
    this.name = 'NoEncontradoError';
  }
}

export class YaExisteError extends AppError {
  constructor(entidad: string, campo?: string, valor?: any) {
    const mensaje = campo 
      ? `Ya existe un ${entidad} con ${campo}: ${valor}`
      : `${entidad} ya existe`;
    super(mensaje, 409);
    this.name = 'YaExisteError';
  }
}

export class ErrorValidacion extends AppError {
  constructor(mensaje: string, errores?: any) {
    super(mensaje, 400, errores);
    this.name = 'ErrorValidacion';
  }
}




