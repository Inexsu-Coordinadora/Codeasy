import { FastifyReply, FastifyRequest } from "fastify";
import { ConsultorCasosUso } from "../../core/aplicacion/casos-uso/Consultor/ConsultorCasosUso.js";
import  { IConsultor } from "../../core/dominio/consultor/IConsultor.js"; 
import {ConsultorActualizarEsquema } from "../esquemas/consultorActualizarEsquema.js";
import { ConsultorCrearEsquema } from "../esquemas/consultorCrearEsquema.js";


export class ConsultorControlador {
  constructor(private casosUso: ConsultorCasosUso) {}

  async registrarConsultor(req: FastifyRequest, reply: FastifyReply) {
    try {
      const datos = ConsultorCrearEsquema.parse(req.body);
      const nuevo = await this.casosUso.registrarConsultor(datos);
      return reply.code(201).send({ mensaje: "Consultor creado", data: nuevo });
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  }

 
  async listarTodosConsultores(_req: FastifyRequest, reply: FastifyReply) {
    try {
      const consultores = await this.casosUso.listarTodosConsultores();
      return reply.code(200).send(consultores);
    } catch (error: any) {
      return reply.code(500).send({ error: error.message });
    }
  }


  async obtenerConsultorPorId(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { idConsultor } = req.params as { idConsultor: number };
      const consultor = await this.casosUso.obtenerConsultorPorId( idConsultor );
      if (!consultor)
        return reply.code(404).send({ mensaje: "Consultor no encontrado" });
      return reply.code(200).send(consultor);
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  }

 
  async actualizarConsultor(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { idConsultor } = req.params as { idConsultor: number };
      const datos = ConsultorActualizarEsquema.parse(req.body);
      const actualizado = await this.casosUso.actualizarConsultor(idConsultor, datos);
      return reply.code(200).send({ mensaje: "Consultor actualizado", data: actualizado });
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  }


  async eliminarConsultor(req: FastifyRequest, reply: FastifyReply) {
    try {
      const {  idConsultor  } = req.params as {  idConsultor : number };
      await this.casosUso.eliminarConsultor( idConsultor );
      return reply.code(200).send({ mensaje: "Consultor eliminado correctamente" });
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  }
 }