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
├── services/
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

# Menú Principal

## Módulos Operativos

* Garita
* Recepción
* Calibrado
* Hidrotérmico
* Empaque

## Módulos Administrativos

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
* Refresco automático del listado.

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
* Visualización de fechas.
* Refresco automático del listado.

## Reglas de Negocio Implementadas

* Una campaña cerrada no puede ser editada.
* Una campaña cerrada no puede volver a cerrarse.
* El cierre registra automáticamente la fecha de cierre.
* El estado visual depende de la fecha de cierre registrada.
* Las campañas abiertas permiten edición.

## Endpoints Consumidos

```http
GET    /api/campanias/listar-campanias
POST   /api/campanias/crear-campania
PUT    /api/campanias/actualizar-campania/:uuid
PATCH  /api/campanias/cerrar-campania/:uuid
```

---

# Módulo de Clientes / Exportadores

## Funcionalidades Implementadas

* Listado de clientes desde Backend.
* Búsqueda por código, razón social y RUC.
* Registro de nuevos clientes.
* Edición de clientes existentes.
* Activación y desactivación de registros.
* Visualización detallada mediante modal.
* Formulario dividido en pasos.
* Validaciones de negocio en Frontend.
* Mensajes visuales de éxito y error.
* Paginación de registros.
* Indicadores de activos, inactivos y total.
* Refresco automático del listado.
* Visualización de fechas de creación y actualización.

## Reglas de Negocio Implementadas

* Código obligatorio.
* Razón social obligatoria.
* RUC obligatorio.
* El RUC debe contener 11 dígitos.
* No se permiten códigos duplicados.
* No se permiten RUC duplicados.
* El código no puede modificarse durante la edición.
* Los datos opcionales pueden actualizarse posteriormente.
* Los clientes pueden activarse o desactivarse.
* El detalle muestra toda la información almacenada.

## Información Administrada

### Datos Obligatorios

* Código
* Razón Social
* RUC

### Datos Opcionales

* Dirección Fiscal
* Representante Legal
* Teléfono Principal
* Correo Principal
* Persona de Contacto en Planta
* Teléfono de Contacto
* Correo de Contacto

## Endpoints Consumidos

```http
GET    /api/clientes/listar-clientes
POST   /api/clientes/crear-cliente
PUT    /api/clientes/actualizar-cliente/:uuid
PATCH  /api/clientes/cambiar-estado-cliente/:uuid
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
* [x] Clientes
* [x] Taras Cliente
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
* Servicios Axios centralizados.
* Manejo centralizado de errores.
* Variables de entorno.
* Hooks reutilizables.

## Funcionalidad

* CRUD de Taras Cliente.
* CRUD de Agricultores.
* CRUD de Líneas de Proceso.
* CRUD de Tipos de Producción.
* Gestión de lotes.
* Recepción de fruta.
* Calidad.
* Abastecimiento.
* Clasificación.
* Descarte.
* Entarimado.
* Reportes operativos.
* Dashboard de indicadores.

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

**Versión:** 0.3.0

Proyecto en fase activa de construcción orientado a la gestión de trazabilidad de fruta fresca para procesos de exportación, integrando módulos administrativos y operativos para el control integral de planta.
