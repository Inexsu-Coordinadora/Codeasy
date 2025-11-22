import { IConsultorRepositorio } from "../../dominio/consultor/repositorio/IConsultorRepositorio.js";
import { IConsultor } from "../../dominio/consultor/IConsultor.js";
import { ejecutarConsulta } from "./clientepostgres.js";
import { toSnakeCase } from "../../utils/toSnakeCase.js";
import { toCamelCase } from "../../utils/toCamelCase.js";

export class ConsultorRepositorio implements IConsultorRepositorio {

  async registrarConsultor(consultor: IConsultor): Promise<IConsultor> {

  const consultorBD = toSnakeCase(consultor);

  const columnas = Object.keys(consultorBD);
  const valores = Object.values(consultorBD).map(v =>
    v === null ? "" : v
  ) as (string | Date)[];


  const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

  const query = `
    INSERT INTO consultores (${columnas.join(", ")})
    VALUES (${placeholders})
    RETURNING *;
  `;


  const resultado = await ejecutarConsulta(query, valores);

  return toCamelCase(resultado.rows[0]) as IConsultor;
}





  async listarTodosConsultores(): Promise<IConsultor[]> {
    const query = `SELECT * FROM consultores WHERE estado != 'Eliminado';`;
    const result = await ejecutarConsulta(query, []);
    return result.rows ;
  }


  async obtenerConsultorPorId(idConsultor: string): Promise<IConsultor | null> {
    const query = `SELECT * FROM consultores WHERE id_consultor = $1 AND estado != 'Eliminado'`;
    const result = await ejecutarConsulta(query, [idConsultor]);
    return result.rows[0] || null;
  }

  
  async actualizarConsultor(idConsultor: string, datos: IConsultor): Promise<IConsultor> {
  const datosLimpios = Object.fromEntries(
    Object.entries(datos).filter(([_, v]) => v !== null && v !== undefined)
  );

  const columnas = Object.keys(datosLimpios).map((key) => key.toLowerCase());
  const parametros = Object.values(datosLimpios);
  const setClause = columnas.map((col, i) => `${col}=$${i + 1}`).join(", ");
  parametros.push(idConsultor);

  const query = `
    UPDATE consultores
    SET ${setClause}
    WHERE id_consultor=$${parametros.length}
    RETURNING *;
  `;

  const result = await ejecutarConsulta(query, parametros);
  return result.rows[0] as IConsultor;
}

  
  async eliminarConsultor(idConsultor: string): Promise<void> {
    const query = `
      UPDATE consultores
      SET estado='Eliminado'
      WHERE id_consultor=$1;
    `;
    await ejecutarConsulta(query, [idConsultor]);
  }

 
  async buscarPorCorreoOIdentificacion(correo: string, identificacion: string): Promise<IConsultor | null> {
    const query = `
      SELECT * FROM consultores
      WHERE correo=$1 OR identificacion=$2
      LIMIT 1;
    `;
    const result = await ejecutarConsulta(query, [correo, identificacion]);
    return result.rows[0] as IConsultor;
  }
}
