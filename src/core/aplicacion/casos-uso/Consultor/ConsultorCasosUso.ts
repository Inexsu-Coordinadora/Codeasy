import  {IConsultor} from "../../../dominio/consultor/IConsultor";
import  {Consultor} from "../../../dominio/consultor/Consultor";
import  { IConsultorRepositorio } from "./IConsultorCasosUso";
import  { ConsultorCrearDTO } from "../../../../presentacion/esquemas/consultorCrearEsquema";
import  { ConsultorActualizarDTO } from "../../../../presentacion/esquemas/consultorActualizarEsquema";
import { AppError } from "../../../../presentacion/esquemas/middlewares/AppError";

export class ConsultorCasosUso {
  constructor(private consultorRepositorio: IConsultorRepositorio) {}


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
      estado: "Activo",
      disponibilidad: "Disponible",
    });


    const consultorCreado = await this.consultorRepositorio.registrarConsultor(nuevoConsultor);

    return consultorCreado; 
  }


  async listarTodosConsultores(): Promise<IConsultor[]> {
    return await this.consultorRepositorio.listarTodosConsultores();
  }

 
  async obtenerConsultorPorId(id_consultor: string): Promise<IConsultor | null> {
    const consultor = await this.consultorRepositorio.obtenerConsultorPorId(id_consultor);
    if (!consultor) {
    throw new AppError(`No se encontró un consultor con el ID ${id_consultor}`);
  }
    return consultor;
  }


  async actualizarConsultor(id_consultor: string, datos: ConsultorActualizarDTO): Promise<IConsultor> {
  const consultorExistente = await this.consultorRepositorio.obtenerConsultorPorId(id_consultor);

  if (!consultorExistente) {
    throw new AppError(`No se encontró el consultor con ID ${id_consultor}`);
  }


  const consultorActualizado = {
  ...consultorExistente,
  ...datos,
}as IConsultor;


  const resultado = await this.consultorRepositorio.actualizarConsultor(
    id_consultor,
    consultorActualizado as IConsultor
  );

  return resultado;
}



  async eliminarConsultor(id_consultor: string): Promise<void> {
    const consultorExistente = await this.consultorRepositorio.obtenerConsultorPorId(id_consultor);

     if (!consultorExistente || consultorExistente.estado === "Eliminado") {
    throw new AppError(`No se encontró el consultor con ID ${id_consultor}`);
  }

    consultorExistente.estado = "Eliminado";

    await this.consultorRepositorio.actualizarConsultor(id_consultor, consultorExistente);
  }

  
}