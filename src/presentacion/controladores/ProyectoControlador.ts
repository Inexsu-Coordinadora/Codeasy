import { FastifyInstance } from 'fastify';
import { Proyecto } from '../../core/dominio/proyecto/Proyecto';
import type { IProyecto } from '../../core/dominio/proyecto/IProyecto';
import { validarProyecto } from '../validaciones/validarProyecto';


export async function ProyectoControlador(app: FastifyInstance) {
  // Simulación de base de datos temporal
  const proyectos: IProyecto[] = [];

  // Crear un nuevo proyecto
  app.post('/proyectos', async (req, res) => {
    const body = req.body as Partial<IProyecto>;

    // Validar datos (el validador detecta si hay campos no permitidos)
    const errores = validarProyecto(body, true);
    if (errores.length > 0) {
      return res.status(400).send({ errores });
    }

    // Asignar campos controlados por el sistema
    const nuevoProyecto = new Proyecto(
      proyectos.length + 1, // ID simulado (en PostgreSQL será autoincremental)
      body.nombre!,
      body.descripcion!,
      'Creado', // estado inicial automático
      'Activo', // estatus inicial automático
      body.id_cliente!,
      new Date(body.fecha_inicio!),
      new Date(body.fecha_entrega!),
      new Date() // fecha_creacion automática
    );

    // En BD: await repositorio.crearProyecto(nuevoProyecto)
    proyectos.push(nuevoProyecto);
    res.status(201).send(nuevoProyecto);
  });

  // Obtener todos los proyectos
  app.get('/proyectos', async (_, res) => {
    // 🚧 En BD: const proyectos = await repositorio.obtenerTodos()
    res.send(proyectos);
  });

  // Obtener un proyecto por ID
  app.get('/proyectos/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    const proyecto = proyectos.find((p) => p.id === Number(id));

    if (!proyecto) {
      return res.status(404).send({ mensaje: 'Proyecto no encontrado' });
    }

    res.send(proyecto);
  });

  // Actualizar un proyecto
  app.put('/proyectos/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    const cambios = req.body as Partial<IProyecto>;

    const index = proyectos.findIndex((p) => p.id === Number(id));
    if (index === -1) {
      return res.status(404).send({ mensaje: 'Proyecto no encontrado' });
    }

    // Validar cambios (se ignoran campos no permitidos)
    const errores = validarProyecto(cambios, false);
    if (errores.length > 0) {
      return res.status(400).send({ errores });
    }

    const actual = proyectos[index]!;
    proyectos[index] = { ...actual, ...cambios } as IProyecto;

    // En BD: await repositorio.actualizarProyecto(id, cambios)
    res.send(proyectos[index]);
  });

  // Eliminar (lógicamente) un proyecto
  app.delete('/proyectos/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    const proyecto = proyectos.find((p) => p.id === Number(id));

    if (!proyecto) {
      return res.status(404).send({ mensaje: 'Proyecto no encontrado' });
    }

    // 🔹 Cambiar el estatus del proyecto (eliminación lógica)
    proyecto.estatus = 'Eliminado';

    // En BD: await repositorio.marcarEliminado(id)
    res.send({
      mensaje: 'Proyecto marcado como eliminado',
      proyecto
    });
  });
}
