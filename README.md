<h1 align="center">
# Codeasy - Sistema de Gestión de Proyectos
</h1>

<p align="center">
<img width="200" height="200" alt="image" src="https://github.com/user-attachments/assets/c71e822d-7260-4e21-b890-04a725e23be0" />
</p>

## 📋 Descripción del Proyecto

Sistema de gestión de proyectos desarrollado con **Node.js**, **TypeScript**, **Fastify** y **PostgreSQL**, implementando arquitectura hexagonal (Clean Architecture) con casos de uso, repositorios y validaciones.

### Características Principales

- ✅ Gestión completa de **Clientes**, **Proyectos**, **Consultores**, **Roles**, **Equipos** y **Tareas**
- ✅ API RESTful con validación de datos usando **Zod**
- ✅ Arquitectura hexagonal con separación de capas
- ✅ **122 pruebas unitarias e integración** con **Jest**
- ✅ Cobertura de código del **63.93%**
- ✅ Soporte completo para **ESM (ECMAScript Modules)**

---

## 🚀 Comandos de Ejecución

### Instalación de Dependencias

```bash
npm install
```

### Ejecutar la Aplicación en Desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3000` (o el puerto configurado en `.env`).

### 📚 Documentación de la API (Swagger)

Una vez que el servidor esté ejecutándose, puedes acceder a la documentación interactiva de la API en:

```
http://127.0.0.1:3000/docs
```

La documentación Swagger proporciona:
- 📖 Descripción detallada de todos los endpoints
- 🧪 Interfaz interactiva para probar las APIs
- 📋 Esquemas de request/response
- ✅ Validaciones y ejemplos de uso

### Ejecutar las Pruebas

#### Ejecutar todas las pruebas con cobertura

```bash
npm run test
```

#### Ejecutar pruebas en modo watch

```bash
npm run test:watch
```

#### Ver reporte de cobertura en el navegador

```bash
npm run test:coverage
```

---

## 🧪 Evidencias de Pruebas

### Resumen de Resultados

**Estado:** ✅ **TODAS LAS PRUEBAS PASANDO**

```
Test Suites: 16 passed, 16 total
Tests:       122 passed, 122 total
Snapshots:   0 total
Time:        14.119 s
```

### Cobertura de Código

#### All Files Coverage

```
All files                                        |   63.93 |    83.05 |   66.95 |   63.93 |
```

| Métrica | Porcentaje |
|---------|------------|
| **Statements** | 63.93% |
| **Branches** | 83.05% |
| **Functions** | 66.95% |
| **Lines** | 63.93% |

#### Cobertura por Módulo

| Módulo | Statements | Branches | Functions | Lines |
|--------|------------|----------|-----------|-------|
| **Casos de Uso - Cliente** | 100% | 100% | 100% | 100% |
| **Casos de Uso - Consultor** | 100% | 100% | 100% | 100% |
| **Casos de Uso - Proyecto** | 90.05% | 70.45% | 90.9% | 90.05% |
| **Casos de Uso - Rol** | 97.95% | 92% | 100% | 97.95% |
| **Casos de Uso - Tarea** | 96.31% | 74.35% | 100% | 96.31% |
| **Casos de Uso - Equipo Consultor** | 87.5% | 76.66% | 100% | 87.5% |
| **Casos de Uso - Equipo Proyecto** | 82.81% | 82.85% | 100% | 82.81% |
| **Dominio (Entidades)** | 100% | 100% | 100% | 100% |
| **Presentación (Controladores)** | 78.92% | 100% | 79.24% | 78.92% |
| **Presentación (Rutas)** | 100% | 100% | 100% | 100% |
| **Presentación (Esquemas)** | 95.45% | 88.88% | 96.29% | 95.45% |

---

## 📊 Desglose de Pruebas

### Pruebas de Integración (8 suites, 36 tests)

