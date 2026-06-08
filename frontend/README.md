# SAC Trazabilidad - Frontend

Frontend del sistema SAC Trazabilidad desarrollado con React.

## Tecnologías

- React
- Vite
- React Router DOM
- Axios
- Materialize CSS
- Material Icons

## Estructura principal

```text
src/
├── layouts/
│   └── MainLayout.jsx
├── pages/
│   ├── Home.jsx
│   ├── garita/
│   ├── recepcion/
│   ├── calibrado/
│   ├── hidrotermico/
│   ├── empaque/
│   └── administracion/
├── routes/
│   └── AppRoutes.jsx
└── main.jsx
Módulos implementados
Layout principal
Barra superior de navegación.
Menú principal:
Garita
Recepción
Calibrado
Hidrotérmico
Empaque
Administración
Menú desplegable de Administración.
Diseño responsive básico.
Rutas

Se implementó navegación con React Router DOM.

Rutas principales:

/
 /garita
 /recepcion
 /calibrado
 /hidrotermico
 /empaque

Rutas de administración:

/administracion/campanias
/administracion/variedades
/administracion/clientes
/administracion/taras-cliente
/administracion/agricultores
/administracion/lineas-proceso
/administracion/tipos-produccion
Módulo Variedades

Funcionalidades implementadas:

Listar variedades desde backend.
Buscar por código o nombre.
Crear variedad.
Editar variedad.
Activar / desactivar variedad.
Modal de creación y edición.
Modal de confirmación.
Mensajes de éxito y error.
Estado visual Activo/Inactivo.
Visualización de fecha de creación y actualización.

Endpoints consumidos:

GET    /api/variedades/listar-variedades
POST   /api/variedades/crear-variedad
PUT    /api/variedades/actualizar-variedad/:uuid
PATCH  /api/variedades/cambiar-estado-variedad/:uuid