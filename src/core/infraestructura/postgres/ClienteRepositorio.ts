import { IClienteRepositorio } from "../../dominio/cliente/repositorio/IClienteRepositorio";
import { ICliente } from "../../dominio/cliente/ICliente";
import { ejecutarConsulta } from "./clientePostgres";

export class ClienteRepositorio implements IClienteRepositorio {

  async crearCliente(cliente: ICliente): Promise<string> {
    const clienteSinId = { ...cliente };
    delete clienteSinId.idCliente;

    const columnas = Object.keys(clienteSinId);
    const valores = Object.values(clienteSinId).filter(v => v !== undefined && v !== null);
    const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO clientes (${columnas.join(", ")})
      VALUES (${placeholders})
      RETURNING idcliente;
    `;

    const resultado = await ejecutarConsulta(query, valores);
    return String(resultado.rows[0].idcliente);
  }


  async buscarTodosCliente(): Promise<ICliente[]> {

    const query = `SELECT * FROM clientes WHERE estatus = 'Activo';`;
    const result = await ejecutarConsulta(query, []);
    return result.rows as ICliente[];
  }


  async buscarPorIdCliente(idCliente: number): Promise<ICliente | null> {
    const query = `SELECT * FROM clientes WHERE idcliente = $1;`;
    const result = await ejecutarConsulta(query, [idCliente]);
    return (result.rows[0] as ICliente) || null;
  }


  async buscarPorIdentificacionCliente(identificacion: string): Promise<ICliente | null> {
    const query = `
      SELECT * FROM clientes
      WHERE identificacion = $1
      LIMIT 1;
    `;
    const result = await ejecutarConsulta(query, [identificacion]);
    return (result.rows[0] as ICliente) || null;
  }


  async ActualizarCliente(idCliente: number, datos: ICliente): Promise<ICliente | null> {
    const datosLimpios = Object.fromEntries(
      Object.entries(datos).filter(([_, v]) => v !== null && v !== undefined)
    );


    const columnas = Object.keys(datosLimpios).map((key) => key.toLowerCase());
    const parametros = Object.values(datosLimpios);
    const setClause = columnas.map((col, i) => `${col}=$${i + 1}`).join(", ");

    parametros.push(idCliente);
    const query = `
      UPDATE clientes
      SET ${setClause}
      WHERE idcliente=$${parametros.length}
      RETURNING *;
    `;

    const result = await ejecutarConsulta(query, parametros);
    return (result.rows[0] as ICliente) || null;
  }

  async EliminarCliente(idCliente: number): Promise<void> {
    const query = `
      UPDATE clientes
      SET estatus = 'Eliminado'
      WHERE idcliente=$1;
    `;
    await ejecutarConsulta(query, [idCliente]);
  }
}
