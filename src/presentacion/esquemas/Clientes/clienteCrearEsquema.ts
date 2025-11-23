import {z} from "zod";

export const ClienteCrearEsquema = z.object({
  

  nombre: z
    .string()
    .nonempty("El nombre del cliente es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder los 100 caracteres"),

  identificacion: z
    .string()
    .nonempty("La identificación es obligatoria")
    .min(5, "La identificación debe tener al menos 5 caracteres")
    .max(20, "La identificación no puede exceder los 20 caracteres"),

  email: z
    .email("El correo es obligatorio y debe tener un formato válido")
    .max(100, "El correo no puede tener más de 100 caracteres"),
  
  telefono: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 dígitos")
    .max(15, "El teléfono no puede exceder los 15 dígitos") 
    .optional() 
    .transform((val) => val ?? null),

    estado: z.literal("Activo").or(z.literal("Eliminado")),

});

export type ClienteCrearDTO = z.infer<typeof ClienteCrearEsquema>;
