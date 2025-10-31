import { z } from 'zod';

export const CrearProyectoEsquema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
  estado: z.enum(['Creado', 'En proceso', 'Finalizado']),
  estatus: z.enum(['Activo', 'Eliminado']),
  id_cliente: z.number().int().positive(),
  fecha_inicio: z.coerce.date(),
  fecha_entrega: z.coerce.date(),
});

export type ProyectoDTO = z.infer<typeof CrearProyectoEsquema>;
