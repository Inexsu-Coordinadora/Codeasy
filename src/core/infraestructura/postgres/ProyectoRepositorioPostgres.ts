import { ejecutarConsulta } from '../postgres/clientePostgres';
import type { IProyecto } from '../../../core/dominio/proyecto/IProyecto';
import type { IProyectoRepositorio } from '../../../core/dominio/proyecto/repositorio/IProyectoRepositorio';


export class ProyectoRepositorioPostgres implements IProyectoRepositorio {
  async crear(proyecto: IProyecto): Promise<IProyecto> {
    const query = `
      INSERT INTO proyectos (nombre, descripcion, estado, estatus, id_cliente, fecha_inicio, fecha_entrega, fecha_creacion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *;
    `;
    const valores = [
      proyecto.nombre,
      proyecto.descripcion,
      proyecto.estado,
      proyecto.estatus,
      proyecto.id_cliente,
      proyecto.fecha_inicio,
      proyecto.fecha_entrega,
    ];
    const resultado = await ejecutarConsulta(query, valores);
    return resultado.rows[0];
  }

  async obtenerTodos(): Promise<IProyecto[]> {
    const query = `
      SELECT *
      FROM proyectos
      WHERE estatus = 'Activo'
      ORDER BY id ASC;
    `;
    const resultado = await ejecutarConsulta(query);
    return resultado.rows;
  }


  async obtenerPorId(id: number): Promise<IProyecto | null> {
    const resultado = await ejecutarConsulta('SELECT * FROM proyectos WHERE id = $1;', [id]);
    return resultado.rows[0] || null;
  }

  async actualizar(id: number, cambios: Partial<IProyecto>): Promise<IProyecto | null> {
    const campos = Object.keys(cambios);
    if (campos.length === 0) return null;

    const valores = Object.values(cambios);
    const setQuery = campos.map((campo, i) => `${campo} = $${i + 1}`).join(', ');
    const query = `
      UPDATE proyectos
      SET ${setQuery}
      WHERE id = $${campos.length + 1}
      RETURNING *;
    `;
    const resultado = await ejecutarConsulta(query, [...valores, id]);
    return resultado.rows[0] || null;
  }

  async eliminarLogico(id: number): Promise<IProyecto | null> {
    const resultado = await ejecutarConsulta(
      `UPDATE proyectos SET estatus = 'Eliminado' WHERE id = $1 RETURNING *;`,
      [id]
    );
    return resultado.rows[0] || null;
  }
}
