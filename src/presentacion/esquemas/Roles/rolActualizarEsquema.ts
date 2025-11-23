import { z } from "zod";

export const RolActualizarEsquema = z
  .object({
    nombre_rol: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(50, "El nombre no puede tener más de 50 caracteres")
      .optional(),

    descripcion: z
      .string()
      .min(3, "La descripción debe tener al menos 3 caracteres")
      .max(55, "La descripción no puede tener más de 55 caracteres")
      .optional(),

    estado: z
      .enum(["Activo", "Eliminado"])
      .optional(),
  })
  .strict()
  .transform((data) => ({
    nombreRol: data.nombre_rol,
    descripcion: data.descripcion,
    estado: data.estado,
  }));

export type RolActualizarDTO = z.infer<typeof RolActualizarEsquema>;
