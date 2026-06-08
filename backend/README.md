# SAC TRAZABILIDAD

Sistema de trazabilidad para la gestión y control de fruta fresca durante las diferentes etapas del proceso productivo, desde la recepción hasta el despacho final.

---

# Tecnologías Utilizadas

## Backend

* Node.js
* Express.js
* PostgreSQL
* ES Modules
* UUID
* Dotenv

## Base de Datos

* PostgreSQL
* UUID mediante `gen_random_uuid()`
* Relaciones mediante claves foráneas

---

# Arquitectura del Proyecto

```text
backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── modules/
│   │
│   ├── routes/
│   │
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

Cada módulo mantiene la siguiente estructura:

```text
modulo/
├── modulo.routes.js
├── modulo.controller.js
└── modulo.model.js
```

---

# Convenciones del Proyecto

## Identificación

Todas las tablas maestras poseen:

```text
id
uuid
```

* id → uso interno de base de datos.
* uuid → uso para API y frontend.

---

## Estados

```text
1 = Activo
0 = Inactivo
```

---

## Fechas

Todas las tablas maestras incluyen:

```text
fecha_creacion
fecha_actualizacion
```

Reglas:

* fecha_creacion se genera automáticamente.
* fecha_actualizacion permanece NULL hasta una modificación.

---

# Estado Actual del Desarrollo

## Backend

* [x] Configuración inicial
* [x] Conexión PostgreSQL
* [x] UUID
* [x] CRUD Campañas
* [x] CRUD Variedades
* [x] CRUD Clientes
* [x] CRUD Taras Cliente
* [x] CRUD Agricultores
* [x] CRUD Líneas de Proceso
* [x] CRUD Tipos de Producción
* [ ] Certificaciones
* [ ] Acopiadores
* [ ] Conductores
* [ ] Inspectores SENASA
* [ ] Jornadas
* [ ] Lotes

---

# Módulos Implementados

## Campañas

Permite administrar campañas agrícolas.

### Endpoints

```http
GET    /api/campanias/listar-campanias
POST   /api/campanias/crear-campania
PUT    /api/campanias/actualizar-campania/:uuid
PATCH  /api/campanias/cambiar-estado-campania/:uuid
```

### Reglas

* Nombre obligatorio
* Producto obligatorio
* Fecha inicio obligatoria
* Numeración de lotes reiniciada por campaña

---

## Variedades

Administración de variedades de fruta.

### Endpoints

```http
GET    /api/variedades/listar-variedades
POST   /api/variedades/crear-variedad
PUT    /api/variedades/actualizar-variedad/:uuid
PATCH  /api/variedades/cambiar-estado-variedad/:uuid
```

### Reglas

* Código único
* Nombre único

---

## Clientes

Administración de exportadoras/clientes.

### Endpoints

```http
GET    /api/clientes/listar-clientes
POST   /api/clientes/crear-cliente
PUT    /api/clientes/actualizar-cliente/:uuid
PATCH  /api/clientes/cambiar-estado-cliente/:uuid
```

### Reglas

* Código único
* RUC único
* Código obligatorio
* Razón social obligatoria
* RUC obligatorio
* El código no puede modificarse posteriormente

---

## Taras Cliente

Administración de taras utilizadas en recepción.

### Endpoints

```http
GET    /api/taras-cliente/listar-taras-cliente
POST   /api/taras-cliente/crear-tara-cliente
PUT    /api/taras-cliente/actualizar-tara-cliente/:uuid
PATCH  /api/taras-cliente/cambiar-estado-tara-cliente/:uuid
```

### Reglas

* Cliente obligatorio
* Peso tara obligatorio
* Peso tara mayor a cero

---

## Agricultores

Administración de productores agrícolas.

### Endpoints

```http
GET    /api/agricultores/listar-agricultores
POST   /api/agricultores/crear-agricultor
PUT    /api/agricultores/actualizar-agricultor/:uuid
PATCH  /api/agricultores/cambiar-estado-agricultor/:uuid
```

### Características

* Paginación
* Búsqueda por CLP/SENASA
* Búsqueda por DNI/RUC
* Búsqueda por nombres
* Búsqueda por apellidos

### Reglas

* CLP/SENASA obligatorio
* CLP/SENASA único
* Exactamente 10 dígitos
* DNI/RUC obligatorio
* DNI/RUC único
* CLP/SENASA no editable

---

## Líneas de Proceso

Administración de líneas operativas de planta.

### Endpoints

```http
GET    /api/lineas-proceso/listar-lineas-proceso
POST   /api/lineas-proceso/crear-linea-proceso
PUT    /api/lineas-proceso/actualizar-linea-proceso/:uuid
PATCH  /api/lineas-proceso/cambiar-estado-linea-proceso/:uuid
```

### Ejemplos

```text
USA
EUROPA
COREA
AEREO
```

### Reglas

* Código único
* Nombre único
* Código no editable

---

## Tipos de Producción

Administración de tipos de producción.

### Endpoints

```http
GET    /api/tipos-produccion/listar-tipos-produccion
POST   /api/tipos-produccion/crear-tipo-produccion
PUT    /api/tipos-produccion/actualizar-tipo-produccion/:uuid
PATCH  /api/tipos-produccion/cambiar-estado-tipo-produccion/:uuid
```

### Ejemplos

```text
CONVENCIONAL
ORGANICO
```

### Reglas

* Código único
* Nombre único
* Código no editable

---

# Modelo Conceptual Actual

```text
Campañas
│
├── Clientes
│   └── Taras Cliente
│
├── Agricultores
│
├── Variedades
│
├── Líneas de Proceso
│
└── Tipos de Producción
```

---

# Próximos Módulos

* Certificaciones
* Acopiadores
* Conductores
* Inspectores SENASA
* Jornadas
* Lotes
* Recepción
* Calidad
* Abastecimiento
* Clasificación
* Descarte
* Entarimado
* Reportes
* Dashboard
