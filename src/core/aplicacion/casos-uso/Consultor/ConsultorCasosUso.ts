import  {IConsultor} from "../../../dominio/consultor/IConsultor.js";
import  {Consultor} from "../../../dominio/consultor/Consultor.js";
import  { IConsultorRepositorio } from "./IConsultorCasosUso.js";
import type { IEquipoConsultorRepositorio } from "../../../dominio/equipos-consultores/repositorio/IEquipoConsultorRepositorio.js";
import  { ConsultorCrearDTO } from "../../../../presentacion/esquemas/Consultores/consultorCrearEsquema";
import  { ConsultorActualizarDTO } from "../../../../presentacion/esquemas/Consultores/consultorActualizarEsquema";
import { AppError } from "../../../../common/middlewares/AppError";

export class ConsultorCasosUso {
  constructor(private consultorRepositorio: IConsultorRepositorio, private equipoConsultorRepositorio: IEquipoConsultorRepositorio) {}


  async registrarConsultor(datos: ConsultorCrearDTO): Promise<IConsultor> {
   
    const existente = await this.consultorRepositorio.buscarPorCorreoOIdentificacion(
      datos.correo,
      datos.identificacion
    );

    if (existente) {
      throw new AppError("Ya existe un consultor con ese correo o identificación");
    }


    const nuevoConsultor = new Consultor({
      ...datos,
      estado: "Activo"
    });


    const consultorCreado = await this.consultorRepositorio.registrarConsultor(nuevoConsultor);

    return consultorCreado; 
  }


  async listarTodosConsultores(): Promise<IConsultor[]> {
    return await this.consultorRepositorio.listarTodosConsultores();
  }

 
  async obtenerConsultorPorId(idConsultor: string): Promise<IConsultor | null> {
    const consultor = await this.consultorRepositorio.obtenerConsultorPorId(idConsultor);
    if (!consultor) {
    throw new AppError(`No se encontró un consultor con el ID ${idConsultor}`);
  }
    return consultor;
  }


  async actualizarConsultor(idConsultor: string, datos: ConsultorActualizarDTO): Promise<IConsultor> {
  const consultorExistente = await this.consultorRepositorio.obtenerConsultorPorId(idConsultor);

  if (!consultorExistente) {
    throw new AppError(`No se encontró el consultor con ID ${idConsultor}`);
  }


  const consultorActualizado = {
  ...consultorExistente,
  ...datos,
}as IConsultor;


  const resultado = await this.consultorRepositorio.actualizarConsultor(
    idConsultor,
    consultorActualizado as IConsultor
  );

  return resultado;
}



  async eliminarConsultor(idConsultor: string): Promise<void> {
    const consultorExistente = await this.consultorRepositorio.obtenerConsultorPorId(idConsultor);

     if (!consultorExistente || consultorExistente.estado === "Eliminado") {
    throw new AppError(`No se encontró el consultor con ID ${idConsultor}`);
  }

    consultorExistente.estado = "Eliminado";

    await this.consultorRepositorio.actualizarConsultor(idConsultor, consultorExistente);
    
    // Eliminar asignaciones del consultor
    await this.equipoConsultorRepositorio.eliminarPorConsultor(idConsultor);
  }
}