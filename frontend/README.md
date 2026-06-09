# SAC Trazabilidad - Frontend

Frontend del sistema SAC Trazabilidad desarrollado con React para la gestión, control y trazabilidad de fruta fresca durante las diferentes etapas operativas y administrativas de planta.

---

# Tecnologías Utilizadas

## Frontend

* React
* Vite
* React Router DOM
* Axios
* Materialize CSS
* Material Icons

---

# Estructura Principal del Proyecto

```text
src/
├── layouts/
│   └── MainLayout.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── garita/
│   ├── recepcion/
│   ├── calibrado/
│   ├── hidrotermico/
│   ├── empaque/
│   └── administracion/
│
├── routes/
│   └── AppRoutes.jsx
│
└── main.jsx
```

---

# Módulos Implementados

## Layout Principal

Características implementadas:

* Barra superior de navegación.
* Navegación principal del sistema.
* Menú desplegable para Administración.
* Resaltado visual del módulo activo.
* Diseño responsive.
* Integración con React Router DOM.
* Estructura preparada para crecimiento modular.

---

## Menú Principal

### Módulos Operativos

* Garita
* Recepción
* Calibrado
* Hidrotérmico
* Empaque

### Módulos Administrativos

* Campañas
* Variedades
* Clientes
* Taras Cliente
* Agricultores
* Líneas de Proceso
* Tipos de Producción

---

# Sistema de Rutas

## Rutas Operativas

```text
/
/garita
/recepcion
/calibrado
/hidrotermico
/empaque
```

## Rutas Administrativas

```text
/administracion/campanias
/administracion/variedades
/administracion/clientes
/administracion/taras-cliente
/administracion/agricultores
/administracion/lineas-proceso
/administracion/tipos-produccion
```

---

# Módulo de Variedades

## Funcionalidades Implementadas

* Listado de variedades desde Backend.
* Búsqueda por código o nombre.
* Registro de nuevas variedades.
* Edición de variedades existentes.
* Activación y desactivación de registros.
* Modal para creación y edición.
* Modal de confirmación para cambios de estado.
* Validaciones básicas en Frontend.
* Mensajes visuales de éxito y error.
* Indicadores visuales de estado.
* Visualización de fecha de creación.
* Visualización de fecha de actualización.

## Endpoints Consumidos

```http
GET    /api/variedades/listar-variedades
POST   /api/variedades/crear-variedad
PUT    /api/variedades/actualizar-variedad/:uuid
PATCH  /api/variedades/cambiar-estado-variedad/:uuid
```

---

# Módulo de Campañas

## Funcionalidades Implementadas

* Listado de campañas desde Backend.
* Búsqueda por nombre, producto y observación.
* Registro de nuevas campañas.
* Edición de campañas abiertas.
* Cierre de campañas.
* Modal para creación.
* Modal para edición.
* Modal de confirmación para cierre.
* Validaciones básicas en Frontend.
* Mensajes visuales de éxito y error.
* Indicadores visuales de estado.
* Visualización de fecha de inicio.
* Visualización de fecha de fin.
* Visualización de fecha de creación.
* Visualización de fecha de actualización.
* Refresco automático del listado después de crear, editar o cerrar.

## Reglas de Negocio Implementadas

* Una campaña cerrada no puede ser editada.
* Una campaña cerrada no puede volver a cerrarse.
* El cierre de campaña registra automáticamente la fecha de cierre.
* El estado visual depende de la fecha de cierre registrada.
* Las campañas abiertas permiten edición.
* Las campañas cerradas quedan bloqueadas para modificación.

## Endpoints Consumidos

```http
GET    /api/campanias/listar-campanias
POST   /api/campanias/crear-campania
PUT    /api/campanias/actualizar-campania/:uuid
PATCH  /api/campanias/cerrar-campania/:uuid
```

---

# Integración Backend

Actualmente el frontend consume servicios REST desarrollados en Node.js y PostgreSQL mediante Axios.

Servidor configurado:

```text
http://localhost:3000
```

---

# Estado Actual del Desarrollo

## Estructura General

* [x] Configuración inicial React
* [x] Configuración Vite
* [x] React Router DOM
* [x] Axios
* [x] Layout principal
* [x] Navegación principal
* [x] Menú Administración
* [x] Responsive básico
* [x] Integración Backend

## Módulos Administrativos

* [x] Campañas
* [x] Variedades
* [ ] Clientes
* [ ] Taras Cliente
* [ ] Agricultores
* [ ] Líneas de Proceso
* [ ] Tipos de Producción

## Módulos Operativos

* [ ] Garita
* [ ] Recepción
* [ ] Calibrado
* [ ] Hidrotérmico
* [ ] Empaque

---

# Próximas Mejoras

## Arquitectura

* Componentes reutilizables para tablas.
* Componentes reutilizables para formularios.
* Componentes reutilizables para modales.
* Servicios Axios por módulo.
* Manejo centralizado de errores.
* Configuración de variables de entorno.
* Hooks reutilizables.

## Funcionalidad

* CRUD de Clientes.
* CRUD de Taras Cliente.
* CRUD de Agricultores.
* CRUD de Líneas de Proceso.
* CRUD de Tipos de Producción.
* Gestión de campañas y relaciones.
* Gestión de lotes.
* Recepción de fruta.
* Calidad.
* Abastecimiento.
* Clasificación.
* Descarte.
* Entarimado.
* Reportes operativos.

## Seguridad

* Autenticación.
* Autorización.
* Roles.
* Permisos.
* Protección de rutas.

---

# Instalación

## Instalar dependencias

```bash
npm install
```

## Ejecutar entorno de desarrollo

```bash
npm run dev
```

## URL Local

```text
http://localhost:5173
```

---

# Versión Actual

**Versión:** 0.2.0

Proyecto en fase activa de construcción orientado a la gestión de trazabilidad de fruta fresca para procesos de exportación.
