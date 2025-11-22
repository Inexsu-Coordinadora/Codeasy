export const CodigosHttp = {
  OK: 200,
  CREADO: 201,
  SIN_CONTENIDO: 204,
  SOLICITUD_INCORRECTA: 400,
  NO_AUTORIZADO: 401,
  PROHIBIDO: 403,
  NO_ENCONTRADO: 404,
  CONFLICTO: 409,
  ERROR_INTERNO: 500,
} as const;

export type CodigoHttp = typeof CodigosHttp[keyof typeof CodigosHttp];