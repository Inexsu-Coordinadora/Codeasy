import { ITareaRepositorio } from "../../dominio/tarea/repositorio/ITareaRepositorio.js";
import { ITarea } from "../../dominio/tarea/ITarea.js";
import { ejecutarConsulta } from "./clientepostgres.js";

export class TareaRepositorio implements ITareaRepositorio {

  
async registrarTarea(tarea: ITarea): Promise<ITarea> {

  const tareaSinId = { ...tarea };
  delete tareaSinId.idTarea;

  const columnas = Object.keys(tareaSinId);
  const valores = Object.values(tareaSinId).filter(v => v !== undefined && v !== null);
  const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

  const query = `
    INSERT INTO Tareas (${columnas.join(", ")})
    VALUES (${placeholders})
    RETURNING *;
  `;

  const resultado = await ejecutarConsulta(query, valores);
  return resultado.rows[0];
}


  async listarTodasTareas(): Promise<ITarea[]> {
    const query = `SELECT * FROM Tareas WHERE estatus != 'Eliminado';`;
    const result = await ejecutarConsulta(query, []);
    return result.rows;
  }


  async obtenerTareaPorId(idTarea: number): Promise<ITarea | null> {
    const query = `SELECT * FROM Tareas WHERE idTarea = $1 AND estatus != 'Eliminado';`;
    const result = await ejecutarConsulta(query, [idTarea]);
    return result.rows[0] || null;
  }


 async actualizarTarea(idTarea: number, datos: Partial<ITarea>): Promise<ITarea> {
  const datosLimpios = Object.fromEntries(
    Object.entries(datos).filter(([_, v]) => v !== null && v !== undefined)
  );

  const columnas = Object.keys(datosLimpios); 
  const parametros = Object.values(datosLimpios);
  const setClause = columnas.map((col, i) => `${col}=$${i + 1}`).join(", ");

  parametros.push(idTarea);

  const query = `
    UPDATE tareas
    SET ${setClause}
    WHERE idtarea=$${parametros.length}
    RETURNING *;
  `;

  const result = await ejecutarConsulta(query, parametros);
  return result.rows[0];
}


  async eliminarTarea(idTarea: number): Promise<void> {
    const query = `
      UPDATE Tareas
      SET estatus='Eliminado'
      WHERE idTarea=$1
      AND estatus != 'Eliminado';
    `;
    const result = await ejecutarConsulta(query, [idTarea]);
    if (result.rowCount === 0) {
      throw new Error(`No se encontró la tarea con ID ${idTarea} para eliminar`);
    }
  }
}