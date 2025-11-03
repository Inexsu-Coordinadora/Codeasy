import { FastifyReply, FastifyRequest } from "fastify";
import { ClienteCasosUso} from "../../core/aplicacion/casos-uso/ClienteCasosUso";
import { ClienteActualizarEsquema } from "../esquemas/clienteActualizarEsquema";
import { ClienteCrearEsquema} from "../esquemas/clienteCrearEsquema";
// para la lógica del error.
import { ZodError } from "zod";

/// Manejo de peticiones http
export class ClienteControlador {
 constructor(private casosUso: ClienteCasosUso) {}

 /**
   * Función privada para manejar todos los errores de forma consistente.
   *  Se usa ZodError.flatten() para obtener mensajes limpios.
   */
 private manejarError(reply: FastifyReply, error: any) {
  console.error(error);
  let statusCode = 500; 
  let mensajeErrorLimpio: string;

  if (error instanceof ZodError) {
    const flattenedErrors = error.flatten();
    statusCode = 400; 

        const fieldErrors = flattenedErrors.fieldErrors as Record<string, string[] | undefined>;

        if (Object.keys(fieldErrors).length > 0) {
            const firstFieldName = Object.keys(fieldErrors)[0];
            const firstErrorMessage = fieldErrors[firstFieldName]?.[0];
            
            if (firstErrorMessage) {
                mensajeErrorLimpio = `${firstFieldName}: ${firstErrorMessage}`;
            } else {
                mensajeErrorLimpio = "Error de validación de datos en un campo específico.";
            }

        } else {
            mensajeErrorLimpio = flattenedErrors.formErrors?.[0] ?? "Error de validación de datos.";
        }


  } else {
    mensajeErrorLimpio = error.message ?? "Error interno del servidor.";

    
    if (mensajeErrorLimpio.includes("no encontrado")) {
     statusCode = 404;
    } else if (mensajeErrorLimpio.includes("Ya existe") || mensajeErrorLimpio.includes("en uso")) {
     statusCode = 409; 
    } else {
     statusCode = 500; 
     mensajeErrorLimpio = "Error interno del servidor.";
    }
  }
  return reply.code(statusCode).send({ error: mensajeErrorLimpio });
 }

/* ENDPOINTS*/

/**
   * Registra un nuevo cliente.
   */
 async registrarCliente(req: FastifyRequest, reply: FastifyReply) {
  try {
  const datos = ClienteCrearEsquema.parse(req.body);  
   const idClienteCreado = await this.casosUso.registrarCliente(datos);
   
   return reply.code(201).send({ 
    mensaje: "Cliente creado exitosamente", 
    idCliente: idClienteCreado 
   });

 } catch (error: any) {
   return this.manejarError(reply, error); 
 }
 }
 
 /**
   * Listar todos los clientes.
   */
 async listarTodosClientes(_req: FastifyRequest, reply: FastifyReply) {
  try {
   const clientes = await this.casosUso.listarTodosClientes();
   return reply.code(200).send(clientes);
  } catch (error: any) 
  {   return this.manejarError(reply, error); // Uso del manejador unificado
  }
 }
 /**
   * Obtiener un cliente por su ID numérico.
   */
 async obtenerClientePorId(req: FastifyRequest, reply: FastifyReply) {
  try {
 
   const { idCliente } = req.params as { idCliente: string };
   const idClienteNumber = parseInt(idCliente, 10);
  
   if (isNaN(idClienteNumber)) {
    return reply.code(400).send({ error: "El ID del cliente debe ser un número válido." });
   }

   const cliente = await this.casosUso.obtenerClientePorId(idClienteNumber);

   if (!cliente) {
 
   return reply.code(404).send({ error: `Cliente con ID ${idClienteNumber} no encontrado` });
  }

   return reply.code(200).send(cliente);
 
   } catch (error: any) {
   return this.manejarError(reply, error); 
  }
 }

 /**
   * Actualiza parcialmente un cliente.
   */
 async actualizarCliente(req: FastifyRequest, reply: FastifyReply) {
  try {
   const { idCliente } = req.params as { idCliente: string };    const idClienteNumber = parseInt(idCliente, 10);
  
   if (isNaN(idClienteNumber)) {
    return reply.code(400).send({ error: "El ID del cliente debe ser un número válido." });
   }
   
   // La validación de Zod aquí puede lanzar el ZodError
  const datos = ClienteActualizarEsquema.parse(req.body);
  const actualizado = await this.casosUso.actualizarCliente(idClienteNumber, datos);
 
   return reply.code(200).send({ 
  mensaje: "Cliente actualizado exitosamente", 
  data: actualizado 
   });
 
  } catch (error: any) {
   return this.manejarError(reply, error); 
   }
 }

/**
   * Eliminar un cliente por su ID.
   */
 async eliminarCliente(req: FastifyRequest, reply: FastifyReply) {
  try {
  const { idCliente } = req.params as { idCliente: string };
   const idClienteNumber = parseInt(idCliente, 10);

   if (isNaN(idClienteNumber)) {
   return reply.code(400).send({ error: "El ID del cliente debe ser un número válido." });
   }

   await this.casosUso.eliminarCliente(idClienteNumber);

    return reply.code(200).send({ mensaje: `Cliente con ID ${idClienteNumber} eliminado correctamente` });
 
 } catch (error: any) {
 return this.manejarError(reply, error); // Uso del manejador unificado
 }
 }
}
