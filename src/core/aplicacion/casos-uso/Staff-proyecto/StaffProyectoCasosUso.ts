import type { IStaffProyecto } from "../../../dominio/staff-proyecto/IStaffProyecto";
import type { IStaffProyectoRepositorio } from "../../../dominio/staff-proyecto/repositorio/IStaffProyectoRepositorio";
import type { IProyectoRepositorio } from "../../../dominio/proyecto/repositorio/IProyectoRepositorio";
import type { IConsultorRepositorio } from "../../../dominio/consultor/repositorio/IConsultorRepositorio";

export class StaffProyectoCasosUso {
  constructor(
    private staffRepositorio: IStaffProyectoRepositorio,
    private proyectoRepositorio: IProyectoRepositorio,
    private consultorRepositorio: IConsultorRepositorio
  ) {}

  // Asignar consultor a proyecto
  async asignarConsultorAProyecto(
    id_proyecto: string,
    datos: IStaffProyecto
  ): Promise<IStaffProyecto> {
    const {
      id_consultor,
      id_rol,
      porcentaje_dedicacion,
      fecha_inicio,
      fecha_fin,
    } = datos;

    // Verificar existencia de proyecto
    const proyecto = await this.proyectoRepositorio.obtenerProyectoPorId(id_proyecto);
    if (!proyecto) {
      throw new Error("El proyecto especificado no existe");
    }

    // Verificar existencia de consultor
    const consultor = await this.consultorRepositorio.obtenerConsultorPorId(id_consultor);
    if (!consultor) {
      throw new Error("El consultor especificado no existe");
    }

    // Verificar duplicado (consultor + proyecto + rol)
    const duplicado = await this.staffRepositorio.buscarDuplicado(
      id_consultor,
      id_proyecto,
      id_rol
    );
    if (duplicado) {
      throw new Error("Ya existe una asignación idéntica para este consultor en el proyecto");
    }

    // Validar coherencia de fechas
    const inicioNueva = new Date(fecha_inicio);
    const finNueva = new Date(fecha_fin);

    if (finNueva < inicioNueva) {
      throw new Error("La fecha de fin no puede ser anterior a la fecha de inicio");
    }

    // Validar dedicación acumulada del consultor
    const asignaciones = await this.staffRepositorio.obtenerAsignacionesPorConsultor(id_consultor);

    const traslapadas = asignaciones.filter((a: IStaffProyecto) => {
      const inicioExistente = new Date(a.fecha_inicio);
      const finExistente = new Date(a.fecha_fin);
      // se traslapan si hay cruce de rangos
      return inicioExistente <= finNueva && finExistente >= inicioNueva;
    });

    const sumaDedicacion = traslapadas.reduce(
      (acc: number, a: IStaffProyecto) => acc + Number(a.porcentaje_dedicacion),
      0
    );

    const total = sumaDedicacion + porcentaje_dedicacion;

    if (total > 100) {
      throw new Error(`La dedicación total del consultor superaría el 100% (${total}%)`);
    }

    // Registrar la asignación
    const nuevaAsignacion: IStaffProyecto = {
      id_consultor,
      id_proyecto,
      id_rol,
      porcentaje_dedicacion,
      fecha_inicio,
      fecha_fin,
    };

    const resultado = await this.staffRepositorio.crearAsignacion(nuevaAsignacion);
    return resultado;
  }
}