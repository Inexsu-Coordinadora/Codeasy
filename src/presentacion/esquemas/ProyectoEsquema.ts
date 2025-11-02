import { z } from "zod";

// Esquema base del proyecto con validaciones completas y detección de campos no permitidos 

const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

// Campos válidos esperados para un proyecto
const camposValidos = ["nombre", "descripcion", "id_cliente", "fecha_inicio", "fecha_entrega", "estado"];

export const ProyectoBaseEsquema = z
  .object({
    nombre: z
      .string("El nombre es obligatorio")
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre no puede exceder los 100 caracteres"),

    descripcion: z
      .string("La descripción es obligatoria")
      .min(5, "La descripción debe tener al menos 5 caracteres")
      .max(255, "La descripción no puede exceder los 255 caracteres"),

    id_cliente: z
      .number("El ID del cliente es obligatorio")
      .int("El ID del cliente debe ser un número entero")
      .positive("El ID del cliente debe ser positivo"),

    fecha_inicio: z.preprocess(
      (val) => (typeof val === "string" || val instanceof Date ? new Date(val) : val),
      z.date("La fecha de inicio no es válida")
    ),

    fecha_entrega: z.preprocess(
      (val) => (typeof val === "string" || val instanceof Date ? new Date(val) : val),
      z.date("La fecha de entrega no es válida")
    ),
  })
  .strict() // Zod rechazará automáticamente campos no definidos en el esquema
  .superRefine((data, ctx) => {
    // Detectar campos faltantes
    const requeridos = ["nombre", "descripcion", "id_cliente", "fecha_inicio", "fecha_entrega"];
    const faltantes = requeridos.filter((campo) => !(campo in data));
    if (faltantes.length > 0) {
      ctx.addIssue({
        code: "custom",
        message: `Faltan campos requeridos: ${faltantes.join(", ")}`,
      });
    }

    // Detectar campos adicionales no permitidos
    const recibidos = Object.keys(data);
    const adicionales = recibidos.filter((campo) => !camposValidos.includes(campo));
    if (adicionales.length > 0) {
      ctx.addIssue({
        code: "custom",
        message: `Se enviaron campos no permitidos: ${adicionales.join(", ")}`,
      });
    }

    // Validar fechas
    const inicio = data.fecha_inicio;
    const entrega = data.fecha_entrega;

    if (inicio instanceof Date && inicio < hoy) {
      ctx.addIssue({
        code: "custom",
        message: "La fecha de inicio no puede ser anterior a la fecha actual",
        path: ["fecha_inicio"],
      });
    }

    if (inicio instanceof Date && entrega instanceof Date && entrega < inicio) {
      ctx.addIssue({
        code: "custom",
        message: "La fecha de entrega no puede ser anterior a la fecha de inicio",
        path: ["fecha_entrega"],
      });
    }
  });

// Esquema para creación de proyectos
export const CrearProyectoEsquema = ProyectoBaseEsquema;

// Esquema para actualización (campos opcionales pero valida coherencia y campos extra)
export const ActualizarProyectoEsquema = ProyectoBaseEsquema
  .partial()
  .extend({
    estado: z.enum(["Creado", "En proceso", "Finalizado"]).optional(),
  })
  .strict() // también detecta campos extra en update
  .superRefine((data, ctx) => {
    const recibidos = Object.keys(data);
    const adicionales = recibidos.filter((campo) => !camposValidos.includes(campo));
    if (adicionales.length > 0) {
      ctx.addIssue({
        code: "custom",
        message: `Se enviaron campos no permitidos: ${adicionales.join(", ")}`,
      });
    }

    if (data.fecha_inicio && data.fecha_entrega && data.fecha_entrega < data.fecha_inicio) {
      ctx.addIssue({
        code: "custom",
        message: "La fecha de entrega no puede ser anterior a la fecha de inicio",
        path: ["fecha_entrega"],
      });
    }
  });

export type ProyectoCrearDTO = z.infer<typeof CrearProyectoEsquema>;
export type ProyectoActualizarDTO = z.infer<typeof ActualizarProyectoEsquema>;
