import { FastifyReply, FastifyRequest } from "fastify";
import { RolCasosUso } from "../../core/aplicacion/casos-uso/Rol/RolCasosUso";
import type { RolCrearDTO } from "../esquemas/Roles/rolCrearEsquema";
import type { RolActualizarDTO } from "../esquemas/Roles/rolActualizarEsquema";

export class RolControlador {
  constructor(private casosUso: RolCasosUso) {}

    
    // CREAR ROL
    async crearRol(req: FastifyRequest, reply: FastifyReply) {
        const datos = req.body as RolCrearDTO;

        const rol = await this.casosUso.crearRol({
        nombreRol: datos.nombreRol,
        descripcion: datos.descripcion
        });

        return reply.code(201).send({
        exito: true,
        mensaje: "Rol creado correctamente.",
        data: rol,
        });
    }

    // LISTAR ROLES
    async listarRoles(_req: FastifyRequest, reply: FastifyReply) {
        const roles = await this.casosUso.listarRoles();
        return reply.code(200).send({
        exito: true,
        mensaje: "Roles obtenidos correctamente.",
        data: roles,
        });
    }

    // OBTENER ROL POR ID
    async obtenerRolPorId(req: FastifyRequest, reply: FastifyReply) {
        const { idRol } = req.params as { idRol: string };

        const rol = await this.casosUso.obtenerRolPorId(idRol);

        return reply.code(200).send({
        exito: true,
        mensaje: "Rol obtenido correctamente.",
        data: rol,
        });
    }

    // ACTUALIZAR ROL
    async actualizarRol(req: FastifyRequest, reply: FastifyReply) {
        const { idRol } = req.params as { idRol: string };
        const datos = req.body as RolActualizarDTO;

        const rolActualizado = await this.casosUso.actualizarRol(idRol, datos);

        return reply.code(200).send({
        exito: true,
        mensaje: "Rol actualizado correctamente.",
        data: rolActualizado,
        });
    }

    // ELIMINAR ROL (LÓGICO)
    async eliminarRol(req: FastifyRequest, reply: FastifyReply) {
        const { idRol } = req.params as { idRol: string };

        const rol = await this.casosUso.eliminarRol(idRol);

        return reply.code(200).send({
        exito: true,
        mensaje: "Rol eliminado correctamente.",
        data: rol
        });
    }
}
