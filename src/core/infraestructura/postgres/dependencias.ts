// src/infraestructura/configuracion/dependencias.ts (ejemplo)
import { Pool } from "pg";
import { ParteHoraRepositorio} from "./ParteHoraRepositorio";
import { ParteHoraCasosUso } from "../../aplicacion/casos-uso/ParteHora/ParteHoraCasosUso";
import { ParteHoraControlador } from "../../../presentacion/controladores/ParteHoraControlador";
import { IProyectoRepositorio } from "../../dominio/proyecto/repositorio/IProyectoRepositorio.js";
import { IConsultorRepositorio } from "../../dominio/consultor/repositorio/IConsultorRepositorio.js";
import { IStaffProyectoRepositorio } from "../../dominio/staff-proyecto/IStaffProyecto";

export function configurarDependenciasParteHora(
  pool: Pool,
  proyectoRepositorio: IProyectoRepositorio,
  consultorRepositorio: IConsultorRepositorio,
  staffProyectoRepositorio: IStaffProyectoRepositorio
) {
  // Repositorio
  const parteHoraRepositorio = new ParteHoraRepositorio(pool);

  // Casos de uso
  const parteHoraCasosUso = new ParteHoraCasosUso(
    parteHoraRepositorio,
    proyectoRepositorio,
    consultorRepositorio,
    staffProyectoRepositorio
  );

  // Controlador
  const parteHoraControlador = new ParteHoraControlador(parteHoraCasosUso);

  return { parteHoraControlador };
}