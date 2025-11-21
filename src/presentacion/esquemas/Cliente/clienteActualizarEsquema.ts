import {z} from "zod";

export const ClienteActualizarEsquema = z.object({
    nombre : z.string().optional(),
    identificacion: z.string().optional(),
    email: z.string().email().optional(),
    telefono : z.string().optional().transform((val) => val ?? null)

})

export type ClienteActualizarDTO = z.infer<typeof ClienteActualizarEsquema>