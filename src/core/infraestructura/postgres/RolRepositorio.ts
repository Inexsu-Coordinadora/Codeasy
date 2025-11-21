import { ejecutarConsulta } from "./clientepostgres";
import type { IRol } from "../../dominio/rol/IRol";
import type { IRolRepositorio } from "../../dominio/rol/repositorio/IRolRepositorio";
import { toSnakeCase } from "../../utils/toSnakeCase";
import { toCamelCase } from "../../utils/toCamelCase";

export class RolRepositorio implements IRolRepositorio {
  
    // CREAR ROL
    async crearRol(rol: IRol): Promise<IRol> {
        const data = toSnakeCase(rol);
        delete (data as any).id_rol;

        const columnas = Object.keys(data);
        const valores = Object.values(data).map(v => (v === undefined ? null : v));
        const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

        const query = `
        INSERT INTO roles (${columnas.join(", ")})
        VALUES (${placeholders})
        RETURNING *;
        `;

        const result = await ejecutarConsulta(query, valores);
        return toCamelCase(result.rows[0]) as IRol;
    }

    // LISTAR ROLES ACTIVOS
    async listarRoles(): Promise<IRol[]> {
        const query = `
        SELECT *
        FROM roles
        WHERE estado = 'Activo'
        ORDER BY nombre_rol ASC;
        `;
        const result = await ejecutarConsulta(query, []);
        return toCamelCase(result.rows);
    }

    // OBTENER ROL POR ID
    async obtenerRolPorId(idRol: string): Promise<IRol | null> {
        const query = `
        SELECT *
        FROM roles
        WHERE id_rol = $1
        LIMIT 1;
        `;
        const result = await ejecutarConsulta(query, [idRol]);
        const rol = result.rows[0];
        return rol ? (toCamelCase(rol) as IRol) : null;
    }

    // ACTUALIZAR ROL
    async actualizarRol(idRol: string, datos: Partial<IRol>): Promise<IRol> {
        const data = toSnakeCase(
        Object.fromEntries(
            Object.entries(datos).filter(([_, v]) => v !== undefined && v !== null)
        )
        );

        const columnas = Object.keys(data);
        const valores = Object.values(data);
        const setClause = columnas.map((col, i) => `${col} = $${i + 1}`).join(", ");

        valores.push(idRol);

        const query = `
        UPDATE roles
        SET ${setClause}
        WHERE id_rol = $${valores.length}
        RETURNING *;
        `;

        const result = await ejecutarConsulta(query, valores);
        return toCamelCase(result.rows[0]) as IRol;
    }

    // ELIMINACIÓN LÓGICA DEL ROL
    async eliminarRol(idRol: string): Promise<IRol> {
        const query = `
        UPDATE roles
        SET estado = 'Eliminado'
        WHERE id_rol = $1
        RETURNING *;
        `;

        const result = await ejecutarConsulta(query, [idRol]);
        return toCamelCase(result.rows[0]) as IRol;
    }
}
