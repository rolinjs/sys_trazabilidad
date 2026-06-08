import { useState, useEffect } from "react";
import axios from 'axios';

function VariedadesPage() {
  const [buscar, setBuscar] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modoModal, setModoModal] = useState("crear");
  const [variedadEditando, setVariedadEditando] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [form, setForm] = useState({
    codigo: "",
    nombre: ""
  });

  const [variedades, setVariedades] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensajeModal, setMensajeModal] = useState({
    tipo: "",
    texto: ""
  });

  const listarVariedades = async () => {
    try {
      setCargando(true);
      setError("");
      const { data } = await axios.get('http://localhost:3000/api/variedades/listar-variedades');

      if(!data.success) {
        setError(data.message || 'No se pudieron listar las variedades');
        return;
      }

      setVariedades(data.data);

    } catch (error) {
      console.log("Error al listar variedades:", error);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    listarVariedades();
  }, []);

  const data = variedades.filter((item) =>
    `${item.codigo || ""} ${item.nombre || ""}`
      .toLowerCase()
      .includes(buscar.toLowerCase())
  );

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";

    return new Date(fecha).toLocaleString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const abrirModalCrear = () => {

    setModoModal("crear");
    setVariedadEditando(null);

    setForm({
      codigo: "",
      nombre: ""
    });

    setMensajeModal({
      tipo: "",
      texto: ""
    });

    setModalOpen(true);
  };

  const abrirModalEditar = (item) => {
    setModoModal("editar");
    setVariedadEditando(item);

    setForm({
      codigo: item.codigo || "",
      nombre: item.nombre || ""
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

  const guardarVariedad = async (e) => {
    e.preventDefault();

    try {
      setGuardando(true);
      setMensajeModal({
        tipo: "",
        texto: ""
      });

      if (!form.codigo.trim()) {
        setMensajeModal({
          tipo: "error",
          texto: "El código es obligatorio"
        });
        return;
      }

      if (!form.nombre.trim()) {
        setMensajeModal({
          tipo: "error",
          texto: "El nombre es obligatorio"
        });
        return;
      }

      let response;

      if (modoModal === "crear") {
        response = await axios.post(
          "http://localhost:3000/api/variedades/crear-variedad",
          {
            codigo: form.codigo.trim().toUpperCase(),
            nombre: form.nombre.trim()
          }
        );
      } else {
        response = await axios.put(
          `http://localhost:3000/api/variedades/actualizar-variedad/${variedadEditando.uuid}`,
          {
            codigo: form.codigo.trim().toUpperCase(),
            nombre: form.nombre.trim()
          }
        );
      }

      const { data } = response;

      if (!data.success) {
        setMensajeModal({
          tipo: "error",
          texto: data.message || "No se pudo guardar la variedad"
        });
        return;
      }

      setMensajeModal({
        tipo: "success",
        texto:
          modoModal === "crear"
            ? "Variedad registrada correctamente"
            : "Variedad actualizada correctamente"
      });

      await listarVariedades();

      setTimeout(() => {
        cerrarModal();
      }, 600);
    } catch (error) {
      console.log("Error al guardar variedad:", error);

      setMensajeModal({
        tipo: "error",
        texto:
          error.response?.data?.message ||
          "No se pudo conectar con el servidor"
      });
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstadoVariedad = (item) => {
    setRegistroSeleccionado(item);
    setConfirmOpen(true);
  };

  const ejecutarCambioEstado = async () => {
    try {
      if (!registroSeleccionado) return;

      const { data } = await axios.patch(
        `http://localhost:3000/api/variedades/cambiar-estado-variedad/${registroSeleccionado.uuid}`
      );

      if (!data.success) {
        setError(data.message || "No se pudo cambiar el estado.");
        return;
      }

      await listarVariedades();

      setConfirmOpen(false);
      setRegistroSeleccionado(null);
    } catch (error) {
      console.log("Error al cambiar estado:", error);

      setError(
        error.response?.data?.message ||
        "No se pudo cambiar el estado."
      );
    }
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
            <div style={{ fontSize: "18px", fontWeight: 600 }}>
              Variedades
            </div>
            <div style={{ fontSize: "12px", color: "#777" }}>
              Mantenimiento de variedades de fruta
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap"
            }}
          >
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
            placeholder="Buscar código o nombre..."
            style={{
              margin: 0,
              height: "32px",
              maxWidth: "280px",
              fontSize: "13px"
            }}
          />

          <span style={{ fontSize: "12px", color: "#777" }}>
            Registros: {data.length}
          </span>
        </div>

        {cargando && (
            <div style={{ padding: "10px 12px", color: "#777", fontSize: "13px" }}>
              Cargando variedades...
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
              minWidth: "720px"
            }}
          >
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th style={{ padding: "8px 10px", width: "180px" }}>Código</th>
                <th style={{ padding: "8px 10px" }}>Nombre</th>
                <th style={{ padding: "8px 10px", width: "180px" }}>
                  Fecha creación
                </th>
                <th style={{ padding: "8px 10px", width: "180px" }}>
                  Fecha actualización
                </th>
                <th style={{ padding: "8px 10px", width: "185px" }}>Estado</th>
                <th style={{ padding: "8px 10px", width: "110px" }}>
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: "7px 10px", fontWeight: 600 }}>
                      {item.codigo}
                    </td>

                    <td style={{ padding: "7px 10px" }}>{item.nombre}</td>

                    <td style={{ padding: "7px 10px", color: "#616161" }}>
                      {formatearFecha(item.fecha_creacion)}
                    </td>

                    <td style={{ padding: "7px 10px", color: "#616161" }}>
                      {formatearFecha(item.fecha_actualizacion)}
                    </td>

                    <td style={{ padding: "7px 10px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "11px",
                          padding: "3px 9px",
                          borderRadius: "12px",
                          background: item.estado === 1
                            ? "linear-gradient(135deg, #e8f5e9, #c8e6c9)"
                            : "linear-gradient(135deg, #ffebee, #ffcdd2)",
                          color: item.estado === 1 ? "#1b5e20" : "#b71c1c",
                          fontWeight: 700,
                          border: item.estado === 1
                            ? "1px solid #81c784"
                            : "1px solid #ef9a9a"
                        }}
                      >
                        <span
                          style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            background: item.estado === 1 ? "#2e7d32" : "#c62828"
                          }}
                        />
                        {item.estado === 1 ? "Activo" : "Inactivo"}
                      </span>
                    </td> 

                    <td style={{ padding: "7px 10px" }}>
                      <button
                        className="btn-small blue darken-3"
                        onClick={() => abrirModalEditar(item)}
                        style={{
                          height: "25px",
                          lineHeight: "25px",
                          padding: "0 7px",
                          marginRight: "4px"
                        }}
                      >
                        <i className="material-icons" style={{ fontSize: "15px" }}>
                          edit
                        </i>
                      </button>

                      <button
                        onClick={() => cambiarEstadoVariedad(item)}
                        className={
                          item.estado === 1
                            ? "btn-small red darken-2"
                            : "btn-small green darken-2"
                        }
                        style={{
                          height: "26px",
                          lineHeight: "26px",
                          padding: "0 8px"
                        }}
                        title={
                          item.estado === 1
                            ? "Desactivar variedad"
                            : "Activar variedad"
                        }
                      >
                        <i
                          className="material-icons"
                          style={{ fontSize: "16px" }}
                        >
                          {item.estado === 1 ? "toggle_off" : "toggle_on"}
                        </i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      color: "#777"
                    }}
                  >
                    No se encontraron variedades.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
              maxWidth: "420px",
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
                {modoModal === "crear" ? "Nueva variedad" : "Editar variedad"}
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

            <form onSubmit={guardarVariedad}>
              <div style={{ padding: "14px" }}>
                {mensajeModal.texto && (
                  <div
                    style={{
                      marginBottom: "10px",
                      padding: "8px 10px",
                      fontSize: "13px",
                      borderRadius: "4px",
                      background:
                        mensajeModal.tipo === "success" ? "#e8f5e9" : "#ffebee",
                      color:
                        mensajeModal.tipo === "success" ? "#2e7d32" : "#c62828",
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
                  <label>Código</label>
                  <input
                    type="text"
                    name="codigo"
                    value={form.codigo}
                    onChange={handleChange}
                    placeholder="Ej. ATU"
                    maxLength="10"
                    style={{
                      margin: 0,
                      height: "32px",
                      fontSize: "13px"
                    }}
                  />
                </div>

                <div>
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ej. Ataulfo"
                    maxLength="100"
                    style={{
                      margin: 0,
                      height: "32px",
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
                  {guardando
                    ? "Guardando..."
                    : modoModal === "crear"
                      ? "Guardar"
                      : "Actualizar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              maxWidth: "390px",
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
              Confirmar acción
            </div>

            <div style={{ padding: "16px 14px" }}>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start"
                }}
              >
                <i
                  className="material-icons"
                  style={{
                    color:
                      registroSeleccionado?.estado === 1
                        ? "#c62828"
                        : "#2e7d32",
                    fontSize: "32px"
                  }}
                >
                  {registroSeleccionado?.estado === 1
                    ? "block"
                    : "check_circle"}
                </i>

                <div style={{ fontSize: "14px", color: "#424242" }}>
                  <div style={{ marginBottom: "4px" }}>
                    ¿Está seguro que desea{" "}
                    <strong>
                      {registroSeleccionado?.estado === 1
                        ? "desactivar"
                        : "activar"}
                    </strong>{" "}
                    esta variedad?
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
                    {registroSeleccionado?.codigo} -{" "}
                    {registroSeleccionado?.nombre}
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
                onClick={() => {
                  setConfirmOpen(false);
                  setRegistroSeleccionado(null);
                }}
              >
                Cancelar
              </button>

              <button
                type="button"
                className={
                  registroSeleccionado?.estado === 1
                    ? "btn-small red darken-2"
                    : "btn-small green darken-2"
                }
                onClick={ejecutarCambioEstado}
              >
                {registroSeleccionado?.estado === 1
                  ? "Desactivar"
                  : "Activar"}
              </button>
            </div>
          </div>
        </div>
      )}
          </div>
        );
      }

export default VariedadesPage;