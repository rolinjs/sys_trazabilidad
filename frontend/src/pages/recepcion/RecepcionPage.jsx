import { NavLink, Outlet, useLocation } from "react-router-dom";

function RecepcionPage() {
  const location = useLocation();

  const mostrarTabsGuias = location.pathname.startsWith("/recepcion/guias");

  const opcionesRecepcion = [
    {
      texto: "GUÍAS",
      icono: "description",
      ruta: "/recepcion/guias/plan-diario",
      destacado: true
    },
    {
      texto: "FICHA DE\nCAMIÓN",
      icono: "local_shipping",
      ruta: "/recepcion/ficha-camion"
    },
    {
      texto: "GUARDAR\nRECEPCIÓN",
      icono: "save",
      ruta: "/recepcion/guardar-recepcion",
    },
    {
      texto: "DATOS\nPROVEEDOR",
      icono: "person",
      ruta: "/recepcion/datos-proveedor"
    },
    {
      texto: "HISTORIAL\nINGRESOS",
      icono: "folder_open",
      ruta: "/recepcion/historial-ingresos"
    }
  ];

  const esActivo = (ruta) => {
    if (ruta.startsWith("/recepcion/guias")) {
      return location.pathname.startsWith("/recepcion/guias");
    }

    return location.pathname.startsWith(ruta);
  };

  return (
    <>
      <div
        className="white"
        style={{
          borderBottom: "1px solid #ddd",
          padding: "5px 12px 0 12px",
          overflowX: "auto",
          whiteSpace: "nowrap"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            minHeight: "60px"
          }}
        >
          {opcionesRecepcion.map((item, index) => (
            <NavLink
              key={item.ruta}
              to={item.ruta}
              style={{
                textDecoration: "none",
                color: "inherit"
              }}
            >
              <div
                style={{
                  width: "96px",
                  minHeight: "58px",
                  padding: "5px 6px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2px",
                  background: esActivo(item.ruta) ? "#f5f8ff" : "#fff",
                  borderBottom: esActivo(item.ruta)
                    ? "3px solid #1565c0"
                    : "3px solid transparent",
                  borderRight:
                    index === 4 ? "1px solid #ddd" : "1px solid transparent"
                }}
              >
                <i
                  className="material-icons"
                  style={{
                    fontSize: "22px",
                    color: item.destacado
                      ? "#2962ff"
                      : esActivo(item.ruta)
                        ? "#1565c0"
                        : "#555"
                  }}
                >
                  {item.icono}
                </i>

                <span
                  style={{
                    fontSize: "10px",
                    lineHeight: "11px",
                    fontWeight: item.destacado || esActivo(item.ruta) ? 700 : 500,
                    textAlign: "center",
                    whiteSpace: "pre-line",
                    color: item.destacado
                      ? "#2962ff"
                      : esActivo(item.ruta)
                        ? "#1565c0"
                        : "#333"
                  }}
                >
                  {item.texto}
                </span>
              </div>
            </NavLink>
          ))}
        </div>
      </div>

      {mostrarTabsGuias && (
  <div
    className="white"
    style={{
      padding: "6px 20px",
      borderBottom: "1px solid #e0e0e0",
      background: "#fafafa"
    }}
  >
    <div
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
        overflowX: "auto",
        whiteSpace: "nowrap"
      }}
    >
      <NavLink
        to="/recepcion/guias/plan-diario"
        style={({ isActive }) => ({
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "7px 12px",
          borderRadius: "4px",
          textDecoration: "none",
          fontSize: "12px",
          fontWeight: 600,
          color: isActive ? "#fff" : "#424242",
          background: isActive ? "#1565c0" : "#fff",
          border: isActive ? "1px solid #1565c0" : "1px solid #ddd"
        })}
      >
        <i className="material-icons" style={{ fontSize: "18px" }}>
          today
        </i>
        Plan Diario
      </NavLink>

      <NavLink
        to="/recepcion/guias/registro"
        style={({ isActive }) => ({
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "7px 12px",
          borderRadius: "4px",
          textDecoration: "none",
          fontSize: "12px",
          fontWeight: 600,
          color: isActive ? "#fff" : "#424242",
          background: isActive ? "#1565c0" : "#fff",
          border: isActive ? "1px solid #1565c0" : "1px solid #ddd"
        })}
      >
        <i className="material-icons" style={{ fontSize: "18px" }}>
          post_add
        </i>
        Registro de Guías
      </NavLink>

      <NavLink
        to="/recepcion/guias/consulta"
        style={({ isActive }) => ({
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "7px 12px",
          borderRadius: "4px",
          textDecoration: "none",
          fontSize: "12px",
          fontWeight: 600,
          color: isActive ? "#fff" : "#424242",
          background: isActive ? "#1565c0" : "#fff",
          border: isActive ? "1px solid #1565c0" : "1px solid #ddd"
        })}
      >
        <i className="material-icons" style={{ fontSize: "18px" }}>
          search
        </i>
        Consulta de Guías
      </NavLink>
    </div>
  </div>
)}

      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </>
  );
}

export default RecepcionPage;