#### ✅ API Clientes (6 tests)
- GET `/api/cliente` - Listar todos los clientes
- GET `/api/cliente/:idCliente` - Obtener cliente por ID
- PUT `/api/cliente/:idCliente` - Actualizar cliente
- DELETE `/api/cliente/eliminar/:idCliente` - Eliminar cliente

#### ✅ API Consultores (5 tests)
- GET `/api/consultor` - Listar consultores
- GET `/api/consultor/:id` - Obtener consultor por ID
- DELETE `/api/consultor/eliminar/:id` - Eliminar consultor

#### ✅ API Proyectos (4 tests)
- POST `/api/proyecto` - Crear proyecto
- GET `/api/proyecto/:id` - Obtener proyecto
- PUT `/api/proyecto/:id` - Actualizar proyecto
- DELETE `/api/proyecto/eliminar/:id` - Eliminar proyecto

#### ✅ API Proyectos por Cliente (7 tests)
- GET `/api/clientes/:idCliente/proyectos` - Consultar proyectos de un cliente
- Filtros por estado y fecha de inicio
- Validación de cliente inexistente

#### ✅ API Tareas (5 tests)
- POST `/api/tarea` - Crear tarea
- GET `/api/tarea/:idTarea` - Obtener tarea
- PUT `/api/tarea/:idTarea` - Actualizar tarea
- DELETE `/api/tarea/eliminar/:idTarea` - Eliminar tarea

#### ✅ API Roles (4 tests)
- POST `/api/rol` - Crear rol
- GET `/api/rol/:id` - Obtener rol
- PUT `/api/rol/:id` - Actualizar rol
- DELETE `/api/rol/eliminar/:id` - Eliminar rol

#### ✅ API Equipo Consultor (4 tests)
- POST `/api/equipo-consultor` - Asignar consultor a equipo
- GET `/api/equipo-consultor/:id` - Obtener asignación
- PUT `/api/equipo-consultor/:id` - Actualizar asignación
- DELETE `/api/equipo-consultor/eliminar/:id` - Eliminar asignación

#### ✅ API Equipo Proyecto (4 tests)
- POST `/api/equipo-proyecto` - Crear equipo de proyecto
- GET `/api/equipo-proyecto/:id` - Obtener equipo
- PUT `/api/equipo-proyecto/:id` - Actualizar equipo
- DELETE `/api/equipo-proyecto/eliminar/:id` - Eliminar equipo

### Pruebas Unitarias (8 suites, 86 tests)

#### ✅ ClienteCasosUso (14 tests)
- Registro de clientes
- Validación de duplicados
- Actualización y eliminación

#### ✅ ConsultorCasosUso (9 tests)
- Registro de consultores
- Validación de existencia
- Operaciones CRUD completas

#### ✅ ProyectoCasosUso (8 tests)
- Creación con validación de fechas
- Validación de cliente existente
- Actualización y eliminación

#### ✅ ConsultarProyectosPorClienteCasosUso (7 tests)
- Consulta de proyectos por cliente
- Filtros múltiples
- Manejo de casos vacíos

#### ✅ TareaCasosUso (8 tests)
- Registro de tareas
- Validación de proyecto
- Operaciones CRUD

#### ✅ RolCasosUso (10 tests)
- Creación de roles
- Validación de duplicados
- Operaciones CRUD

#### ✅ EquipoConsultorCasosUso (14 tests)
- Asignación de consultores
- Validación de equipo y consultor
- Operaciones CRUD

#### ✅ EquipoProyectoCasosUso (12 tests)
- Creación de equipos
- Validación de proyecto
- Operaciones CRUD

---

## 📽️ Video de demostración
https://youtu.be/Jy8ZGzuug5I

---

## 🏗️ Arquitectura del Proyecto

