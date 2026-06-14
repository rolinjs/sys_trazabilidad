import { NavLink, Outlet, useLocation } from "react-router-dom";

function RecepcionPage() {
  const location = useLocation();

  const mostrarTabsGuias = location.pathname.startsWith("/recepcion/guias");

  return (
    <>
      <div className="grey lighten-4" style={{ padding: "10px 16px" }}>
        <div className="row" style={{ marginBottom: 0 }}>
          <div className="col s12 m3">
            <NavLink to="/recepcion/guias/plan-diario" style={{ color: "inherit" }}>
              <div className="card-panel white hoverable" style={{ margin: "0 0 8px 0", padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px", borderLeft: "4px solid #1565c0" }}>
                <i className="material-icons blue-text text-darken-3">description</i>
                <span className="blue-text text-darken-3" style={{ fontWeight: "600", fontSize: "13px" }}>Guías</span>
              </div>
            </NavLink>
          </div>

          <div className="col s12 m3">
            <div className="card-panel white hoverable" style={{ margin: "0 0 8px 0", padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px", borderLeft: "4px solid #1565c0", cursor: "pointer" }}>
              <i className="material-icons blue-text text-darken-3">move_to_inbox</i>
              <span className="blue-text text-darken-3" style={{ fontWeight: "600", fontSize: "13px" }}>Descarga</span>
            </div>
          </div>

          <div className="col s12 m3">
            <div className="card-panel white hoverable" style={{ margin: "0 0 8px 0", padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px", borderLeft: "4px solid #1565c0", cursor: "pointer" }}>
              <i className="material-icons blue-text text-darken-3">scale</i>
              <span className="blue-text text-darken-3" style={{ fontWeight: "600", fontSize: "13px" }}>Pesaje</span>
            </div>
          </div>

          <div className="col s12 m3">
            <div className="card-panel white hoverable" style={{ margin: "0 0 8px 0", padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px", borderLeft: "4px solid #1565c0", cursor: "pointer" }}>
              <i className="material-icons blue-text text-darken-3">fact_check</i>
              <span className="blue-text text-darken-3" style={{ fontWeight: "600", fontSize: "13px" }}>Inspección SENASA</span>
            </div>
          </div>
        </div>
      </div>

      {mostrarTabsGuias && (
        <div
          className="white"
          style={{
            padding: "0 20px",
            borderBottom: "1px solid #e0e0e0"
          }}
        >
          <ul
            className="tabs"
            style={{
              height: "42px",
              display: "flex"
            }}
          >
            <li className="tab">
              <NavLink
                to="/recepcion/guias/plan-diario"
                className="blue-text text-darken-3"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <i className="material-icons" style={{ margin: 0 }}>
                  today
                </i>
                Plan Diario
              </NavLink>
            </li>

            <li className="tab">
              <NavLink
                to="/recepcion/guias/registro"
                className="blue-text text-darken-3"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <i className="material-icons" style={{ margin: 0 }}>
                  post_add
                </i>
                Registro de Guías
              </NavLink>
            </li>

            <li className="tab">
              <NavLink
                to="/recepcion/guias/consulta"
                className="blue-text text-darken-3"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <i className="material-icons" style={{ margin: 0 }}>
                  search
                </i>
                Consulta de Guías
              </NavLink>
            </li>
          </ul>
        </div>
      )}

      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </>
  );
}

export default RecepcionPage;