// src/infraestructura/parteHora/repositorio/ParteHoraRepositorioPG.ts
import { Pool } from "pg";
import { IParteHora } from "../../../dominio/parteHora/IParteHora";
import { IParteHoraRepositorio } from "../../../dominio/parteHora/repositorio/IParteHoraRepositorio";

export class ParteHoraRepositorio implements IParteHoraRepositorio {
  constructor(private pool: Pool) {}

  async registrarParteHora(parteHora: IParteHora): Promise<IParteHora> {
    const query = `
      INSERT INTO partes_hora (
        id_proyecto, 
        id_consultor, 
        fecha, 
        cantidad_horas, 
        descripcion,
        estado
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING 
        id_parte_hora,
        id_proyecto,
        id_consultor,
        fecha,
        cantidad_horas,
        descripcion,
        estado
    `;

    const values = [
      parteHora.id_proyecto,
      parteHora.id_consultor,
      parteHora.fecha,
      parteHora.cantidad_horas,
      parteHora.descripcion,
      parteHora.estado || 'Activo'
    ];

    try {
      const resultado = await this.pool.query(query, values);
      return this.mapearFilaAParteHora(resultado.rows[0]);
    } catch (error: any) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Ya existe un registro de horas con estos datos');
      }
      throw error;
    }
  }

  async obtenerPartesPorProyecto(id_proyecto: string): Promise<IParteHora[]> {
    const query = `
      SELECT 
        ph.*,
        c.nombre as nombre_consultor
      FROM partes_hora ph
      INNER JOIN consultores c ON ph.id_consultor = c.idConsultor
      WHERE ph.id_proyecto = $1 
        AND ph.estado = 'Activo'
      ORDER BY ph.fecha DESC
    `;
    
    const resultado = await this.pool.query(query, [id_proyecto]);
    return resultado.rows.map(this.mapearFilaAParteHora);
  }

  async obtenerPartesPorConsultor(id_consultor: string): Promise<IParteHora[]> {
    const query = `
      SELECT 
        ph.*,
        p.nombre as nombre_proyecto
      FROM partes_hora ph
      INNER JOIN proyectos p ON ph.id_proyecto = p.id
      WHERE ph.id_consultor = $1 
        AND ph.estado = 'Activo'
      ORDER BY ph.fecha DESC
    `;
    
    const resultado = await this.pool.query(query, [id_consultor]);
    return resultado.rows.map(this.mapearFilaAParteHora);
  }

  async buscarDuplicado(
    id_proyecto: string,
    id_consultor: string,
    fecha: Date,
    descripcion: string
  ): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count 
      FROM partes_hora 
      WHERE id_proyecto = $1 
        AND id_consultor = $2 
        AND fecha = $3 
        AND descripcion = $4
        AND estado = 'Activo'
    `;
    
    const resultado = await this.pool.query(query, [
      id_proyecto,
      id_consultor,
      fecha,
      descripcion,
    ]);
    
    return parseInt(resultado.rows[0].count) > 0;
  }

  private mapearFilaAParteHora(fila: any): IParteHora {
    return {
      id_parte_hora: fila.id_parte_hora,
      id_proyecto: fila.id_proyecto,
      id_consultor: fila.id_consultor,
      fecha: new Date(fila.fecha),
      cantidad_horas: parseFloat(fila.cantidad_horas),
      descripcion: fila.descripcion,
      estado: fila.estado,
    };
  }
}