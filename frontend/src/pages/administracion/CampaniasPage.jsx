import { useState, useEffect } from "react";
import axios from "axios";

function CampaniasPage() {
  const [buscar, setBuscar] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modoModal, setModoModal] = useState("crear");
  const [campaniaEditando, setCampaniaEditando] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [campaniaSeleccionada, setCampaniaSeleccionada] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    producto: "",
    fecha_inicio: "",
    fecha_fin: "",
    observacion: ""
  });

  const [guardando, setGuardando] = useState(false);
  const [mensajeModal, setMensajeModal] = useState({
    tipo: "",
    texto: ""
  });

  const [campanias, setCampanias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const listarCampanias = async () => {
    try {
      setCargando(true);
      setError("");

      const { data } = await axios.get(
        "http://localhost:3000/api/campanias/listar-campanias"
      );

      if (!data.success) {
        setError(data.message || "No se pudieron listar las campañas.");
        return;
      }

      setCampanias(data.data);
    } catch (error) {
      console.log("Error al listar campañas:", error);

      setError(
        error.response?.data?.message ||
          "No se pudo conectar con el servidor."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    listarCampanias();
  }, []);

  const data = campanias.filter((item) =>
    `${item.nombre || ""} ${item.producto || ""} ${item.observacion || ""}`
      .toLowerCase()
      .includes(buscar.toLowerCase())
  );

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";

    return new Date(fecha).toLocaleString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  };

  const formatearFechaHora = (fecha) => {
    if (!fecha) return "-";

    return new Date(fecha).toLocaleString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const obtenerEstadoVisualCampania = (item) => {
    if (item.fecha_fin) {
      return {
        fondo: "#fff5f5",
        color: "#c62828",
        texto: "Cerrada",
        icono: "lock"
      };
    }

    return {
      fondo: "#ffffff",
      color: "#2e7d32",
      texto: "Abierta",
      icono: "check_circle"
    };
  };

  const abrirModalCrear = () => {
    setModoModal("crear");
    setCampaniaEditando(null);

    setForm({
      nombre: "",
      producto: "",
      fecha_inicio: "",
      fecha_fin: "",
      observacion: ""
    });

    setMensajeModal({
      tipo: "",
      texto: ""
    });

    setModalOpen(true);
  };

  const abrirModalEditar = (item) => {
    if (item.fecha_fin) {
      setError("No se puede editar una campaña cerrada.");
      return;
    }

    setModoModal("editar");
    setCampaniaEditando(item);

    setForm({
      nombre: item.nombre || "",
      producto: item.producto || "",
      fecha_inicio: item.fecha_inicio ? item.fecha_inicio.split("T")[0] : "",
      fecha_fin: item.fecha_fin ? item.fecha_fin.split("T")[0] : "",
      observacion: item.observacion || ""
    });

    setMensajeModal({
      tipo: "",
      texto: ""
    });

    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  const guardarCampania = async (e) => {
    e.preventDefault();

    try {
      setGuardando(true);
      setMensajeModal({
        tipo: "",
        texto: ""
      });

      if (!form.nombre.trim()) {
        setMensajeModal({
          tipo: "error",
          texto: "El nombre de la campaña es obligatorio."
        });
        return;
      }

      if (!form.producto.trim()) {
        setMensajeModal({
          tipo: "error",
          texto: "El producto es obligatorio."
        });
        return;
      }

      if (!form.fecha_inicio) {
        setMensajeModal({
          tipo: "error",
          texto: "La fecha de inicio es obligatoria."
        });
        return;
      }

      const body = {
        nombre: form.nombre.trim(),
        producto: form.producto.trim(),
        fecha_inicio: form.fecha_inicio,
        fecha_fin: form.fecha_fin || null,
        observacion: form.observacion.trim() || null
      };

      let response;

      if (modoModal === "crear") {
        response = await axios.post(
          "http://localhost:3000/api/campanias/crear-campania",
          body
        );
      } else {
        response = await axios.put(
          `http://localhost:3000/api/campanias/actualizar-campania/${campaniaEditando.uuid}`,
          body
        );
      }

      const { data } = response;

      if (!data.success) {
        setMensajeModal({
          tipo: "error",
          texto: data.message || "No se pudo guardar la campaña."
        });
        return;
      }

      setMensajeModal({
        tipo: "success",
        texto:
          modoModal === "crear"
            ? "Campaña registrada correctamente."
            : "Campaña actualizada correctamente."
      });

      await listarCampanias();

      setTimeout(() => {
        cerrarModal();
      }, 600);
    } catch (error) {
      console.log("Error al guardar campaña:", error);

      setMensajeModal({
        tipo: "error",
        texto:
          error.response?.data?.message ||
          "No se pudo conectar con el servidor."
      });
    } finally {
      setGuardando(false);
    }
  };

  const abrirConfirmCerrar = (item) => {
  setCampaniaSeleccionada(item);
  setConfirmOpen(true);
};

  const cerrarConfirm = () => {
    setConfirmOpen(false);
    setCampaniaSeleccionada(null);
  };

  const cerrarCampania = async () => {
    try {
      if (!campaniaSeleccionada) return;

      const { data } = await axios.patch(
        `http://localhost:3000/api/campanias/cerrar-campania/${campaniaSeleccionada.uuid}`
      );

      if (!data.success) {
        setError(data.message || "No se pudo cerrar la campaña.");
        return;
      }

      await listarCampanias();
      cerrarConfirm();

    } catch (error) {
      console.log("Error al cerrar campaña:", error);

      setError(
        error.response?.data?.message ||
        "No se pudo cerrar la campaña."
      );
    }
  };

  const campaniaEstaCerrada = (item) => {
    return item.fecha_fin !== null && item.fecha_fin !== "";
  };

  return (
    <div style={{ padding: "12px 16px" }}>
      <div
        style={{
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "4px"
        }}
      >
        <div
          style={{
            padding: "10px 12px",
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap"
          }}
        >
          <div>
            <div style={{ fontSize: "18px", fontWeight: 600 }}>Campañas</div>
            <div style={{ fontSize: "12px", color: "#777" }}>
              Mantenimiento de campañas agrícolas
            </div>
          </div>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <button
              className="btn-small green darken-2"
              style={{ height: "30px", lineHeight: "30px" }}
            >
              <i className="material-icons left" style={{ fontSize: "17px" }}>
                table_view
              </i>
              Excel
            </button>

            <button
              className="btn-small red darken-2"
              style={{ height: "30px", lineHeight: "30px" }}
            >
              <i className="material-icons left" style={{ fontSize: "17px" }}>
                picture_as_pdf
              </i>
              PDF
            </button>

            <button
              className="btn-small grey darken-2"
              style={{ height: "30px", lineHeight: "30px" }}
            >
              <i className="material-icons left" style={{ fontSize: "17px" }}>
                print
              </i>
              Imprimir
            </button>

            <button
              className="btn-small blue darken-3"
              style={{ height: "30px", lineHeight: "30px" }}
              onClick={abrirModalCrear}
            >
              <i className="material-icons left" style={{ fontSize: "18px" }}>
                add
              </i>
              Nueva
            </button>
          </div>
        </div>

        <div
          style={{
            padding: "8px 12px",
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            flexWrap: "wrap"
          }}
        >
          <input
            type="text"
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            placeholder="Buscar campaña, producto u observación..."
            style={{
              margin: 0,
              height: "32px",
              maxWidth: "360px",
              fontSize: "13px"
            }}
          />

          <span style={{ fontSize: "12px", color: "#777" }}>
            Registros: {data.length}
          </span>
        </div>

        {cargando && (
          <div style={{ padding: "10px 12px", color: "#777", fontSize: "13px" }}>
            Cargando campañas...
          </div>
        )}

        {error && (
          <div style={{ padding: "10px 12px", color: "#c62828", fontSize: "13px" }}>
            {error}
          </div>
        )}

        <div style={{ overflowX: "auto" }}>
          <table
            className="highlight"
            style={{
              margin: 0,
              fontSize: "13px",
              minWidth: "1100px"
            }}
          >
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th style={{ padding: "8px 10px", width: "220px" }}>Campaña</th>
                <th style={{ padding: "8px 10px", width: "100px" }}>Producto</th>
                <th style={{ padding: "8px 10px", width: "115px" }}>Inicio</th>
                <th style={{ padding: "8px 10px", width: "115px" }}>Fin</th>
                <th style={{ padding: "8px 10px", width: "140px" }}>Creación</th>
                <th style={{ padding: "8px 10px", width: "145px" }}>Actualización</th>
                <th style={{ padding: "8px 10px", width: "115px" }}>Estado</th>
                <th style={{ padding: "8px 10px", width: "95px", textAlign: "center" }}>
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item) => {
                  const estaCerrada = campaniaEstaCerrada(item);
                  const estadoVisual = obtenerEstadoVisualCampania(item);

                  return (
                    <tr
                      key={item.id}
                      style={{
                        background: estadoVisual.fondo
                      }}
                    >
                      <td
                        style={{
                          padding: "7px 10px",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={item.nombre}
                      >
                        {item.nombre}
                      </td>

                      <td style={{ padding: "7px 10px" }}>{item.producto}</td>

                      <td style={{ padding: "7px 10px", color: "#616161" }}>
                        {formatearFecha(item.fecha_inicio)}
                      </td>

                      <td style={{ padding: "7px 10px", color: "#616161" }}>
                        {formatearFecha(item.fecha_fin)}
                      </td>

                      <td style={{ padding: "7px 10px", color: "#616161" }}>
                        {formatearFechaHora(item.fecha_creacion)}
                      </td>

                      <td style={{ padding: "7px 10px", color: "#616161" }}>
                        {formatearFechaHora(item.fecha_actualizacion)}
                      </td>

                      <td style={{ padding: "7px 10px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: "11px",
                            padding: "3px 9px",
                            borderRadius: "12px",
                            background: estadoVisual.fondo,
                            color: estadoVisual.color,
                            fontWeight: 700,
                            border: `1px solid ${estadoVisual.borde}`
                          }}
                        >
                          <i className="material-icons" style={{ fontSize: "13px" }}>
                            {estadoVisual.icono}
                          </i>
                          {estadoVisual.texto}
                        </span>
                      </td>

                      <td style={{ padding: "7px 10px", textAlign: "center" }}>
                        <button
                          className={item.fecha_fin ? "btn-small grey darken-1" : "btn-small blue darken-3"}
                          disabled={!!item.fecha_fin}
                          onClick={() => abrirModalEditar(item)}
                          style={{
                            height: "25px",
                            lineHeight: "25px",
                            padding: "0 7px",
                            marginRight: "4px"
                          }}
                          title={item.fecha_fin ? "Campaña cerrada, no editable" : "Editar campaña"}
                        >
                          <i className="material-icons" style={{ fontSize: "15px" }}>
                            edit
                          </i>
                        </button>

                        <button
                          className={
                            estaCerrada
                              ? "btn-small grey darken-1"
                              : "btn-small red darken-2"
                          }
                          style={{
                            height: "25px",
                            lineHeight: "25px",
                            padding: "0 7px"
                          }}
                          title={
                            estaCerrada
                              ? "Campaña cerrada"
                              : "Cerrar campaña"
                          }
                          disabled={estaCerrada}
                          onClick={() => abrirConfirmCerrar(item)}
                        >
                          <i className="material-icons" style={{ fontSize: "15px" }}>
                            {estaCerrada ? "lock" : "lock_open"}
                          </i>
                        </button>

                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      color: "#777"
                    }}
                  >
                    No se encontraron campañas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            padding: "8px 12px",
            fontSize: "12px",
            color: "#777",
            borderTop: "1px solid #eee",
            display: "flex",
            gap: "16px"
          }}
        >
          <span>
            <span
              style={{
                display: "inline-block",
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: "#2e7d32",
                marginRight: "5px"
              }}
            />
            Abierta
          </span>

          <span>
            <span
              style={{
                display: "inline-block",
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: "#c62828",
                marginRight: "5px"
              }}
            />
            Vencida
          </span>
        </div>

        {modalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 10000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px"
            }}
          >
            <div
              style={{
                background: "#fff",
                width: "100%",
                maxWidth: "520px",
                borderRadius: "4px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.25)"
              }}
            >
              <div
                style={{
                  padding: "10px 14px",
                  borderBottom: "1px solid #e0e0e0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div style={{ fontSize: "16px", fontWeight: 600 }}>
                  Nueva campaña
                </div>

                <button
                  onClick={cerrarModal}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer"
                  }}
                >
                  <i className="material-icons">close</i>
                </button>
              </div>

              <form onSubmit={guardarCampania}>
                <div style={{ padding: "14px" }}>
                  {mensajeModal.texto && (
                    <div
                      style={{
                        marginBottom: "10px",
                        padding: "8px 10px",
                        fontSize: "13px",
                        borderRadius: "4px",
                        background:
                          mensajeModal.tipo === "success"
                            ? "#e8f5e9"
                            : "#ffebee",
                        color:
                          mensajeModal.tipo === "success"
                            ? "#2e7d32"
                            : "#c62828",
                        border:
                          mensajeModal.tipo === "success"
                            ? "1px solid #a5d6a7"
                            : "1px solid #ef9a9a"
                      }}
                    >
                      {mensajeModal.texto}
                    </div>
                  )}

                  <div style={{ marginBottom: "10px" }}>
                    <label>Nombre de campaña *</label>
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Ej. Campaña Mango 2026"
                      maxLength="100"
                      style={{
                        margin: 0,
                        height: "32px",
                        fontSize: "13px"
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <label>Producto *</label>
                    <input
                      type="text"
                      name="producto"
                      value={form.producto}
                      onChange={handleChange}
                      placeholder="Ej. Mango"
                      maxLength="50"
                      style={{
                        margin: 0,
                        height: "32px",
                        fontSize: "13px"
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                      marginBottom: "10px"
                    }}
                  >
                    <div>
                      <label>Fecha inicio *</label>
                      <input
                        type="date"
                        name="fecha_inicio"
                        value={form.fecha_inicio}
                        onChange={handleChange}
                        style={{
                          margin: 0,
                          height: "32px",
                          fontSize: "13px"
                        }}
                      />
                    </div>

                    <div>
                      <label>Fecha fin</label>
                      <input
                        type="date"
                        name="fecha_fin"
                        value={form.fecha_fin}
                        onChange={handleChange}
                        style={{
                          margin: 0,
                          height: "32px",
                          fontSize: "13px"
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label>Observación</label>
                    <textarea
                      name="observacion"
                      value={form.observacion}
                      onChange={handleChange}
                      placeholder="Ej. Primera campaña registrada desde el sistema"
                      className="materialize-textarea"
                      style={{
                        margin: 0,
                        minHeight: "70px",
                        fontSize: "13px"
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    padding: "10px 14px",
                    borderTop: "1px solid #e0e0e0",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "8px"
                  }}
                >
                  <button
                    type="button"
                    className="btn-small grey lighten-1 black-text"
                    onClick={cerrarModal}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="btn-small blue darken-3"
                    disabled={guardando}
                  >
                    {guardando ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/**Modal para confirmar el cierre de campaña */}
        {confirmOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 10001,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px"
            }}
          >
            <div
              style={{
                background: "#fff",
                width: "100%",
                maxWidth: "420px",
                borderRadius: "4px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  padding: "10px 14px",
                  borderBottom: "1px solid #e0e0e0",
                  fontSize: "16px",
                  fontWeight: 600
                }}
              >
                Cerrar campaña
              </div>

              <div style={{ padding: "16px 14px" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <i
                    className="material-icons"
                    style={{ color: "#c62828", fontSize: "32px" }}
                  >
                    warning
                  </i>

                  <div style={{ fontSize: "14px", color: "#424242" }}>
                    <div>
                      ¿Está seguro que desea cerrar esta campaña?
                    </div>

                    <div
                      style={{
                        fontSize: "13px",
                        color: "#757575",
                        background: "#f5f5f5",
                        padding: "6px 8px",
                        borderRadius: "3px",
                        marginTop: "8px"
                      }}
                    >
                      {campaniaSeleccionada?.nombre}
                    </div>

                    <div style={{ marginTop: "8px", color: "#c62828", fontSize: "13px" }}>
                      Al cerrar la campaña, su estado pasará a cerrado.
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: "10px 14px",
                  borderTop: "1px solid #e0e0e0",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px"
                }}
              >
                <button
                  type="button"
                  className="btn-small grey lighten-1 black-text"
                  onClick={cerrarConfirm}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="btn-small red darken-2"
                  onClick={cerrarCampania}
                >
                  Cerrar campaña
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CampaniasPage;