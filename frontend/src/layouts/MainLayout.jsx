import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

function MainLayout() {
  const [adminOpen, setAdminOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const getMenuClass = ({ isActive }) =>
    isActive ? "menu-principal-activo" : "";

  const adminItems = [
    ["campanias", "Campañas"],
    ["variedades", "Variedades"],
    ["clientes", "Clientes"],
    ["taras-cliente", "Taras Cliente"],
    ["agricultores", "Agricultores"],
    ["lineas-proceso", "Líneas de Proceso"],
    ["tipos-produccion", "Tipos de Producción"]
  ];

  const cerrarMenus = () => {
    setMenuOpen(false);
    setAdminOpen(false);
  };

  return (
    <>
      <nav className="blue darken-3">
        <div
          className="nav-wrapper"
          style={{
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#fff",
              fontSize: "18px",
              fontWeight: "600"
            }}
          >
            <i className="material-icons" style={{ marginRight: "8px" }}>
              agriculture
            </i>
            SAC Trazabilidad
          </div>

          <a
            href="#!"
            className="hide-on-large-only"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              color: "#fff",
              display: "flex",
              alignItems: "center"
            }}
          >
            <i className="material-icons">menu</i>
          </a>

          <ul className="hide-on-med-and-down" style={{ display: "flex", margin: 0 }}>
            <li>
              <NavLink to="/garita" className={getMenuClass}>
                <i className="material-icons left">security</i>
                Garita
              </NavLink>
            </li>

            <li>
              <NavLink to="/recepcion" className={getMenuClass}>
                <i className="material-icons left">inventory_2</i>
                Recepción
              </NavLink>
            </li>

            <li>
              <NavLink to="/calibrado" className={getMenuClass}>
                <i className="material-icons left">tune</i>
                Calibrado
              </NavLink>
            </li>

            <li>
              <NavLink to="/hidrotermico" className={getMenuClass}>
                <i className="material-icons left">water_drop</i>
                Hidrotérmico
              </NavLink>
            </li>

            <li>
              <NavLink to="/empaque" className={getMenuClass}>
                <i className="material-icons left">local_shipping</i>
                Empaque
              </NavLink>
            </li>

            <li style={{ position: "relative" }}>
              <a
                href="#!"
                onClick={() => setAdminOpen(!adminOpen)}
                className={
                  location.pathname.startsWith("/administracion")
                    ? "menu-principal-activo"
                    : ""
                }
                style={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <i className="material-icons left">settings</i>
                Administración
                <i
                  className="material-icons"
                  style={{
                    fontSize: "18px",
                    marginLeft: "2px"
                  }}
                >
                  arrow_drop_down
                </i>
              </a>

              {adminOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "64px",
                    right: 0,
                    background: "#fff",
                    minWidth: "220px",
                    border: "1px solid #e0e0e0",
                    zIndex: 9999,
                    boxShadow: "0 3px 8px rgba(0,0,0,0.15)"
                  }}
                >
                  {adminItems.map(([ruta, texto]) => (
                    <NavLink
                      key={ruta}
                      to={`/administracion/${ruta}`}
                      onClick={() => setAdminOpen(false)}
                      style={{
                        display: "block",
                        padding: "0 15px",
                        height: "38px",
                        lineHeight: "38px",
                        color: "#424242",
                        textDecoration: "none",
                        borderBottom: "1px solid #f0f0f0",
                        background: "#fff"
                      }}
                    >
                      {texto}
                    </NavLink>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="hide-on-large-only"
          style={{
            background: "#fff",
            borderBottom: "1px solid #ddd",
            boxShadow: "0 3px 8px rgba(0,0,0,0.12)"
          }}
        >
          <NavLink to="/garita" onClick={cerrarMenus} style={mobileItemStyle}>
            <i className="material-icons">security</i>
            Garita
          </NavLink>

          <NavLink to="/recepcion" onClick={cerrarMenus} style={mobileItemStyle}>
            <i className="material-icons">inventory_2</i>
            Recepción
          </NavLink>

          <NavLink to="/calibrado" onClick={cerrarMenus} style={mobileItemStyle}>
            <i className="material-icons">tune</i>
            Calibrado
          </NavLink>

          <NavLink to="/hidrotermico" onClick={cerrarMenus} style={mobileItemStyle}>
            <i className="material-icons">water_drop</i>
            Hidrotérmico
          </NavLink>

          <NavLink to="/empaque" onClick={cerrarMenus} style={mobileItemStyle}>
            <i className="material-icons">local_shipping</i>
            Empaque
          </NavLink>

          <div
            onClick={() => setAdminOpen(!adminOpen)}
            style={{
              ...mobileItemStyle,
              justifyContent: "space-between",
              fontWeight: 600,
              color: "#1565c0",
              borderTop: "1px solid #eee",
              cursor: "pointer"
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="material-icons">settings</i>
              Administración
            </span>

            <i className="material-icons" style={{ fontSize: "18px" }}>
              {adminOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"}
            </i>
          </div>

          {adminOpen && (
            <div style={{ background: "#fafafa" }}>
              {adminItems.map(([ruta, texto]) => (
                <NavLink
                  key={ruta}
                  to={`/administracion/${ruta}`}
                  onClick={cerrarMenus}
                  style={{
                    ...mobileItemStyle,
                    paddingLeft: "34px",
                    fontSize: "13px",
                    background: "#fafafa"
                  }}
                >
                  {texto}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      )}

      <Outlet />
    </>
  );
}

const mobileItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "9px 14px",
  color: "#424242",
  textDecoration: "none",
  borderBottom: "1px solid #f0f0f0",
  fontSize: "14px"
};

export default MainLayout;