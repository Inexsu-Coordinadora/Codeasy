import { z } from "zod";

export const RolCrearEsquema = z
  .object({
    nombre_rol: z
      .string()
      .nonempty("El nombre del rol es obligatorio")
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(50, "El nombre no puede tener más de 50 caracteres"),

    descripcion: z
      .string()
      .nonempty("La descripción es obligatoria")
      .min(3, "La descripción debe tener al menos 3 caracteres")
      .max(55, "La descripción no puede tener más de 55 caracteres"),
  })
  .strict()
  .transform((data) => ({
    nombreRol: data.nombre_rol,
    descripcion: data.descripcion,
  }));

export type RolCrearDTO = z.infer<typeof RolCrearEsquema>;
