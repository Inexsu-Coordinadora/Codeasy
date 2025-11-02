import  {IConsultor} from "../../../dominio/consultor/IConsultor.js";
import  {Consultor} from "../../../dominio/consultor/Consultor.js";
import  { IConsultorRepositorio } from "./IConsultorCasosUso.js";
import  { ConsultorCrearDTO } from "../../../../presentacion/esquemas/consultorCrearEsquema.js";
import  { ConsultorActualizarDTO } from "../../../../presentacion/esquemas/consultorActualizarEsquema.js";

export class ConsultorCasosUso {
  constructor(private consultorRepositorio: IConsultorRepositorio) {}


  async registrarConsultor(datos: ConsultorCrearDTO): Promise<IConsultor> {
   
    const existente = await this.consultorRepositorio.buscarPorCorreoOIdentificacion(
      datos.correo,
      datos.identificacion
    );

    if (existente) {
      throw new Error("Ya existe un consultor con ese correo o identificación");
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
    return consultor;
  }


  async actualizarConsultor(idConsultor: number, datos: ConsultorActualizarDTO): Promise<IConsultor> {
  const consultorExistente = await this.consultorRepositorio.obtenerConsultorPorId(idConsultor);

  if (!consultorExistente) {
    throw new Error(`No se encontró el consultor con ID ${idConsultor}`);
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

    if (!consultorExistente) {
      throw new Error(`No se encontró el consultor con ID ${idConsultor}`);
    }

    if (consultorExistente.estado === "Eliminado") {
      throw new Error(`El consultor con ID ${idConsultor} ya está eliminado.`);
    }


    consultorExistente.estado = "Eliminado";

    await this.consultorRepositorio.actualizarConsultor(idConsultor, consultorExistente);
  }
}