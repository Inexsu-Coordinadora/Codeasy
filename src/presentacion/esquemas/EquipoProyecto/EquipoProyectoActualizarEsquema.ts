import { z } from "zod";

export const EquipoProyectoActualizarEsquema = z
  .object({
    nombre: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(255, "El nombre no puede tener más de 255 caracteres")
      .optional(),

    fecha_inicio: z
      .string()
      .refine((fecha) => !isNaN(Date.parse(fecha)), {
        message: "La fecha de inicio debe tener un formato válido (YYYY-MM-DD)",
      })
      .optional(),

    fecha_fin: z
      .string()
      .refine((fecha) => !isNaN(Date.parse(fecha)), {
        message: "La fecha de fin debe tener un formato válido (YYYY-MM-DD)",
      })
      .optional(),
  })
  .refine(
    (data) =>
      !data.fecha_inicio ||
      !data.fecha_fin ||
      new Date(data.fecha_fin) >= new Date(data.fecha_inicio),
    {
      message: "La fecha de fin debe ser igual o posterior a la fecha de inicio",
      path: ["fecha_fin"],
    }
  )
  .strict()
  .transform((data) => ({
    nombre: data.nombre,
    fechaInicio: data.fecha_inicio,
    fechaFin: data.fecha_fin,
  }));

export type EquipoProyectoActualizarDTO = z.infer<
  typeof EquipoProyectoActualizarEsquema
>;
