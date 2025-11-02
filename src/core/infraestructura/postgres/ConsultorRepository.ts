import { IConsultorRepositorio } from "../../dominio/consultor/repositorio/IConsultorRepositorio.js";
import { IConsultor } from "../../dominio/consultor/IConsultor.js";
import { ejecutarConsulta } from "./clientepostgres.js";

export class ConsultorRepositorio implements IConsultorRepositorio {

  
async registrarConsultor(consultor: IConsultor): Promise<IConsultor> {

    
  const consultorSinId = { ...consultor };
  delete consultorSinId.idConsultor;

 
  
  const columnas = Object.keys(consultorSinId);
  const valores = Object.values(consultorSinId).filter(v => v !== undefined && v !== null);
  const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

  const query = `
    INSERT INTO consultores (${columnas.join(", ")})
    VALUES (${placeholders})
    RETURNING *;
  `;

  const resultado = await ejecutarConsulta(query, valores);
  return resultado.rows[0];
}


  async listarTodosConsultores(): Promise<IConsultor[]> {
    const query = `SELECT * FROM consultores WHERE estado != 'Eliminado';`;
    const result = await ejecutarConsulta(query, []);
    return result.rows;
  }


  async obtenerConsultorPorId(idConsultor: number): Promise<IConsultor | null> {
    const query = `SELECT * FROM consultores WHERE idconsultor = $1;`;
    const result = await ejecutarConsulta(query, [idConsultor]);
    return result.rows[0] || null;
  }

  
  async actualizarConsultor(idConsultor: number, datos: IConsultor): Promise<IConsultor> {
  // Filtramos datos nulos o indefinidos para no romper la query
  const datosLimpios = Object.fromEntries(
    Object.entries(datos).filter(([_, v]) => v !== null && v !== undefined)
  );

  const columnas = Object.keys(datosLimpios).map((key) => key.toLowerCase());
  const parametros = Object.values(datosLimpios);
  const setClause = columnas.map((col, i) => `${col}=$${i + 1}`).join(", ");

  // Agregar el ID al final
  parametros.push(idConsultor);

  const query = `
    UPDATE consultores
    SET ${setClause}
    WHERE idconsultor=$${parametros.length}
    RETURNING *;
  `;

  const result = await ejecutarConsulta(query, parametros);
  return result.rows[0];
}

  
  async eliminarConsultor(idConsultor: number): Promise<void> {
    const query = `
      UPDATE consultores
      SET estado='Eliminado'
      WHERE idconsultor=$1;
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
    return result.rows[0] || null;
  }
}
