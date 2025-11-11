import { FastifyRequest, FastifyReply } from "fastify";
import { ParteHoraCasosUso } from "../../core/aplicacion/casos-uso/ParteHora/ParteHoraCasosUso";

export class ParteHoraControlador {
  constructor(private parteHoraCasosUso: ParteHoraCasosUso) {}

  // Registrar parte de horas
  async registrarParteHora(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const datos = request.body as {
      id_proyecto: string;
      id_consultor: string;
      fecha: Date;
      cantidad_horas: number;
      descripcion: string;
    };

    const parteRegistrado = await this.parteHoraCasosUso.registrarParteHora(datos);

    reply.status(201).send({
      exito: true,
      mensaje: "Horas registradas exitosamente",
      data: parteRegistrado,
    });
  }

  // Consultar partes por proyecto
  async consultarPartesPorProyecto(
    request: FastifyRequest<{ Params: { id_proyecto: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { id_proyecto } = request.params;

    const partes = await this.parteHoraCasosUso.consultarPartesPorProyecto(id_proyecto);

    reply.status(200).send({
      exito: true,
      mensaje: partes.length > 0
        ? "Horas consultadas exitosamente"
        : "No se encontraron horas registradas para este proyecto",
      data: partes,
      total: partes.length,
    });
  }

  // Consultar partes por consultor
  async consultarPartesPorConsultor(
    request: FastifyRequest<{ Params: { id_consultor: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { id_consultor } = request.params;

    const partes = await this.parteHoraCasosUso.consultarPartesPorConsultor(id_consultor);

    reply.status(200).send({
      exito: true,
      mensaje: partes.length > 0
        ? "Horas consultadas exitosamente"
        : "No se encontraron horas registradas para este consultor",
      data: partes,
      total: partes.length,
    });
  }
}
