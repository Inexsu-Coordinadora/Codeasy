import { FastifyInstance } from "fastify";
import { ProyectoRepositorioPostgres } from "../../core/infraestructura/postgres/ProyectoRepositorioPostgres";
import {
  CrearProyectoEsquema,
  ActualizarProyectoEsquema,
} from "../esquemas/ProyectoEsquema";
import type { IProyecto } from "../../core/dominio/proyecto/IProyecto";

export async function ProyectoControlador(app: FastifyInstance) {
  const repositorio = new ProyectoRepositorioPostgres();

  // 🟢 CREAR PROYECTO
  app.post<{ Body: unknown }>("/proyectos", async (req, res) => {
    const parse = CrearProyectoEsquema.safeParse(req.body);
    if (!parse.success)
      return res.status(400).send({
        errores: parse.error.issues.map((i) => i.message),
      });

    const body = parse.data;
    const nuevoProyecto = await repositorio.crear({
      ...(body as IProyecto),
      estado: "Creado",
      estatus: "Activo",
      fecha_creacion: new Date(),
    });

    res.status(201).send(nuevoProyecto);
  });

  // 🟠 ACTUALIZAR PROYECTO
  app.put<{ Params: { id: string }; Body: unknown }>("/proyectos/:id", async (req, res) => {
    const { id } = req.params;
    const parse = ActualizarProyectoEsquema.safeParse(req.body);

    if (!parse.success)
      return res.status(400).send({
        errores: parse.error.issues.map((i) => i.message),
      });

    const body = parse.data;
    const actualizado = await repositorio.actualizar(Number(id), body as Partial<IProyecto>);

    if (!actualizado)
      return res.status(404).send({ mensaje: "Proyecto no encontrado" });

    res.send(actualizado);
  });

  // 🟣 OBTENER POR ID
  app.get<{ Params: { id: string } }>("/proyectos/:id", async (req, res) => {
    const proyecto = await repositorio.obtenerPorId(Number(req.params.id));
    if (!proyecto)
      return res.status(404).send({ mensaje: "Proyecto no encontrado" });
    res.send(proyecto);
  });

  // 🟡 OBTENER TODOS
  app.get("/proyectos", async (_, res) => {
    const proyectos = await repositorio.obtenerTodos();
    res.send(proyectos);
  });

  // 🔴 ELIMINAR (LÓGICO)
  app.delete<{ Params: { id: string } }>("/proyectos/:id", async (req, res) => {
    const eliminado = await repositorio.eliminarLogico(Number(req.params.id));
    if (!eliminado)
      return res.status(404).send({ mensaje: "Proyecto no encontrado" });
    res.send({
      mensaje: "Proyecto marcado como eliminado",
      proyecto: eliminado,
    });
  });
}
