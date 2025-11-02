import { z } from "zod";

export const ConsultorCrearEsquema = z.object({
  nombre: z.string().nonempty("El nombre es obligatorio").min(3).max(100),
  identificacion: z.string().nonempty("La identificación es obligatoria").min(5).max(55),
  correo: z.email("Correo inválido").max(100),
  telefono: z.string().optional().transform((val) => val ?? null),
  especialidad: z.string().optional().transform((val) => val ?? null),
  nivelexperiencia: z.enum(["Junior", "Semi-Senior", "Senior", "Experto"]),
  disponibilidad: z.enum(["Disponible", "No disponible"]).default("Disponible"),
  estado: z.enum(["Activo", "Eliminado"]).default("Activo"),
  contrasena: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").max(255),
});

export type ConsultorCrearDTO = z.infer<typeof ConsultorCrearEsquema>;
