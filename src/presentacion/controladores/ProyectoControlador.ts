import { FastifyInstance } from 'fastify';
import { Proyecto } from '../../core/dominio/proyecto/Proyecto';
import type { IProyecto } from '../../core/dominio/proyecto/IProyecto';

export async function ProyectoControlador(app: FastifyInstance) {

  // Arreglo para simular la base de datos
  const proyectos: IProyecto[] = [];

  // Crear un nuevo proyecto
  app.post('/proyectos', async (req, res) => {
    const body = req.body as Omit<IProyecto, 'id' | 'fecha_creacion'>;

    const nuevoProyecto = new Proyecto(
      proyectos.length + 1,
      body.nombre,
      body.descripcion,
      body.estado,
      body.estatus,
      body.id_cliente,
      body.fecha_inicio,
      body.fecha_entrega,
      new Date()
    );

    proyectos.push(nuevoProyecto);
    res.status(201).send(nuevoProyecto);
  });

  // Obtener todos los proyectos
  app.get('/proyectos', async (_, res) => {
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

    proyectos[index] = { ...proyectos[index], ...cambios } as IProyecto;
    res.send(proyectos[index]);
  });

  // Eliminar un proyecto cambiando su estatus a "Eliminado"
  app.delete('/proyectos/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    const proyecto = proyectos.find((p) => p.id === Number(id));

    if (!proyecto) {
      return res.status(404).send({ mensaje: 'Proyecto no encontrado' });
    }

    // Cambiamos el estatus a "Eliminado"
    proyecto.estatus = 'Eliminado';
    res.send({
      mensaje: 'Proyecto marcado como eliminado',
      proyecto
    });
  });
}
