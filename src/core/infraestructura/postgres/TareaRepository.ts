import { ITareaRepositorio } from "../../dominio/tarea/repositorio/ITareaRepositorio";
import { ITarea } from "../../dominio/tarea/ITarea";
import { ejecutarConsulta } from "./clientePostgres";

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
    const query = `SELECT * FROM Tareas WHERE status != 'eliminado';`;
    const result = await ejecutarConsulta(query, []);
    return result.rows;
  }


  async obtenerTareaPorId(idTarea: number): Promise<ITarea | null> {
    const query = `SELECT * FROM Tareas WHERE idTarea = $1;`;
    const result = await ejecutarConsulta(query, [idTarea]);
    return result.rows[0] || null;
  }


  async actualizarTarea(idTarea: number, datos: ITarea): Promise<ITarea> {
  // Filtramos datos nulos o indefinidos para no romper la query
  const datosLimpios = Object.fromEntries(
    Object.entries(datos).filter(([_, v]) => v !== null && v !== undefined)
  );

  const columnas = Object.keys(datosLimpios).map((key) => key.toLowerCase());
  const parametros = Object.values(datosLimpios);
  const setClause = columnas.map((col, i) => `${col}=$${i + 1}`).join(", ");

  // Agregar el ID al final
  parametros.push(idTarea);

  const query = `
    UPDATE Tareas
    SET ${setClause}
    WHERE idTarea=$${parametros.length}
    RETURNING *;
  `;

  const result = await ejecutarConsulta(query, parametros);
  return result.rows[0];
}


  async eliminarTarea(idTarea: number): Promise<void> {
    const query = `
      UPDATE Tareas
      SET status='eliminado'
      WHERE idTarea=$1;
    `;
    await ejecutarConsulta(query, [idTarea]);
  }
}