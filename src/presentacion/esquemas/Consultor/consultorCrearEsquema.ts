import { z } from "zod";

export const ConsultorCrearEsquema = z.object({
  nombre: z
    .string()
    .nonempty("El nombre es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres"),

  identificacion: z
    .string()
    .nonempty("La identificación es obligatoria")
    .min(5, "La identificación debe tener al menos 5 caracteres")
    .max(55, "La identificación no puede tener más de 55 caracteres"),

  correo: z
    .email("El correo es obligatorio y debe tener un formato válido")
    .max(100, "El correo no puede tener más de 100 caracteres"),

  telefono: z
    .string()
    .optional()
    .transform((val) => val ?? null),

  especialidad: z
    .string()
    .optional()
    .transform((val) => val ?? null),

  nivel_experiencia: z
    .enum(["Junior", "Semi-Senior", "Senior", "Experto"], {
      message:
        "El nivel de experiencia debe ser uno de: Junior, Semi-Senior, Senior o Experto",
    }),

  disponibilidad: z
    .enum(["Disponible", "No disponible"], {
      message: "La disponibilidad debe ser 'Disponible' o 'No disponible'",
    })
    .default("Disponible"),

});

export type ConsultorCrearDTO = z.infer<typeof ConsultorCrearEsquema>;
