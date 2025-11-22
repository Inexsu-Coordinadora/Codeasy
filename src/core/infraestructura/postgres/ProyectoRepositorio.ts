import { ejecutarConsulta } from './clientepostgres.js';
import type { IProyecto } from '../../dominio/proyecto/IProyecto.js';
import type { IProyectoRepositorio } from '../../dominio/proyecto/repositorio/IProyectoRepositorio.js';
import { toSnakeCase } from "../../utils/toSnakeCase.js";
import { toCamelCase } from "../../utils/toCamelCase.js";

export class ProyectoRepositorio implements IProyectoRepositorio {

  async crear(proyecto: IProyecto): Promise<IProyecto> {
    const proyectoBD = toSnakeCase(proyecto);
    delete (proyectoBD as any).id_proyecto;
    delete (proyectoBD as any).nombre_cliente;

    const columnas = Object.keys(proyectoBD);
    const valores = Object.values(proyectoBD).map((v) =>
      v === null || v === undefined ? null : v
    ) as (string | Date | number | null)[];

    const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO proyectos (${columnas.join(", ")})
      VALUES (${placeholders})
      RETURNING *;
    `;

    const resultado = await ejecutarConsulta(query, valores);
    const nuevoProyecto = toCamelCase(resultado.rows[0]) as IProyecto;

    // Fetch client name
    const queryCliente = `SELECT nombre FROM clientes WHERE id_cliente = $1`;
    const resCliente = await ejecutarConsulta(queryCliente, [nuevoProyecto.idCliente]);

    if (resCliente.rows.length > 0) {
      nuevoProyecto.nombreCliente = resCliente.rows[0].nombre;
    }

    // Reconstruct object to enforce order: idCliente -> nombreCliente
    const proyectoOrdenado: IProyecto = {
      idProyecto: nuevoProyecto.idProyecto,
      nombre: nuevoProyecto.nombre,
      descripcion: nuevoProyecto.descripcion,
      estadoProyecto: nuevoProyecto.estadoProyecto,
      estado: nuevoProyecto.estado,
      idCliente: nuevoProyecto.idCliente,
      nombreCliente: nuevoProyecto.nombreCliente,
      fechaInicio: nuevoProyecto.fechaInicio,
      fechaEntrega: nuevoProyecto.fechaEntrega,
      fechaCreacion: nuevoProyecto.fechaCreacion
    };

    return proyectoOrdenado;
  }

  async obtenerTodos(): Promise<IProyecto[]> {
    const query = `
      SELECT 
        p.id_proyecto, 
        p.nombre, 
        p.descripcion, 
        p.estado_proyecto, 
        p.estado, 
        p.id_cliente, 
        c.nombre as nombre_cliente, 
        p.fecha_inicio, 
        p.fecha_entrega, 
        p.fecha_creacion
      FROM proyectos p
      JOIN clientes c ON p.id_cliente = c.id_cliente
      WHERE p.estado = 'Activo'
      ORDER BY p.fecha_creacion DESC;
    `;
    const resultado = await ejecutarConsulta(query, []);
    return toCamelCase(resultado.rows);
  }

  async obtenerPorId(idProyecto: string): Promise<IProyecto | null> {
    const query = `
      SELECT 
        p.id_proyecto, 
        p.nombre, 
        p.descripcion, 
        p.estado_proyecto, 
        p.estado, 
        p.id_cliente, 
        c.nombre as nombre_cliente, 
        p.fecha_inicio, 
        p.fecha_entrega, 
        p.fecha_creacion
      FROM proyectos p
      JOIN clientes c ON p.id_cliente = c.id_cliente
      WHERE p.id_proyecto = $1
      AND p.estado = 'Activo'
      LIMIT 1;
    `;
    const resultado = await ejecutarConsulta(query, [idProyecto]);
    const proyecto = resultado.rows[0];
    return proyecto ? (toCamelCase(proyecto) as IProyecto) : null;
  }

  async obtenerPorCliente(idCliente: string): Promise<IProyecto[]> {
    const query = `
      SELECT 
        p.id_proyecto, 
        p.nombre, 
        p.descripcion, 
        p.estado_proyecto, 
        p.estado, 
        p.id_cliente, 
        c.nombre as nombre_cliente, 
        p.fecha_inicio, 
        p.fecha_entrega, 
        p.fecha_creacion
      FROM proyectos p
      JOIN clientes c ON p.id_cliente = c.id_cliente
      WHERE p.id_cliente = $1
      AND p.estado = 'Activo'
      ORDER BY p.fecha_creacion DESC;
    `;

    const resultado = await ejecutarConsulta(query, [idCliente]);
    return toCamelCase(resultado.rows);
  }

  async actualizar(idProyecto: string, datos: Partial<IProyecto>): Promise<IProyecto> {
    const datosBD = toSnakeCase(
      Object.fromEntries(
        Object.entries(datos).filter(([_, v]) => v !== null && v !== undefined)
      )
    );
    delete (datosBD as any).nombre_cliente;

    const columnas = Object.keys(datosBD);
    const parametros = Object.values(datosBD);
    const setClause = columnas.map((col, i) => `${col} = $${i + 1}`).join(", ");
    parametros.push(idProyecto);

    const query = `
      UPDATE proyectos
      SET ${setClause}
      WHERE id_proyecto = $${parametros.length}
      RETURNING *;
    `;

    const resultado = await ejecutarConsulta(query, parametros);
    const proyectoActualizado = toCamelCase(resultado.rows[0]) as IProyecto;

    // Fetch client name
    const queryCliente = `SELECT nombre FROM clientes WHERE id_cliente = $1`;
    const resCliente = await ejecutarConsulta(queryCliente, [proyectoActualizado.idCliente]);

    if (resCliente.rows.length > 0) {
      proyectoActualizado.nombreCliente = resCliente.rows[0].nombre;
    }

    // Reconstruct object to enforce order
    const proyectoOrdenado: IProyecto = {
      idProyecto: proyectoActualizado.idProyecto,
      nombre: proyectoActualizado.nombre,
      descripcion: proyectoActualizado.descripcion,
      estadoProyecto: proyectoActualizado.estadoProyecto,
      estado: proyectoActualizado.estado,
      idCliente: proyectoActualizado.idCliente,
      nombreCliente: proyectoActualizado.nombreCliente,
      fechaInicio: proyectoActualizado.fechaInicio,
      fechaEntrega: proyectoActualizado.fechaEntrega,
      fechaCreacion: proyectoActualizado.fechaCreacion
    };

    return proyectoOrdenado;
  }

  async eliminar(idProyecto: string): Promise<IProyecto> {
    const query = `
      UPDATE proyectos
      SET estado = 'Eliminado'
      WHERE id_proyecto = $1
      RETURNING *;
    `;
    const resultado = await ejecutarConsulta(query, [idProyecto]);
    return toCamelCase(resultado.rows[0]) as IProyecto;
  }
}