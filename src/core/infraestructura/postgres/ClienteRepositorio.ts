import { IClienteRepositorio } from "../../dominio/cliente/repositorio/IClienteRepositorio";
import { ICliente } from "../../dominio/cliente/ICliente";
import { ejecutarConsulta } from "./clientePostgres";

export class ClienteRepositorio implements IClienteRepositorio {

  async crearCliente(cliente: ICliente): Promise<ICliente> {
  const clienteSinId = { ...cliente };
  delete clienteSinId.id_cliente;

  const columnas = Object.keys(clienteSinId);
  const valores = Object.values(clienteSinId).filter(v => v !== undefined && v !== null);
  const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

  const query = `
    INSERT INTO clientes (${columnas.join(", ")})
    VALUES (${placeholders})
    RETURNING *;
  `;

  const resultado = await ejecutarConsulta(query, valores);
  return resultado.rows[0] as ICliente;
}



  async buscarTodosCliente(): Promise<ICliente[]> {

    const query = `SELECT * FROM clientes WHERE estado = 'Activo';`;
    const result = await ejecutarConsulta(query, []);
    return result.rows as ICliente[];
  }


  // async buscarPorIdCliente(string: string): Promise<ICliente | null> {
  //   const query = `SELECT * FROM clientes WHERE string = $1;`;
  //   const result = await ejecutarConsulta(query, [string]);
  //   return (result.rows[0] as ICliente) || null;
  // }
   async obtenerClientePorId(id_cliente: string): Promise<ICliente | null> {
   const query = `SELECT * FROM clientes WHERE id_cliente = $1;`;
    const result = await ejecutarConsulta(query, [id_cliente]);
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


  async ActualizarCliente(id_cliente: string, datos: ICliente): Promise<ICliente | null> {
    const datosLimpios = Object.fromEntries(
      Object.entries(datos).filter(([_, v]) => v !== null && v !== undefined)
    );


    const columnas = Object.keys(datosLimpios).map((key) => key.toLowerCase());
    const parametros = Object.values(datosLimpios);
    const setClause = columnas.map((col, i) => `${col}=$${i + 1}`).join(", ");

    parametros.push(id_cliente);
    const query = `
      UPDATE clientes
      SET ${setClause}
      WHERE id_cliente=$${parametros.length}
      RETURNING *;
    `;

    const result = await ejecutarConsulta(query, parametros);
    return (result.rows[0] as ICliente) || null;
  }

  async EliminarCliente(id_cliente: string): Promise<void> {
    const query = `
      UPDATE clientes
      SET estado='Eliminado'
      WHERE id_cliente=$1;
    `;
    await ejecutarConsulta(query, [id_cliente]);
  }
}
