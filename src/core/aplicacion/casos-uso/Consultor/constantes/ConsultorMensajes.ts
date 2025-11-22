export const consultorMensajes = {
  concultorDuplicado: "Ya existe un consultor con ese correo o identificación.",
  consultorNoEncontrado: "No se encontró un consultor con el ID",
  consultorestadoEliminado: (id: string) => `El consultor con id ${id} no existe`,
} as const;
