import { useState, useEffect } from "react";
import {
  listarClientesService,
  crearClientesService,
  cambiarEstadoClienteService,
  actualizarClientesService
} from "../../services/clientes.service";

function ClientesPage() {
  const [buscar, setBuscar] = useState("");
  const [pasoFormulario, setPasoFormulario] = useState(1);
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 5;

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  //ver datos
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [clienteDetalle, setClienteDetalle] = useState(null);

  //actualizar datos
  const [modoFormulario, setModoFormulario] = useState("crear");
  const [clienteEditando, setClienteEditando] = useState(null);

  const [guardando, setGuardando] = useState(false);
  const [mensajeFormulario, setMensajeFormulario] = useState({
    tipo: "",
    texto: ""
  });

  const [form, setForm] = useState({
    razon_social: "",
    ruc: "",
    direccion_fiscal: "",
    representante_legal: "",
    telefono_principal: "",
    correo_principal: "",
    persona_contacto_planta: "",
    telefono_contacto: "",
    correo_contacto: ""
  });

  const listarClientes = async () => {
    try {
      setLoading(true);

      const response = await listarClientesService();

      const listado = Array.isArray(response)
        ? response
        : response.data || [];

      setClientes(listado);
    } catch (error) {
      console.log("Error al listar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listarClientes();
  }, []);

  const data = clientes.filter((item) =>
    `${item.codigo || ""} ${item.razon_social || ""} ${item.ruc || ""}`
      .toLowerCase()
      .includes(buscar.toLowerCase())
  );

  const clientesActivos = clientes.filter((item) => item.estado === 1).length;
  const clientesInactivos = clientes.filter((item) => item.estado === 0).length;

  const totalPaginas = Math.ceil(data.length / registrosPorPagina);
  const indiceInicial = (paginaActual - 1) * registrosPorPagina;
  const indiceFinal = indiceInicial + registrosPorPagina;
  const dataPaginada = data.slice(indiceInicial, indiceFinal);

  const datosObligatoriosCompletos =
    form.razon_social.trim() &&
    form.ruc.trim() &&
    form.ruc.trim().length === 11;

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    setPaginaActual(nuevaPagina);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

    if (mensajeFormulario.texto) {
      setMensajeFormulario({
        tipo: "",
        texto: ""
      });
    }
  };

  const limpiarFormulario = () => {
    setForm({
      razon_social: "",
      ruc: "",
      direccion_fiscal: "",
      representante_legal: "",
      telefono_principal: "",
      correo_principal: "",
      persona_contacto_planta: "",
      telefono_contacto: "",
      correo_contacto: ""
    });

    setPasoFormulario(1);
    setMensajeFormulario({
      tipo: "",
      texto: ""
    });

    setModoFormulario("crear");
    setClienteEditando(null);
  };

  const avanzarPasoOpcionales = () => {
    setMensajeFormulario({
      tipo: "",
      texto: ""
    });

    if (!form.razon_social.trim()) {
      setMensajeFormulario({
        tipo: "error",
        texto: "Ingrese la razón social."
      });
      return;
    }

    if (!form.ruc.trim()) {
      setMensajeFormulario({
        tipo: "error",
        texto: "Ingrese el RUC."
      });
      return;
    }

    if (form.ruc.trim().length !== 11) {
      setMensajeFormulario({
        tipo: "error",
        texto: "El RUC debe tener 11 dígitos."
      });
      return;
    }

    setPasoFormulario(2);
  };

  const guardarCliente = async () => {
  try {
    setGuardando(true);
    setMensajeFormulario({
      tipo: "",
      texto: ""
    });

    if (!form.razon_social.trim()) {
      setPasoFormulario(1);
      setMensajeFormulario({
        tipo: "error",
        texto: "La razón social es obligatoria."
      });
      return;
    }

    if (!form.ruc.trim()) {
      setPasoFormulario(1);
      setMensajeFormulario({
        tipo: "error",
        texto: "El RUC es obligatorio."
      });
      return;
    }

    if (form.ruc.trim().length !== 11) {
      setPasoFormulario(1);
      setMensajeFormulario({
        tipo: "error",
        texto: "El RUC debe tener 11 dígitos."
      });
      return;
    }

    const body = {
      razon_social: form.razon_social.trim(),
      ruc: form.ruc.trim(),
      direccion_fiscal: form.direccion_fiscal.trim() || null,
      representante_legal: form.representante_legal.trim() || null,
      telefono_principal: form.telefono_principal.trim() || null,
      correo_principal: form.correo_principal.trim() || null,
      persona_contacto_planta: form.persona_contacto_planta.trim() || null,
      telefono_contacto: form.telefono_contacto.trim() || null,
      correo_contacto: form.correo_contacto.trim() || null
    };

    let response;

    if (modoFormulario === "crear") {
      response = await crearClientesService(body);
    } else {
      response = await actualizarClientesService(clienteEditando.uuid, body);
    }

    if (!response.success) {
      setMensajeFormulario({
        tipo: "error",
        texto: response.message || "No se pudo guardar el cliente."
      });
      return;
    }

    setMensajeFormulario({
      tipo: "success",
      texto:
        response.message ||
        (modoFormulario === "crear"
          ? "Cliente registrado correctamente."
          : "Cliente actualizado correctamente.")
    });

    await listarClientes();

    setTimeout(() => {
      limpiarFormulario();
    }, 700);
  } catch (error) {
    console.log("Error al guardar cliente:", error);

    setMensajeFormulario({
      tipo: "error",
      texto:
        error.response?.data?.message ||
        "No se pudo conectar con el servidor."
    });
  } finally {
    setGuardando(false);
  }
};

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <div className="progress">
          <div className="indeterminate"></div>
        </div>
        <p>Cargando clientes...</p>
      </div>
    );
  }

  const abrirConfirmEstado = (item) => {
    setClienteSeleccionado(item);
    setConfirmOpen(true);
  };

  const cerrarConfirmEstado = () => {
    setConfirmOpen(false);
    setClienteSeleccionado(null);
  };

  const ejecutarCambioEstado = async () => {
    try {
      if (!clienteSeleccionado) return;

      const response = await cambiarEstadoClienteService(
        clienteSeleccionado.uuid
      );

      if (!response.success) {
        setMensajeFormulario({
          tipo: "error",
          texto: response.message || "No se pudo cambiar el estado."
        });
        return;
      }

      setMensajeFormulario({
        tipo: "success",
        texto: response.message || "Estado actualizado correctamente."
      });

      await listarClientes();

      cerrarConfirmEstado();

      setTimeout(() => {
        setMensajeFormulario({
          tipo: "",
          texto: ""
        });
      }, 2000);
    } catch (error) {
      console.log("Error al cambiar estado:", error);

      setMensajeFormulario({
        tipo: "error",
        texto:
          error.response?.data?.message ||
          "No se pudo cambiar el estado del cliente."
      });
    }
  };

  const abrirDetalleCliente = (item) => {
    setClienteDetalle(item);
    setDetalleOpen(true);
  };

  const cerrarDetalleCliente = () => {
    setDetalleOpen(false);
    setClienteDetalle(null);
  };

  const mostrarDato = (valor) => {
    return valor && valor !== "" ? valor : "-";
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

  /**
   * ACTUALIZAR CLIENTE
   */
  const editarCliente = (item) => {
    setModoFormulario("editar");
    setClienteEditando(item);

    setForm({
      codigo: item.codigo || "",
      razon_social: item.razon_social || "",
      ruc: item.ruc || "",
      direccion_fiscal: item.direccion_fiscal || "",
      representante_legal: item.representante_legal || "",
      telefono_principal: item.telefono_principal || "",
      correo_principal: item.correo_principal || "",
      persona_contacto_planta: item.persona_contacto_planta || "",
      telefono_contacto: item.telefono_contacto || "",
      correo_contacto: item.correo_contacto || ""
    });

    setPasoFormulario(1);
    setMensajeFormulario({
      tipo: "",
      texto: ""
    });
  };

  const siguienteCodigo = String(
    clientes.length + 1
  ).padStart(2, "0");

  return (
    <div style={{ padding: "12px 16px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "420px 1fr",
          gap: "12px",
          alignItems: "start"
        }}
      >
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
              alignItems: "center",
              gap: "8px"
            }}
          >
            <i className="material-icons blue-text text-darken-3">
              business
            </i>

            <div>
              <div style={{ fontSize: "18px", fontWeight: 600 }}>
                {modoFormulario === "crear"
                  ? "Clientes / Exportadores"
                  : "Editar Cliente / Exportador"}
              </div>
              <div style={{ fontSize: "12px", color: "#777" }}>
                Registro y mantenimiento de clientes
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "10px 12px",
              borderBottom: "1px solid #e0e0e0"
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px"
              }}
            >
              <button
                type="button"
                onClick={() => setPasoFormulario(1)}
                style={{
                  border: "1px solid #ddd",
                  background: pasoFormulario === 1 ? "#e3f2fd" : "#fff",
                  color: pasoFormulario === 1 ? "#0d47a1" : "#666",
                  padding: "7px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 600
                }}
              >
                1. Obligatorios
              </button>

              <button
                type="button"
                onClick={avanzarPasoOpcionales}
                style={{
                  border: "1px solid #ddd",
                  background: pasoFormulario === 2 ? "#e3f2fd" : "#fff",
                  color: pasoFormulario === 2 ? "#0d47a1" : "#666",
                  padding: "7px",
                  borderRadius: "4px",
                  cursor: datosObligatoriosCompletos ? "pointer" : "not-allowed",
                  opacity: datosObligatoriosCompletos ? 1 : 0.65,
                  fontSize: "12px",
                  fontWeight: 600
                }}
              >
                2. Opcionales
              </button>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div style={{ padding: "12px" }}>
              {mensajeFormulario.texto && (
                <div
                  style={{
                    marginBottom: "10px",
                    padding: "8px 10px",
                    fontSize: "13px",
                    borderRadius: "4px",
                    background:
                      mensajeFormulario.tipo === "success" ? "#e8f5e9" : "#ffebee",
                    color:
                      mensajeFormulario.tipo === "success" ? "#2e7d32" : "#c62828",
                    border:
                      mensajeFormulario.tipo === "success"
                        ? "1px solid #a5d6a7"
                        : "1px solid #ef9a9a"
                  }}
                >
                  {mensajeFormulario.texto}
                </div>
              )}

              {pasoFormulario === 1 && (
                <>
                  <div style={{ marginBottom: "10px" }}>
                    <label>Código</label>

                    <input
                      type="text"
                      value={siguienteCodigo}
                      readOnly
                      style={{
                        margin: 0,
                        height: "32px",
                        fontSize: "13px",
                        background: "#f5f5f5",
                        color: "#616161",
                        fontWeight: "600"
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <label>Razón social *</label>
                    <input
                      type="text"
                      name="razon_social"
                      value={form.razon_social}
                      onChange={handleChange}
                      placeholder="Ej. AGP Export SAC"
                      maxLength="150"
                      style={{ margin: 0, height: "32px", fontSize: "13px" }}
                    />
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <label>RUC *</label>
                    <input
                      type="text"
                      name="ruc"
                      value={form.ruc}
                      onChange={handleChange}
                      placeholder="Ej. 20601234567"
                      maxLength="11"
                      style={{ margin: 0, height: "32px", fontSize: "13px" }}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: "12px",
                      padding: "8px 10px",
                      background: "#f5f5f5",
                      color: "#555",
                      borderRadius: "4px",
                      fontSize: "12px"
                    }}
                  >
                    Código, razón social y RUC son obligatorios.
                  </div>
                </>
              )}

              {pasoFormulario === 2 && (
                <>
                  <div style={{ marginBottom: "10px" }}>
                    <label>Dirección fiscal</label>
                    <input
                      type="text"
                      name="direccion_fiscal"
                      value={form.direccion_fiscal}
                      onChange={handleChange}
                      placeholder="Dirección fiscal"
                      style={{ margin: 0, height: "32px", fontSize: "13px" }}
                    />
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <label>Representante legal</label>
                    <input
                      type="text"
                      name="representante_legal"
                      value={form.representante_legal}
                      onChange={handleChange}
                      placeholder="Nombre del representante"
                      style={{ margin: 0, height: "32px", fontSize: "13px" }}
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                      marginBottom: "10px"
                    }}
                  >
                    <div>
                      <label>Teléfono</label>
                      <input
                        type="text"
                        name="telefono_principal"
                        value={form.telefono_principal}
                        onChange={handleChange}
                        placeholder="Teléfono"
                        style={{ margin: 0, height: "32px", fontSize: "13px" }}
                      />
                    </div>

                    <div>
                      <label>Correo</label>
                      <input
                        type="email"
                        name="correo_principal"
                        value={form.correo_principal}
                        onChange={handleChange}
                        placeholder="Correo"
                        style={{ margin: 0, height: "32px", fontSize: "13px" }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <label>Contacto en planta</label>
                    <input
                      type="text"
                      name="persona_contacto_planta"
                      value={form.persona_contacto_planta}
                      onChange={handleChange}
                      placeholder="Persona de contacto"
                      style={{ margin: 0, height: "32px", fontSize: "13px" }}
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px"
                    }}
                  >
                    <div>
                      <label>Tel. contacto</label>
                      <input
                        type="text"
                        name="telefono_contacto"
                        value={form.telefono_contacto}
                        onChange={handleChange}
                        placeholder="Teléfono"
                        style={{ margin: 0, height: "32px", fontSize: "13px" }}
                      />
                    </div>

                    <div>
                      <label>Correo contacto</label>
                      <input
                        type="email"
                        name="correo_contacto"
                        value={form.correo_contacto}
                        onChange={handleChange}
                        placeholder="Correo"
                        style={{ margin: 0, height: "32px", fontSize: "13px" }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div
              style={{
                padding: "10px 12px",
                borderTop: "1px solid #e0e0e0",
                display: "flex",
                justifyContent: "space-between",
                gap: "8px"
              }}
            >
              <button
                type="button"
                className="btn-small grey lighten-1 black-text"
                onClick={limpiarFormulario}
              >
                {modoFormulario === "crear" ? "Limpiar" : "Cancelar"}
              </button>

              <div style={{ display: "flex", gap: "6px" }}>
                {pasoFormulario === 2 && (
                  <button
                    type="button"
                    className="btn-small grey darken-1"
                    onClick={() => setPasoFormulario(1)}
                  >
                    <i className="material-icons left" style={{ fontSize: "16px" }}>
                      arrow_back
                    </i>
                    Atrás
                  </button>
                )}

                {pasoFormulario === 1 ? (
                  <button
                    type="button"
                    className="btn-small blue darken-3"
                    disabled={!datosObligatoriosCompletos}
                    onClick={avanzarPasoOpcionales}
                  >
                    Siguiente
                    <i className="material-icons right">arrow_forward</i>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-small green darken-2"
                    disabled={guardando}
                    onClick={guardarCliente}
                  >
                   {guardando
                      ? "Guardando..."
                      : modoFormulario === "crear"
                        ? "Guardar"
                        : "Actualizar"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "4px",
            minWidth: 0
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
                Listado de Clientes
              </div>
              <div style={{ fontSize: "12px", color: "#777" }}>
                Exportadores registrados en el sistema
              </div>
            </div>

            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <button className="btn-small green darken-2">
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

              <button className="btn-small grey darken-2">
                <i className="material-icons left" style={{ fontSize: "17px" }}>
                  print
                </i>
                Imprimir
              </button>
            </div>
          </div>

          <div
            style={{
              padding: "8px 12px",
              borderBottom: "1px solid #e0e0e0",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px"
            }}
          >
            <ResumenCard titulo="Activos" valor={clientesActivos} />
            <ResumenCard titulo="Inactivos" valor={clientesInactivos} />
            <ResumenCard titulo="Total" valor={clientes.length} />
          </div>

          <div
            style={{
              padding: "8px 12px",
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              flexWrap: "wrap"
            }}
          >
            <input
              type="text"
              value={buscar}
              onChange={(e) => {
                setBuscar(e.target.value);
                setPaginaActual(1);
              }}
              placeholder="Buscar cliente..."
              style={{
                margin: 0,
                height: "32px",
                maxWidth: "300px",
                fontSize: "13px"
              }}
            />

            <span style={{ fontSize: "12px", color: "#777" }}>
              Registros: {data.length}
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              className="highlight"
              style={{
                margin: 0,
                fontSize: "13px",
                minWidth: "850px"
              }}
            >
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th style={{ padding: "8px 10px", width: "90px" }}>Código</th>
                  <th style={{ padding: "8px 10px" }}>Razón social</th>
                  <th style={{ padding: "8px 10px", width: "130px" }}>RUC</th>
                  <th style={{ padding: "8px 10px", width: "110px" }}>Teléfono</th>
                  <th style={{ padding: "8px 10px", width: "100px" }}>Estado</th>
                  <th style={{ padding: "8px 10px", width: "125px", textAlign: "center" }}>
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.length > 0 ? (
                  dataPaginada.map((item) => (
                    <tr
                      key={item.id}
                      style={{
                        background: item.estado === 0 ? "#fafafa" : "#fff"
                      }}
                    >
                      <td style={{ padding: "7px 10px", fontWeight: 700 }}>
                        {item.codigo}
                      </td>

                      <td
                        style={{
                          padding: "7px 10px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                        title={item.razon_social}
                      >
                        {item.razon_social}
                      </td>

                      <td style={{ padding: "7px 10px" }}>{item.ruc}</td>

                      <td style={{ padding: "7px 10px" }}>
                        {item.telefono_principal || "-"}
                      </td>

                      <td style={{ padding: "7px 10px" }}>
                        <EstadoTag estado={item.estado} />
                      </td>

                      <td style={{ padding: "7px 10px", textAlign: "center" }}>
                        <button
                           type="button"
                            className="btn-small teal darken-2"
                            style={btnAccion}
                            title="Ver detalle"
                            onClick={() => abrirDetalleCliente(item)}
                        >
                          <i className="material-icons" style={{ fontSize: "15px" }}>
                             folder_open
                          </i>
                        </button>

                        <button
                          type="button"
                          className="btn-small blue darken-3"
                          style={btnAccion}
                          title="Editar"
                          onClick={() => editarCliente(item)}
                        >
                          <i className="material-icons" style={{ fontSize: "15px" }}>
                            edit
                          </i>
                        </button>

                        <button
                          type="button"
                          className={
                            item.estado === 1
                              ? "btn-small red darken-2"
                              : "btn-small green darken-2"
                          }
                          style={btnAccion}
                          title={item.estado === 1 ? "Desactivar" : "Activar"}
                          onClick={() => abrirConfirmEstado(item)}
                        >
                          <i className="material-icons" style={{ fontSize: "15px" }}>
                            {item.estado === 1 ? "toggle_off" : "toggle_on"}
                          </i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#777"
                      }}
                    >
                      No se encontraron clientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div
            style={{
              padding: "9px 12px",
              borderTop: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
              fontSize: "12px",
              color: "#666"
            }}
          >
            <div>
              Mostrando{" "}
              <strong>{data.length === 0 ? 0 : indiceInicial + 1}</strong>
              {" - "}
              <strong>{Math.min(indiceFinal, data.length)}</strong>
              {" de "}
              <strong>{data.length}</strong> registros
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button
                type="button"
                className="btn-small grey lighten-4 black-text"
                style={btnPaginacion}
                disabled={paginaActual === 1}
                onClick={() => cambiarPagina(paginaActual - 1)}
              >
                <i className="material-icons" style={{ fontSize: "17px" }}>
                  chevron_left
                </i>
              </button>

              {Array.from({ length: totalPaginas }, (_, index) => index + 1).map(
                (pagina) => (
                  <button
                    key={pagina}
                    type="button"
                    onClick={() => cambiarPagina(pagina)}
                    style={{
                      height: "28px",
                      minWidth: "30px",
                      padding: "0 9px",
                      border: "1px solid #ddd",
                      background: paginaActual === pagina ? "#1565c0" : "#fff",
                      color: paginaActual === pagina ? "#fff" : "#424242",
                      borderRadius: "3px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    {pagina}
                  </button>
                )
              )}

              <button
                type="button"
                className="btn-small grey lighten-4 black-text"
                style={btnPaginacion}
                disabled={paginaActual === totalPaginas || totalPaginas === 0}
                onClick={() => cambiarPagina(paginaActual + 1)}
              >
                <i className="material-icons" style={{ fontSize: "17px" }}>
                  chevron_right
                </i>
              </button>
            </div>
          </div>
        </div>
      </div>
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
              maxWidth: "410px",
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
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <i
                  className="material-icons"
                  style={{
                    color: clienteSeleccionado?.estado === 1 ? "#c62828" : "#2e7d32",
                    fontSize: "32px"
                  }}
                >
                  {clienteSeleccionado?.estado === 1 ? "block" : "check_circle"}
                </i>

                <div style={{ fontSize: "14px", color: "#424242" }}>
                  <div>
                    ¿Está seguro que desea{" "}
                    <strong>
                      {clienteSeleccionado?.estado === 1 ? "desactivar" : "activar"}
                    </strong>{" "}
                    este cliente?
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
                    {clienteSeleccionado?.codigo} -{" "}
                    {clienteSeleccionado?.razon_social}
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
                onClick={cerrarConfirmEstado}
              >
                Cancelar
              </button>

              <button
                type="button"
                className={
                  clienteSeleccionado?.estado === 1
                    ? "btn-small red darken-2"
                    : "btn-small green darken-2"
                }
                onClick={ejecutarCambioEstado}
              >
                {clienteSeleccionado?.estado === 1 ? "Desactivar" : "Activar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {detalleOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 10002,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "24px 12px",
            overflowY: "auto"
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "100%",
              maxWidth: "720px",
              maxHeight: "calc(100vh - 48px)",
              borderRadius: "5px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                borderBottom: "1px solid #e0e0e0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="material-icons blue-text text-darken-3">
                  business
                </i>

                <div>
                  <div style={{ fontSize: "16px", fontWeight: 700 }}>
                    Detalle del Cliente / Exportador
                  </div>
                  <div style={{ fontSize: "12px", color: "#777" }}>
                    {clienteDetalle?.codigo} - {clienteDetalle?.razon_social}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={cerrarDetalleCliente}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer"
                }}
              >
                <i className="material-icons">close</i>
              </button>
            </div>

            <div
              style={{
                padding: "14px",
                overflowY: "auto",
                flex: 1
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "8px",
                  marginBottom: "12px"
                }}
              >
                <DetalleItem label="Código" value={clienteDetalle?.codigo} />
                <DetalleItem label="RUC" value={clienteDetalle?.ruc} />
                <DetalleItem
                  label="Estado"
                  value={Number(clienteDetalle?.estado) === 1 ? "Activo" : "Inactivo"}
                />
              </div>

              <div
                style={{
                  border: "1px solid #eee",
                  borderRadius: "4px",
                  overflow: "hidden",
                  marginBottom: "12px"
                }}
              >
                <div
                  style={{
                    padding: "8px 10px",
                    background: "#f7f7f7",
                    fontWeight: 700,
                    fontSize: "13px"
                  }}
                >
                  Información principal
                </div>

                <div
                  style={{
                    padding: "10px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px"
                  }}
                >
                  <DetalleItem label="Razón social" value={clienteDetalle?.razon_social} />
                  <DetalleItem label="Dirección fiscal" value={mostrarDato(clienteDetalle?.direccion_fiscal)} />
                  <DetalleItem label="Representante legal" value={mostrarDato(clienteDetalle?.representante_legal)} />
                  <DetalleItem label="Teléfono principal" value={mostrarDato(clienteDetalle?.telefono_principal)} />
                  <DetalleItem label="Correo principal" value={mostrarDato(clienteDetalle?.correo_principal)} />
                </div>
              </div>

              <div
                style={{
                  border: "1px solid #eee",
                  borderRadius: "4px",
                  overflow: "hidden",
                  marginBottom: "12px"
                }}
              >
                <div
                  style={{
                    padding: "8px 10px",
                    background: "#f7f7f7",
                    fontWeight: 700,
                    fontSize: "13px"
                  }}
                >
                  Contacto en planta
                </div>

                <div
                  style={{
                    padding: "10px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px"
                  }}
                >
                  <DetalleItem label="Persona contacto planta" value={mostrarDato(clienteDetalle?.persona_contacto_planta)} />
                  <DetalleItem label="Teléfono contacto" value={mostrarDato(clienteDetalle?.telefono_contacto)} />
                  <DetalleItem label="Correo contacto" value={mostrarDato(clienteDetalle?.correo_contacto)} />
                </div>
              </div>

              <div
                style={{
                  border: "1px solid #eee",
                  borderRadius: "4px",
                  overflow: "hidden"
                }}
              >
                <div
                  style={{
                    padding: "8px 10px",
                    background: "#f7f7f7",
                    fontWeight: 700,
                    fontSize: "13px"
                  }}
                >
                  Auditoría
                </div>

                <div
                  style={{
                    padding: "10px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px"
                  }}
                >
                  <DetalleItem label="Fecha creación" value={formatearFechaHora(clienteDetalle?.fecha_creacion)} />
                  <DetalleItem label="Fecha actualización" value={formatearFechaHora(clienteDetalle?.fecha_actualizacion)} />
                  <DetalleItem label="UUID" value={clienteDetalle?.uuid} />
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "10px 14px",
                borderTop: "1px solid #e0e0e0",
                display: "flex",
                justifyContent: "flex-end",
                flexShrink: 0
              }}
            >
              <button
                type="button"
                className="btn-small grey darken-1"
                onClick={cerrarDetalleCliente}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      <style>
        {`
          @media (max-width: 992px) {
            div[style*="grid-template-columns: 420px 1fr"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}

const btnAccion = {
  height: "25px",
  lineHeight: "25px",
  padding: "0 7px",
  marginRight: "4px"
};

const btnPaginacion = {
  height: "28px",
  lineHeight: "28px",
  padding: "0 8px",
  boxShadow: "none",
  border: "1px solid #ddd"
};

function ResumenCard({ titulo, valor }) {
  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: "4px",
        padding: "7px 9px",
        background: "#fafafa"
      }}
    >
      <div style={{ fontSize: "11px", color: "#777" }}>{titulo}</div>
      <div style={{ fontSize: "17px", fontWeight: 700 }}>{valor}</div>
    </div>
  );
}

function EstadoTag({ estado }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        fontSize: "11px",
        padding: "3px 9px",
        borderRadius: "12px",
        background: estado === 1 ? "#eef7ee" : "#f5f5f5",
        color: estado === 1 ? "#2e7d32" : "#616161",
        fontWeight: 700,
        border: estado === 1 ? "1px solid #b7dfb9" : "1px solid #ddd"
      }}
    >
      <span
        style={{
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          background: estado === 1 ? "#2e7d32" : "#9e9e9e"
        }}
      />
      {estado === 1 ? "Activo" : "Inactivo"}
    </span>
  );
}

function DetalleItem({ label, value }) {
  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: "4px",
        padding: "7px 9px",
        background: "#fff",
        minWidth: 0
      }}
    >
      <div
        style={{
          fontSize: "11px",
          color: "#777",
          marginBottom: "3px"
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#333",
          wordBreak: "break-word"
        }}
      >
        {value || "-"}
      </div>
    </div>
  );
}

export default ClientesPage;