import { useEffect, useState } from "react";

import {
  listarAgricultoresService,
  crearAgricultorService,
  actualizarAgricultorService,
  cambiarEstadoAgricultorService
} from '../../services/agricultores.service';

function AgricultoresPage() {
  const [buscar, setBuscar] = useState("");
  const [pasoFormulario, setPasoFormulario] = useState(1);
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 5;

  const [modoFormulario, setModoFormulario] = useState("crear");
  const [agricultorEditando, setAgricultorEditando] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [agricultorSeleccionado, setAgricultorSeleccionado] = useState(null);

  const [detalleOpen, setDetalleOpen] = useState(false);
  const [agricultorDetalle, setAgricultorDetalle] = useState(null);

  const [mensajeFormulario, setMensajeFormulario] = useState({
    tipo: "",
    texto: ""
  });

  const [form, setForm] = useState({
    clp_senasa: "",
    nombres: "",
    apellidos: "",
    dni_ruc: "",
    zona_produccion: "",
    sector: "",
    sub_sector: "",
    distrito: "",
    provincia: "",
    departamento: "",
    hectareas: "",
    cantidad_plantas: "",
    telefono: ""
  });

  const [agricultores, setAgricultores] = useState([]);

  const [loading, setLoading] = useState(false);
  const [buscando, setBuscando] = useState(false);

  const [totalRegistros, setTotalRegistros] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [primeraCarga, setPrimeraCarga] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const listarAgricultores = async () => {
    try {
      if (primeraCarga) {
        setLoading(true);
      } else {
        setBuscando(true);
      }

      const response = await listarAgricultoresService({
        page: paginaActual,
        limit: registrosPorPagina,
        buscar
      });

      if (!response.success) {
        setAgricultores([]);
        setTotalRegistros(0);
        setTotalPaginas(1);
        return;
      }

      setAgricultores(response.data || []);
      setTotalRegistros(response.total || 0);
      setTotalPaginas(response.totalPages || 1);
    } catch (error) {
      console.log("Error al listar agricultores:", error);
    } finally {
      setLoading(false);
      setBuscando(false);
      setPrimeraCarga(false);
    }
  };

  useEffect(() => {
    listarAgricultores();
  }, [paginaActual, buscar]);


  const agricultoresActivos = agricultores.filter((item) => item.estado === 1).length;
  const agricultoresInactivos = agricultores.filter((item) => item.estado === 0).length;

  const indiceInicial = (paginaActual - 1) * registrosPorPagina;
  const indiceFinal = indiceInicial + agricultores.length;

  const datosObligatoriosCompletos =
    form.clp_senasa.trim().length === 10 &&
    form.nombres.trim() &&
    form.apellidos.trim() &&
    form.dni_ruc.trim();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

    if (mensajeFormulario.texto) {
      setMensajeFormulario({ tipo: "", texto: "" });
    }
  };

  const limpiarFormulario = () => {
    setForm({
      clp_senasa: "",
      nombres: "",
      apellidos: "",
      dni_ruc: "",
      zona_produccion: "",
      sector: "",
      sub_sector: "",
      distrito: "",
      provincia: "",
      departamento: "",
      hectareas: "",
      cantidad_plantas: "",
      telefono: ""
    });

    setPasoFormulario(1);
    setModoFormulario("crear");
    setAgricultorEditando(null);
    setMensajeFormulario({ tipo: "", texto: "" });
  };

  const avanzarPasoOpcionales = () => {
    setMensajeFormulario({ tipo: "", texto: "" });

    if (!form.clp_senasa.trim()) {
      setMensajeFormulario({ tipo: "error", texto: "Ingrese el CLP SENASA." });
      return;
    }

    if (form.clp_senasa.trim().length !== 10) {
      setMensajeFormulario({
        tipo: "error",
        texto: "El CLP SENASA debe tener 10 dígitos."
      });
      return;
    }

    if (!form.nombres.trim()) {
      setMensajeFormulario({ tipo: "error", texto: "Ingrese los nombres." });
      return;
    }

    if (!form.apellidos.trim()) {
      setMensajeFormulario({ tipo: "error", texto: "Ingrese los apellidos." });
      return;
    }

    if (!form.dni_ruc.trim()) {
      setMensajeFormulario({ tipo: "error", texto: "Ingrese el DNI/RUC." });
      return;
    }

    setPasoFormulario(2);
  };

  const guardarAgricultor = async () => {
    try {
      setGuardando(true);

      setMensajeFormulario({
        tipo: "",
        texto: ""
      });

      if (!form.clp_senasa.trim()) {
        setPasoFormulario(1);
        setMensajeFormulario({
          tipo: "error",
          texto: "El CLP SENASA es obligatorio."
        });
        return;
      }

      if (form.clp_senasa.trim().length !== 10) {
        setPasoFormulario(1);
        setMensajeFormulario({
          tipo: "error",
          texto: "El CLP SENASA debe tener 10 dígitos."
        });
        return;
      }

      if (!form.nombres.trim()) {
        setPasoFormulario(1);
        setMensajeFormulario({
          tipo: "error",
          texto: "Los nombres son obligatorios."
        });
        return;
      }

      if (!form.apellidos.trim()) {
        setPasoFormulario(1);
        setMensajeFormulario({
          tipo: "error",
          texto: "Los apellidos son obligatorios."
        });
        return;
      }

      if (!form.dni_ruc.trim()) {
        setPasoFormulario(1);
        setMensajeFormulario({
          tipo: "error",
          texto: "El DNI/RUC es obligatorio."
        });
        return;
      }

      const body = {
        clp_senasa: form.clp_senasa.trim(),
        nombres: form.nombres.trim().toUpperCase(),
        apellidos: form.apellidos.trim().toUpperCase(),
        dni_ruc: form.dni_ruc.trim(),
        zona_produccion: form.zona_produccion.trim() || null,
        sector: form.sector.trim() || null,
        sub_sector: form.sub_sector.trim() || null,
        distrito: form.distrito.trim() || null,
        provincia: form.provincia.trim() || null,
        departamento: form.departamento.trim() || null,
        hectareas: form.hectareas ? Number(form.hectareas) : 0,
        cantidad_plantas: form.cantidad_plantas
          ? Number(form.cantidad_plantas)
          : 0,
        telefono: form.telefono.trim() || null
      };

      let response;

      if (modoFormulario === "crear") {
        response = await crearAgricultorService(body);
      } else {
        response = await actualizarAgricultorService(
          agricultorEditando.uuid,
          {
            clp_senasa: body.clp_senasa,
            nombres: body.nombres,
            apellidos: body.apellidos,
            dni_ruc: body.dni_ruc,
            zona_produccion: body.zona_produccion,
            sector: body.sector,
            sub_sector: body.sub_sector,
            distrito: body.distrito,
            provincia: body.provincia,
            departamento: body.departamento,
            hectareas: body.hectareas,
            cantidad_plantas: body.cantidad_plantas,
            telefono: body.telefono
          }
        );
      }

      if (!response.success) {
        setMensajeFormulario({
          tipo: "success",
          texto:
            response.message ||
            (modoFormulario === "crear"
              ? "Agricultor registrado correctamente."
              : "Agricultor actualizado correctamente.")
        });
        return;
      }

      setMensajeFormulario({
        tipo: "success",
        texto: response.message || "Agricultor registrado correctamente."
      });

      setPaginaActual(1);
      await listarAgricultores();

      setTimeout(() => {
        limpiarFormulario();
      }, 700);
    } catch (error) {
      console.log("Error al guardar agricultor:", error);

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

  const editarAgricultor = (item) => {
    setModoFormulario("editar");
    setAgricultorEditando(item);
    setPasoFormulario(1);

    setForm({
      clp_senasa: item.clp_senasa || "",
      nombres: item.nombres || "",
      apellidos: item.apellidos || "",
      dni_ruc: item.dni_ruc || "",
      zona_produccion: item.zona_produccion || "",
      sector: item.sector || "",
      sub_sector: item.sub_sector || "",
      distrito: item.distrito || "",
      provincia: item.provincia || "",
      departamento: item.departamento || "",
      hectareas: item.hectareas || "",
      cantidad_plantas: item.cantidad_plantas || "",
      telefono: item.telefono || ""
    });

    setMensajeFormulario({ tipo: "", texto: "" });
  };

  const abrirConfirmEstado = (item) => {
    setAgricultorSeleccionado(item);
    setConfirmOpen(true);
  };

  const cerrarConfirmEstado = () => {
    setAgricultorSeleccionado(null);
    setConfirmOpen(false);
  };

  const ejecutarCambioEstado = async () => {
    try {
      if (!agricultorSeleccionado) return;

      const response = await cambiarEstadoAgricultorService(
        agricultorSeleccionado.uuid
      );

      if (!response.success) {
        setMensajeFormulario({
          tipo: "error",
          texto: response.message || "No se pudo cambiar el estado."
        });
        return;
      }

      await listarAgricultores();

      cerrarConfirmEstado();
    } catch (error) {
      console.log("Error al cambiar estado del agricultor:", error);

      setMensajeFormulario({
        tipo: "error",
        texto:
          error.response?.data?.message ||
          "No se pudo cambiar el estado del agricultor."
      });
    }
  };

  const abrirDetalleAgricultor = (item) => {
    setAgricultorDetalle(item);
    setDetalleOpen(true);
  };

  const cerrarDetalleAgricultor = () => {
    setAgricultorDetalle(null);
    setDetalleOpen(false);
  };

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    setPaginaActual(nuevaPagina);
  };

  const mostrarDato = (valor) => {
    return valor !== null && valor !== undefined && valor !== "" ? valor : "-";
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

  if (loading && primeraCarga) {
    return (
      <div style={{ padding: "20px" }}>
        <div className="progress">
          <div className="indeterminate"></div>
        </div>
        <p>Cargando agricultores...</p>
      </div>
    );
  }

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
        <div style={panelStyle}>
          <HeaderFormulario
            titulo={
              modoFormulario === "crear"
                ? "Agricultores"
                : "Editar Agricultor"
            }
            subtitulo="Registro y mantenimiento de agricultores"
          />

          <div style={{ padding: "10px 12px", borderBottom: "1px solid #e0e0e0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              <PasoButton
                activo={pasoFormulario === 1}
                texto="1. Obligatorios"
                onClick={() => setPasoFormulario(1)}
              />

              <PasoButton
                activo={pasoFormulario === 2}
                texto="2. Opcionales"
                disabled={!datosObligatoriosCompletos}
                onClick={avanzarPasoOpcionales}
              />
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div style={{ padding: "12px" }}>
              {mensajeFormulario.texto && (
                <Mensaje tipo={mensajeFormulario.tipo} texto={mensajeFormulario.texto} />
              )}

              {pasoFormulario === 1 && (
                <>
                  <Campo
                    label="CLP SENASA *"
                    name="clp_senasa"
                    value={form.clp_senasa}
                    onChange={handleChange}
                    placeholder="Ej. 1234567890"
                    maxLength="10"
                  />

                  <Campo
                    label="Nombres *"
                    name="nombres"
                    value={form.nombres}
                    onChange={handleChange}
                    placeholder="Nombres del agricultor"
                    maxLength="100"
                  />

                  <Campo
                    label="Apellidos *"
                    name="apellidos"
                    value={form.apellidos}
                    onChange={handleChange}
                    placeholder="Apellidos del agricultor"
                    maxLength="100"
                  />

                  <Campo
                    label="DNI/RUC *"
                    name="dni_ruc"
                    value={form.dni_ruc}
                    onChange={handleChange}
                    placeholder="DNI o RUC"
                    maxLength="11"
                  />

                  <div style={notaStyle}>
                    CLP SENASA, nombres, apellidos y DNI/RUC son obligatorios.
                  </div>
                </>
              )}

              {pasoFormulario === 2 && (
                <>
                  <Campo
                    label="Zona de producción"
                    name="zona_produccion"
                    value={form.zona_produccion}
                    onChange={handleChange}
                    placeholder="Ej. Tambogrande"
                  />

                  <Campo
                    label="Sector"
                    name="sector"
                    value={form.sector}
                    onChange={handleChange}
                    placeholder="Sector"
                  />

                  <Campo
                    label="Sub sector"
                    name="sub_sector"
                    value={form.sub_sector}
                    onChange={handleChange}
                    placeholder="Sub sector"
                  />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <Campo
                      label="Distrito"
                      name="distrito"
                      value={form.distrito}
                      onChange={handleChange}
                      placeholder="Distrito"
                    />

                    <Campo
                      label="Provincia"
                      name="provincia"
                      value={form.provincia}
                      onChange={handleChange}
                      placeholder="Provincia"
                    />
                  </div>

                  <Campo
                    label="Departamento"
                    name="departamento"
                    value={form.departamento}
                    onChange={handleChange}
                    placeholder="Departamento"
                  />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <Campo
                      type="number"
                      label="Hectáreas"
                      name="hectareas"
                      value={form.hectareas}
                      onChange={handleChange}
                      placeholder="0"
                    />

                    <Campo
                      type="number"
                      label="Cantidad plantas"
                      name="cantidad_plantas"
                      value={form.cantidad_plantas}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>

                  <Campo
                    label="Teléfono"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="Teléfono"
                  />
                </>
              )}
            </div>

            <div style={footerFormStyle}>
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
                    onClick={guardarAgricultor}
                    disabled={guardando}
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

        <div style={{ ...panelStyle, minWidth: 0 }}>
          <div style={headerTablaStyle}>
            <div>
              <div style={{ fontSize: "18px", fontWeight: 600 }}>
                Listado de Agricultores
              </div>
              <div style={{ fontSize: "12px", color: "#777" }}>
                Agricultores registrados en el sistema
              </div>
            </div>
          </div>

          <div style={cardsStyle}>
            <ResumenCard titulo="Activos" valor={agricultoresActivos} />
            <ResumenCard titulo="Inactivos" valor={agricultoresInactivos} />
            <ResumenCard titulo="Total" valor={agricultores.length} />
          </div>

          <div style={buscadorStyle}>
            <input
              type="text"
              value={buscar}
              onChange={(e) => {
                setBuscar(e.target.value);
                setPaginaActual(1);
              }}
              placeholder="Buscar por CLP, agricultor, DNI/RUC o zona..."
              style={{
                margin: 0,
                height: "32px",
                maxWidth: "360px",
                fontSize: "13px"
              }}
            />

            {buscando && (
              <span style={{ fontSize: "12px", color: "#777" }}>
                Buscando...
              </span>
            )}

            <span style={{ fontSize: "12px", color: "#777" }}>
              Registros: {totalRegistros}
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              className="highlight"
              style={{
                margin: 0,
                fontSize: "13px",
                minWidth: "900px"
              }}
            >
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th style={thStyle}>CLP SENASA</th>
                  <th style={thStyle}>Agricultor</th>
                  <th style={thStyle}>DNI/RUC</th>
                  <th style={thStyle}>Zona</th>
                  <th style={thStyle}>Estado</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {agricultores.length > 0 ? (
                  agricultores.map((item) => (
                    <tr key={item.id} style={{ background: item.estado === 0 ? "#fafafa" : "#fff" }}>
                      <td  
                        className="blue-text text-darken-3" 
                        style={{ padding: "7px 10px", fontWeight: 500 }}
                      >
                        {item.clp_senasa}
                      </td>

                      <td style={tdEllipsis} title={`${item.nombres} ${item.apellidos}`}>
                        {item.nombres} {item.apellidos}
                      </td>

                      <td style={{ padding: "7px 10px" }}>{item.dni_ruc}</td>

                      <td style={{ padding: "7px 10px" }}>
                        {item.zona_produccion || "-"}
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
                          onClick={() => abrirDetalleAgricultor(item)}
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
                          onClick={() => editarAgricultor(item)}
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
                    <td colSpan="6" style={{ padding: "12px", textAlign: "center", color: "#777" }}>
                      No se encontraron agricultores.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Paginacion
            dataLength={totalRegistros}
            indiceInicial={indiceInicial}
            indiceFinal={indiceFinal}
            totalPaginas={totalPaginas}
            paginaActual={paginaActual}
            cambiarPagina={cambiarPagina}
          />
        </div>
      </div>

      {confirmOpen && (
        <ModalConfirmacion
          item={agricultorSeleccionado}
          cerrar={cerrarConfirmEstado}
          confirmar={ejecutarCambioEstado}
        />
      )}

      {detalleOpen && (
        <ModalDetalle
          item={agricultorDetalle}
          cerrar={cerrarDetalleAgricultor}
          mostrarDato={mostrarDato}
          formatearFechaHora={formatearFechaHora}
        />
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

const panelStyle = {
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: "4px"
};

const notaStyle = {
  marginTop: "12px",
  padding: "8px 10px",
  background: "#f5f5f5",
  color: "#555",
  borderRadius: "4px",
  fontSize: "12px"
};

const footerFormStyle = {
  padding: "10px 12px",
  borderTop: "1px solid #e0e0e0",
  display: "flex",
  justifyContent: "space-between",
  gap: "8px"
};

const headerTablaStyle = {
  padding: "10px 12px",
  borderBottom: "1px solid #e0e0e0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap"
};

const cardsStyle = {
  padding: "8px 12px",
  borderBottom: "1px solid #e0e0e0",
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "8px"
};

const buscadorStyle = {
  padding: "8px 12px",
  borderBottom: "1px solid #e0e0e0",
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  flexWrap: "wrap"
};

const thStyle = {
  padding: "8px 10px"
};

const tdEllipsis = {
  padding: "7px 10px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
};

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

function HeaderFormulario({ titulo, subtitulo }) {
  return (
    <div
      style={{
        padding: "10px 12px",
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}
    >
      <i className="material-icons blue-text text-darken-3">agriculture</i>

      <div>
        <div style={{ fontSize: "18px", fontWeight: 600 }}>{titulo}</div>
        <div style={{ fontSize: "12px", color: "#777" }}>{subtitulo}</div>
      </div>
    </div>
  );
}

function PasoButton({ activo, texto, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        border: "1px solid #ddd",
        background: activo ? "#e3f2fd" : "#fff",
        color: activo ? "#0d47a1" : "#666",
        padding: "7px",
        borderRadius: "4px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.65 : 1,
        fontSize: "12px",
        fontWeight: 600
      }}
    >
      {texto}
    </button>
  );
}

function Campo({
  label,
  name,
  value,
  onChange,
  placeholder,
  maxLength,
  type = "text",
  readOnly = false
}) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        readOnly={readOnly}
        style={{
          margin: 0,
          height: "32px",
          fontSize: "13px",
          background: readOnly ? "#f5f5f5" : "#fff",
          color: readOnly ? "#777" : "#333"
        }}
      />
    </div>
  );
}

function Mensaje({ tipo, texto }) {
  return (
    <div
      style={{
        marginBottom: "10px",
        padding: "8px 10px",
        fontSize: "13px",
        borderRadius: "4px",
        background: tipo === "success" ? "#e8f5e9" : "#ffebee",
        color: tipo === "success" ? "#2e7d32" : "#c62828",
        border:
          tipo === "success"
            ? "1px solid #a5d6a7"
            : "1px solid #ef9a9a"
      }}
    >
      {texto}
    </div>
  );
}

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

function Paginacion({
  dataLength,
  indiceInicial,
  indiceFinal,
  totalPaginas,
  paginaActual,
  cambiarPagina
}) {
  return (
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
        Mostrando <strong>{dataLength === 0 ? 0 : indiceInicial + 1}</strong>
        {" - "}
        <strong>{Math.min(indiceFinal, dataLength)}</strong>
        {" de "}
        <strong>{dataLength}</strong> registros
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
  );
}

function ModalConfirmacion({ item, cerrar, confirmar }) {
  return (
    <div style={modalOverlay}>
      <div style={modalBoxSmall}>
        <div style={modalHeader}>Confirmar acción</div>

        <div style={{ padding: "16px 14px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <i
              className="material-icons"
              style={{
                color: item?.estado === 1 ? "#c62828" : "#2e7d32",
                fontSize: "32px"
              }}
            >
              {item?.estado === 1 ? "block" : "check_circle"}
            </i>

            <div style={{ fontSize: "14px", color: "#424242" }}>
              ¿Está seguro que desea{" "}
              <strong>{item?.estado === 1 ? "desactivar" : "activar"}</strong>{" "}
              este agricultor?

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
                {item?.clp_senasa} - {item?.nombres} {item?.apellidos}
              </div>
            </div>
          </div>
        </div>

        <div style={modalFooter}>
          <button
            type="button"
            className="btn-small grey lighten-1 black-text"
            onClick={cerrar}
          >
            Cancelar
          </button>

          <button
            type="button"
            className={
              item?.estado === 1
                ? "btn-small red darken-2"
                : "btn-small green darken-2"
            }
            onClick={confirmar}
          >
            {item?.estado === 1 ? "Desactivar" : "Activar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalDetalle({ item, cerrar, mostrarDato, formatearFechaHora }) {
  return (
    <div style={modalOverlayTop}>
      <div style={modalBoxLarge}>
        <div style={modalTitleDetail}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <i className="material-icons blue-text text-darken-3">agriculture</i>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 700 }}>
                Detalle del Agricultor
              </div>
              <div style={{ fontSize: "12px", color: "#777" }}>
                {item?.clp_senasa} - {item?.nombres} {item?.apellidos}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={cerrar}
            style={{ border: "none", background: "transparent", cursor: "pointer" }}
          >
            <i className="material-icons">close</i>
          </button>
        </div>

        <div style={{ padding: "14px", overflowY: "auto", flex: 1 }}>
          <DetalleGrupo titulo="Información principal">
            <DetalleItem label="CLP SENASA" value={item?.clp_senasa} />
            <DetalleItem label="Nombres" value={item?.nombres} />
            <DetalleItem label="Apellidos" value={item?.apellidos} />
            <DetalleItem label="DNI/RUC" value={item?.dni_ruc} />
            <DetalleItem label="Estado" value={item?.estado === 1 ? "Activo" : "Inactivo"} />
          </DetalleGrupo>

          <DetalleGrupo titulo="Ubicación">
            <DetalleItem label="Zona producción" value={mostrarDato(item?.zona_produccion)} />
            <DetalleItem label="Sector" value={mostrarDato(item?.sector)} />
            <DetalleItem label="Sub sector" value={mostrarDato(item?.sub_sector)} />
            <DetalleItem label="Distrito" value={mostrarDato(item?.distrito)} />
            <DetalleItem label="Provincia" value={mostrarDato(item?.provincia)} />
            <DetalleItem label="Departamento" value={mostrarDato(item?.departamento)} />
          </DetalleGrupo>

          <DetalleGrupo titulo="Información adicional">
            <DetalleItem label="Hectáreas" value={mostrarDato(item?.hectareas)} />
            <DetalleItem label="Cantidad plantas" value={mostrarDato(item?.cantidad_plantas)} />
            <DetalleItem label="Teléfono" value={mostrarDato(item?.telefono)} />
          </DetalleGrupo>

          <DetalleGrupo titulo="Auditoría">
            <DetalleItem label="Fecha creación" value={formatearFechaHora(item?.fecha_creacion)} />
            <DetalleItem label="Fecha actualización" value={formatearFechaHora(item?.fecha_actualizacion)} />
            <DetalleItem label="UUID" value={item?.uuid} />
          </DetalleGrupo>
        </div>

        <div style={{ ...modalFooter, justifyContent: "flex-end" }}>
          <button
            type="button"
            className="btn-small grey darken-1"
            onClick={cerrar}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function DetalleGrupo({ titulo, children }) {
  return (
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
        {titulo}
      </div>

      <div
        style={{
          padding: "10px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px"
        }}
      >
        {children}
      </div>
    </div>
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
      <div style={{ fontSize: "11px", color: "#777", marginBottom: "3px" }}>
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

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  zIndex: 10001,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px"
};

const modalOverlayTop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  zIndex: 10002,
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  padding: "24px 12px",
  overflowY: "auto"
};

const modalBoxSmall = {
  background: "#fff",
  width: "100%",
  maxWidth: "410px",
  borderRadius: "4px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
  overflow: "hidden"
};

const modalBoxLarge = {
  background: "#fff",
  width: "100%",
  maxWidth: "760px",
  maxHeight: "calc(100vh - 48px)",
  borderRadius: "5px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column"
};

const modalHeader = {
  padding: "10px 14px",
  borderBottom: "1px solid #e0e0e0",
  fontSize: "16px",
  fontWeight: 600
};

const modalTitleDetail = {
  padding: "10px 14px",
  borderBottom: "1px solid #e0e0e0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexShrink: 0
};

const modalFooter = {
  padding: "10px 14px",
  borderTop: "1px solid #e0e0e0",
  display: "flex",
  justifyContent: "flex-end",
  gap: "8px"
};

export default AgricultoresPage;