```
src/
├── common/                    # Utilidades comunes
│   ├── codigosHttp.ts        # Códigos HTTP estándar
│   ├── configuracion.ts      # Configuración de la aplicación
│   └── middlewares/          # Middlewares de Fastify
│       ├── AppError.ts       # Clases de error personalizadas
│       └── ManejadorErrores.ts
│
├── core/                      # Núcleo de la aplicación
│   ├── aplicacion/           # Capa de aplicación
│   │   └── casos-uso/        # Casos de uso por módulo
│   │       ├── Cliente/
│   │       ├── Consultor/
│   │       ├── Proyecto/
│   │       ├── Rol/
│   │       ├── Tarea/
│   │       ├── Equipo-Consultor/
│   │       └── Equipo-Proyecto/
│   │
│   ├── dominio/              # Capa de dominio
│   │   ├── cliente/
│   │   ├── consultor/
│   │   ├── proyecto/
│   │   ├── rol/
│   │   ├── tarea/
│   │   ├── equipo-proyecto/
│   │   └── equipos-consultores/
│   │
│   ├── infraestructura/      # Capa de infraestructura
│   │   └── postgres/         # Repositorios PostgreSQL
│   │
│   └── utils/                # Utilidades del core
│       ├── toCamelCase.ts
│       └── toSnakeCase.ts
│
├── presentacion/             # Capa de presentación
│   ├── app.ts               # Configuración de Fastify
│   ├── controladores/       # Controladores REST
│   ├── esquemas/            # Esquemas de validación Zod
│   └── rutas/               # Definición de rutas
│
└── index.ts                 # Punto de entrada

tests/
├── integracion/             # Pruebas de integración
│   ├── clientes.int.test.ts
│   ├── consultores.int.test.ts
│   ├── proyectos/
│   ├── tarea.int.test.ts
│   ├── roles/
│   ├── equipos-consultores/
│   ├── equipos-proyectos/
│   └── ConsultarProyectosPorCliente.int.test.ts
│
└── unit/                    # Pruebas unitarias
    ├── clientes/
    ├── consultores/
    ├── proyectos/
    ├── roles/
    ├── tarea/
    ├── equipos-consultores/
    └── equipos-proyectos/
```

---

## 🔧 Tecnologías Utilizadas

### Backend
- **Node.js** v20+
- **TypeScript** 5.x
- **Fastify** - Framework web de alto rendimiento
- **PostgreSQL** - Base de datos relacional
- **Zod** - Validación de esquemas

### Testing
- **Jest** 29.x - Framework de pruebas
- **Supertest** - Pruebas de API HTTP
- **ESM Support** - Módulos ECMAScript nativos

### Herramientas de Desarrollo
- **tsx** - Ejecutor TypeScript
- **dotenv** - Gestión de variables de entorno
- **Pino** - Logger de alto rendimiento

---

## 📝 Configuración del Entorno

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=codeasy
DB_USER=postgres
DB_PASSWORD=tu_password

# Server
PORT=3000
NODE_ENV=development
```

### Base de Datos

El proyecto requiere una base de datos PostgreSQL. Asegúrate de tener PostgreSQL instalado y ejecutándose.

---

## 📈 Mejoras Implementadas

### Sistema de Pruebas

1. **Migración completa a ESM**
   - Configuración de Jest para módulos ECMAScript
   - Uso de `jest.unstable_mockModule` para mocks en ESM
   - Importaciones dinámicas en pruebas

2. **Cobertura de Código**
   - 122 pruebas automatizadas
   - Cobertura del 63.93% en statements
   - Cobertura del 83.05% en branches
   - 100% de cobertura en casos de uso críticos

3. **Pruebas de Integración**
   - Mocking completo de repositorios
   - Pruebas end-to-end de API
   - Validación de respuestas HTTP

4. **Pruebas Unitarias**
   - Aislamiento de casos de uso
   - Mocking de validadores
   - Cobertura de casos edge

---

### Estándares de Código

- Seguir la arquitectura hexagonal establecida
- Escribir pruebas para nuevas funcionalidades
- Mantener cobertura de código >60%
- Usar TypeScript estricto
- Validar datos con Zod

---

## 🎯 Estado del Proyecto

**Versión:** 1.0.0  
**Última Actualización:** Noviembre 2025  
**Pruebas:** ✅ 122/122 Pasando  
**Cobertura:** 63.93%

