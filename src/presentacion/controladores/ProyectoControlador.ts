import { FastifyInstance } from 'fastify';
import { ProyectoRepositorioPostgres } from '../../core/infraestructura/postgres/ProyectoRepositorioPostgres';
import { validarProyecto } from '../../presentacion/validaciones/ValidarProyecto';
import type { IProyecto } from '../../core/dominio/proyecto/IProyecto';

/**
 * Controlador de Proyectos
 * Encapsula las rutas y operaciones CRUD.
 * Utiliza la implementación del repositorio PostgreSQL.
 */
export async function ProyectoControlador(app: FastifyInstance) {
  const repositorio = new ProyectoRepositorioPostgres();

  // 🟢 CREAR PROYECTO
  app.post<{ Body: Partial<IProyecto> }>('/proyectos', async (req, res) => {
    const body = req.body;
    const errores = validarProyecto(body, true);
    if (errores.length > 0) {
      return res.status(400).send({ errores });
    }

    const nuevoProyecto = await repositorio.crear({
      ...body,
      estado: 'Creado',
      estatus: 'Activo',
      fecha_creacion: new Date(),
    } as IProyecto);

    res.status(201).send(nuevoProyecto);
  });

  // 🟡 LISTAR TODOS LOS PROYECTOS
  app.get('/proyectos', async (_, res) => {
    const proyectos = await repositorio.obtenerTodos();
    res.send(proyectos);
  });

  // 🟣 OBTENER PROYECTO POR ID
  app.get<{ Params: { id: string } }>('/proyectos/:id', async (req, res) => {
    const { id } = req.params;
    const proyecto = await repositorio.obtenerPorId(Number(id));

    if (!proyecto) {
      return res.status(404).send({ mensaje: 'Proyecto no encontrado' });
    }

    res.send(proyecto);
  });

  // 🟠 ACTUALIZAR PROYECTO
  app.put<{ Params: { id: string }; Body: Partial<IProyecto> }>('/proyectos/:id', async (req, res) => {
    const { id } = req.params;
    const cambios = req.body;

    const errores = validarProyecto(cambios, false);
    if (errores.length > 0) {
      return res.status(400).send({ errores });
    }

    const actualizado = await repositorio.actualizar(Number(id), cambios);
    if (!actualizado) {
      return res.status(404).send({ mensaje: 'Proyecto no encontrado' });
    }

    res.send(actualizado);
  });

  // 🔴 ELIMINAR LÓGICAMENTE UN PROYECTO
  app.delete<{ Params: { id: string } }>('/proyectos/:id', async (req, res) => {
    const { id } = req.params;

    const eliminado = await repositorio.eliminarLogico(Number(id));
    if (!eliminado) {
      return res.status(404).send({ mensaje: 'Proyecto no encontrado' });
    }

    res.send({
      mensaje: 'Proyecto marcado como eliminado',
      proyecto: eliminado,
    });
  });
}
