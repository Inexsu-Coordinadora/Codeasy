import dotenv from "dotenv";
dotenv.config();

function requireEnv(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor || valor.trim() === "") {
    throw new Error(`Variable de entorno obligatoria faltante: ${nombre}`);
  }
  return valor;
}

function requireNumberEnv(nombre: string): number {
  const valor = requireEnv(nombre);
  const numero = Number(valor);

  if (Number.isNaN(numero)) {
    throw new Error(`La variable ${nombre} debe ser un número válido. Valor recibido: "${valor}"`);
  }

  return numero;
}

export const configuration = {
  httpPuerto: requireNumberEnv("PUERTO"),

  baseDatos: {
    host: requireEnv("PGHOST"),
    puerto: requireNumberEnv("PGPORT"),
    usuario: requireEnv("PGUSER"),
    contrasena: requireEnv("PGPASSWORD"),
    nombreDb: requireEnv("PGDBNAME"),
  },
<<<<<<< HEAD
};
=======
};
>>>>>>> 3263375dae408c532ae6f18dfc9897e9206913b7
