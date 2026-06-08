# SAC Trazabilidad - Frontend

Frontend del sistema SAC Trazabilidad desarrollado con React para la gestión y control de los procesos operativos y administrativos relacionados con la trazabilidad de fruta fresca.

---

## Tecnologías Utilizadas

### Frontend

* React
* Vite
* React Router DOM
* Axios
* Materialize CSS
* Material Icons

---

## Estructura Principal del Proyecto

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

## Módulos Implementados

### Layout Principal

Características implementadas:

* Barra superior de navegación.
* Navegación principal del sistema.
* Menú desplegable para Administración.
* Resaltado visual de módulo activo.
* Diseño responsive básico.
* Integración con React Router DOM.

### Menú Principal

* Garita
* Recepción
* Calibrado
* Hidrotérmico
* Empaque
* Administración

---

## Sistema de Rutas

### Rutas Operativas

```text
/
/garita
/recepcion
/calibrado
/hidrotermico
/empaque
```

### Rutas Administrativas

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

## Módulo de Variedades

### Funcionalidades Implementadas

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

### Endpoints Consumidos

```http
GET    /api/variedades/listar-variedades
POST   /api/variedades/crear-variedad
PUT    /api/variedades/actualizar-variedad/:uuid
PATCH  /api/variedades/cambiar-estado-variedad/:uuid
```

---

## Estado Actual del Desarrollo

### Estructura General

* [x] Configuración inicial del proyecto React
* [x] Configuración Vite
* [x] React Router DOM
* [x] Layout principal
* [x] Navegación principal
* [x] Menú Administración
* [x] Páginas base de módulos operativos
* [x] Integración Backend mediante Axios

### Módulos Administrativos

* [x] Variedades
* [ ] Campañas
* [ ] Clientes
* [ ] Taras Cliente
* [ ] Agricultores
* [ ] Líneas de Proceso
* [ ] Tipos de Producción

---

## Ejecución del Proyecto

### Instalar Dependencias

```bash
npm install
```

### Ejecutar Proyecto

```bash
npm run dev
```

### URL Local

```text
http://localhost:5173
```

---

## Conexión con Backend

Actualmente el frontend consume servicios REST del backend Node.js mediante Axios.

Servidor configurado:

```text
http://localhost:3000
```

---

## Próximas Mejoras

* Implementación de CRUD visual para campañas.
* Implementación de CRUD visual para clientes.
* Implementación de CRUD visual para agricultores.
* Componentes reutilizables para tablas.
* Componentes reutilizables para modales.
* Servicios Axios por módulo.
* Sistema global de notificaciones.
* Autenticación y autorización.
* Gestión de roles y permisos.
* Dashboard operativo.
* Reportes y estadísticas.
* Optimización de experiencia móvil.

---

## Versión Actual

**Versión:** 0.1.0

Proyecto en fase inicial de construcción y validación funcional.
