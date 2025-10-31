import { IProyecto } from '../../dominio/proyecto/IProyecto';
import { Proyecto } from '../../dominio/proyecto/Proyecto';
import { IProyectosCasosUso } from './IProyectoCasosUso';

export class ProyectosCasosUso implements IProyectosCasosUso {
  private proyectos: IProyecto[] = [];

  async obtenerProyectos(limite?: number): Promise<IProyecto[]> {
    const activos = this.proyectos.filter((p) => p.estatus === 'Activo');
    return limite ? activos.slice(0, limite) : activos;
  }

  async obtenerProyectoPorId(id: number): Promise<IProyecto | null> {
    return this.proyectos.find((p) => p.id === id) || null;
  }

  async crearProyecto(data: Omit<IProyecto, 'id' | 'fecha_creacion'>): Promise<number> {
    const nuevoId = this.proyectos.length + 1;
    const nuevoProyecto = new Proyecto(
      nuevoId,
      data.nombre,
      data.descripcion,
      data.estado,
      data.estatus,
      data.id_cliente,
      data.fecha_inicio,
      data.fecha_entrega,
      new Date()
    );
    this.proyectos.push(nuevoProyecto);
    return nuevoId;
  }

  async actualizarProyecto(id: number, data: IProyecto): Promise<IProyecto | null> {
    const index = this.proyectos.findIndex((p) => p.id === id);
    if (index === -1) return null;

    this.proyectos[index] = { ...data, id };
    return this.proyectos[index];
  }

  async eliminarProyecto(id: number): Promise<void> {
    const proyecto = this.proyectos.find((p) => p.id === id);
    if (proyecto) {
      proyecto.estatus = 'Eliminado';
    }
  }
}
