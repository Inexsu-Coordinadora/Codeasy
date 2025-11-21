import { ejecutarConsulta } from './clientepostgres';
import type { IProyecto } from '../../dominio/proyecto/IProyecto';
import type { IProyectoRepositorio } from '../../dominio/proyecto/repositorio/IProyectoRepositorio';
import { toSnakeCase } from "../../utils/toSnakeCase";
import { toCamelCase } from "../../utils/toCamelCase";

export class ProyectoRepositorio implements IProyectoRepositorio {

  async crear(proyecto: IProyecto): Promise<IProyecto> {
    const proyectoBD = toSnakeCase(proyecto);
    delete (proyectoBD as any).id_proyecto;

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
    return toCamelCase(resultado.rows[0]) as IProyecto;
  }

  async obtenerTodos(): Promise<IProyecto[]> {
    const query = `
      SELECT * FROM proyectos
      WHERE estado = 'Activo'
      ORDER BY fecha_creacion DESC;
    `;
    const resultado = await ejecutarConsulta(query, []);
    return toCamelCase(resultado.rows);
  }

  async obtenerPorId(idProyecto: string): Promise<IProyecto | null> {
    const query = `
      SELECT * FROM proyectos
      WHERE id_proyecto = $1
      AND estado = 'Activo'
      LIMIT 1;
    `;
    const resultado = await ejecutarConsulta(query, [idProyecto]);
    const proyecto = resultado.rows[0];
    return proyecto ? (toCamelCase(proyecto) as IProyecto) : null;
  }

  async obtenerPorCliente(idCliente: string): Promise<IProyecto[]> {
    const query = `
      SELECT *
      FROM proyectos
      WHERE id_cliente = $1
      AND estado = 'Activo'
      ORDER BY fecha_creacion DESC;
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
    return toCamelCase(resultado.rows[0]) as IProyecto;
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