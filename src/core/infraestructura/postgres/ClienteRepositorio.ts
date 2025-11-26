import { IClienteRepositorio } from "../../dominio/cliente/repositorio/IClienteRepositorio";
import { ICliente } from "../../dominio/cliente/ICliente";
import { ejecutarConsulta } from "./clientepostgres";
import { toSnakeCase } from "../../utils/toSnakeCase.js";

export class ClienteRepositorio implements IClienteRepositorio {

  async registrarCliente(cliente: ICliente): Promise<ICliente> {
    const { idCliente, ...clienteSinId } = cliente;
    const clienteBD = toSnakeCase(cliente);

    const columnas = Object.keys(clienteSinId);

    const valores = Object.values(clienteBD).map(v =>
      v === null ? "" : v
    ) as (string | Date)[];

    const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO clientes (${columnas.join(", ")})
      VALUES (${placeholders})
      RETURNING *;
    `;

    const resultado = await ejecutarConsulta(query, valores);
    return resultado.rows[0] as ICliente;
  }

  async obtenerClientes(): Promise<ICliente[]> {
    const query = `SELECT * FROM clientes WHERE estado = 'Activo';`;
    const result = await ejecutarConsulta(query, []);
    return result.rows as ICliente[];
  }

  async buscarPorIdCliente(idCliente: string): Promise<ICliente | null> {
    const query = `
      SELECT * FROM clientes 
      WHERE id_cliente = $1 AND estado != 'Eliminado';
    `;
    const result = await ejecutarConsulta(query, [idCliente]);
    return result.rows[0] || null;
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

  async actualizarCliente(idCliente: string, datos: ICliente): Promise<ICliente | null> {
    const datosLimpios = Object.fromEntries(
      Object.entries(datos).filter(([_, v]) => v !== null && v !== undefined)
    );

    const columnas = Object.keys(datosLimpios).map(key => key.toLowerCase());
    const valores = Object.values(datosLimpios);

    const setClause = columnas.map((col, i) => `${col} = $${i + 1}`).join(", ");

    valores.push(idCliente); // último parámetro

    const query = `
      UPDATE clientes
      SET ${setClause}
      WHERE id_cliente = $${valores.length}
      RETURNING *;
    `;

    const result = await ejecutarConsulta(query, valores);
    return (result.rows[0] as ICliente) || null;
  }

  async eliminarCliente(idCliente: string): Promise<void> {
    const query = `
      UPDATE clientes
      SET estado = 'Eliminado'
      WHERE id_cliente = $1;
    `;
    await ejecutarConsulta(query, [idCliente]);
  }
}