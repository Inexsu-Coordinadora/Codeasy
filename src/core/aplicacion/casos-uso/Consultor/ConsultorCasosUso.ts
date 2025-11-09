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

 
  async obtenerConsultorPorId(idConsultor: number): Promise<IConsultor | null> {
    const consultor = await this.consultorRepositorio.obtenerConsultorPorId(idConsultor);
    if (!consultor) {
    throw new AppError(`No se encontró un consultor con el ID ${idConsultor}`);
  }
    return consultor;
  }


  async actualizarConsultor(idConsultor: number, datos: ConsultorActualizarDTO): Promise<IConsultor> {
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



  async eliminarConsultor(idConsultor: number): Promise<void> {
    const consultorExistente = await this.consultorRepositorio.obtenerConsultorPorId(idConsultor);

     if (!consultorExistente || consultorExistente.estado === "Eliminado") {
    throw new AppError(`No se encontró el consultor con ID ${idConsultor}`);
  }

    consultorExistente.estado = "Eliminado";

    await this.consultorRepositorio.actualizarConsultor(idConsultor, consultorExistente);
  }
}