import { useEffect, useState } from "react";
import { 
  listarTarasClienteService,
  crearTaraClienteService,
  cambiarEstadoTaraClienteService,
  actualizarTaraClienteService
 } from "../../services/tarasCliente.service";
import { listarClientesService } from "../../services/clientes.service";

function TarasClientePage() {
  const [buscar, setBuscar] = useState("");
  const [clienteFiltro, setClienteFiltro] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensajeFormulario, setMensajeFormulario] = useState({
    tipo: "",
    texto: ""
  });
  const [modoFormulario, setModoFormulario] = useState("crear");
  const [taraEditando, setTaraEditando] = useState(null);

  const [clientes, setClientes] = useState([]);
  const [taras, setTaras] = useState([]);
  const [loading, setLoading] = useState(true);

  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 5;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [taraSeleccionada, setTaraSeleccionada] = useState(null);
  const [form, setForm] = useState({
    cliente_uuid: "",
    descripcion: "",
    peso_tara: ""
  });

  const listarTarasCliente = async () => {
    const response = await listarTarasClienteService();
    const listado = Array.isArray(response) ? response : response.data || [];
    setTaras(listado);
  };

  const listarClientes = async () => {
    const response = await listarClientesService();
    const listado = Array.isArray(response) ? response : response.data || [];
    setClientes(listado);
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        await Promise.all([listarTarasCliente(), listarClientes()]);
      } catch (error) {
        console.log("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const data = taras.filter((item) => {
    const coincideBusqueda = `${item.cliente_codigo || ""} ${item.razon_social || ""} ${item.descripcion || ""}`
      .toLowerCase()
      .includes(buscar.toLowerCase());

    const coincideCliente = clienteFiltro
      ? String(item.cliente_id) === String(clienteFiltro)
      : true;

    return coincideBusqueda && coincideCliente;
  });

  const totalPaginas = Math.ceil(data.length / registrosPorPagina);
  const indiceInicial = (paginaActual - 1) * registrosPorPagina;
  const indiceFinal = indiceInicial + registrosPorPagina;
  const dataPaginada = data.slice(indiceInicial, indiceFinal);

  const totalActivas = taras.filter((item) => item.estado === 1).length;
  const totalInactivas = taras.filter((item) => item.estado === 0).length;

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
        cliente_uuid: "",
        descripcion: "",
        peso_tara: ""
      });

      setModoFormulario("crear");
      setTaraEditando(null);
      setMensajeFormulario({ tipo: "", texto: "" });
    };

    const guardarTara = async (e) => {
      e.preventDefault();

      try {
        setGuardando(true);
        setMensajeFormulario({
          tipo: "",
          texto: ""
        });

        if (!form.cliente_uuid) {
          setMensajeFormulario({
            tipo: "error",
            texto: "Seleccione un cliente."
          });
          return;
        }

        if (!form.descripcion.trim()) {
          setMensajeFormulario({
            tipo: "error",
            texto: "Ingrese la descripción de la tara."
          });
          return;
        }

        if (!form.peso_tara) {
          setMensajeFormulario({
            tipo: "error",
            texto: "Ingrese el peso de tara."
          });
          return;
        }

        if (Number(form.peso_tara) <= 0) {
          setMensajeFormulario({
            tipo: "error",
            texto: "El peso de tara debe ser mayor a cero."
          });
          return;
        }

        const body = {
          cliente_uuid: form.cliente_uuid,
          descripcion: form.descripcion.trim().toUpperCase(),
          peso_tara: Number(form.peso_tara)
        };

        let response;

        if (modoFormulario === "crear") {
          response = await crearTaraClienteService(body);
        } else {
          response = await actualizarTaraClienteService(taraEditando.uuid, {
            descripcion: body.descripcion,
            peso_tara: body.peso_tara
          });
        }

        if (!response.success) {
          setMensajeFormulario({
              tipo: "success",
              texto:
                response.message ||
                (modoFormulario === "crear"
                  ? "Tara registrada correctamente."
                  : "Tara actualizada correctamente.")
          });
          return;
        }

        setMensajeFormulario({
          tipo: "success",
          texto: response.message || "Tara registrada correctamente."
        });

        await listarTarasCliente();

        setPaginaActual(1);

        setTimeout(() => {
          limpiarFormulario();
          setFormOpen(false);
          setMensajeFormulario({
            tipo: "",
            texto: ""
          });
        }, 700);
      } catch (error) {
        console.log("Error al guardar tara:", error);

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

    const editarTara = (item) => {
      setModoFormulario("editar");
      setTaraEditando(item);
      setFormOpen(true);

      setForm({
        cliente_uuid: item.cliente_uuid || "",
        descripcion: item.descripcion || "",
        peso_tara: item.peso_tara || ""
      });

      setMensajeFormulario({ tipo: "", texto: "" });
    };

    const formatearPeso = (valor) => {
      if (valor === null || valor === undefined) return "-";
      return `${Number(valor).toFixed(3)} kg`;
    };

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

    if (loading) {
      return (
        <div style={{ padding: "20px" }}>
          <div className="progress">
            <div className="indeterminate" />
          </div>
          <p>Cargando taras cliente...</p>
        </div>
      );
    }

  const abrirConfirmEstado = (item) => {
    setTaraSeleccionada(item);
    setConfirmOpen(true);
  };

  const cerrarConfirmEstado = () => {
    setConfirmOpen(false);
    setTaraSeleccionada(null);
  };

  const ejecutarCambioEstado = async () => {
    try {
      if (!taraSeleccionada) return;

      const response = await cambiarEstadoTaraClienteService(taraSeleccionada.uuid);

      if (!response.success) return;

      await listarTarasCliente();

      cerrarConfirmEstado();
    } catch (error) {
      console.log("Error al cambiar estado de tara:", error);
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <i className="material-icons blue-text text-darken-3">scale</i>

            <div>
              <div style={{ fontSize: "18px", fontWeight: 600 }}>
                Taras Cliente
              </div>
              <div style={{ fontSize: "12px", color: "#777" }}>
                Registro de peso tara por cliente/exportador
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-small blue darken-3"
            onClick={() => setFormOpen(!formOpen)}
          >
            <i className="material-icons left" style={{ fontSize: "17px" }}>
              {formOpen ? "close" : "add"}
            </i>
            {formOpen ? "Cerrar" : "Nueva tara"}
          </button>
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
          <ResumenCard titulo="Activas" valor={totalActivas} />
          <ResumenCard titulo="Inactivas" valor={totalInactivas} />
          <ResumenCard titulo="Total" valor={taras.length} />
        </div>        

        {formOpen && (
          <form
            onSubmit={guardarTara}
            style={{
              padding: "10px 12px",
              borderBottom: "1px solid #e0e0e0",
              background: "#fafafa"
            }}
          >

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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1.5fr 0.8fr auto",
                gap: "10px",
                alignItems: "end"
              }}
            >
              <div>
                <label>Cliente / Exportador *</label>
                <select
                  name="cliente_uuid"
                  value={form.cliente_uuid}
                  onChange={handleChange}
                  disabled={modoFormulario === "editar"}
                  className="browser-default"
                  style={{
                    height: "34px",
                    fontSize: "13px",
                    border: "1px solid #ccc"
                  }}
                >
                  <option value="">Seleccione cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.uuid} value={cliente.uuid}>
                      {cliente.codigo} - {cliente.razon_social}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Descripción *</label>
                <input
                  type="text"
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  placeholder="Ej. Jaba plástica mango"
                  maxLength="100"
                  style={{ margin: 0, height: "32px", fontSize: "13px" }}
                />
              </div>

              <div>
                <label>Peso tara kg *</label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  name="peso_tara"
                  value={form.peso_tara}
                  onChange={handleChange}
                  placeholder="1.850"
                  style={{ margin: 0, height: "32px", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  className="btn-small grey lighten-1 black-text"
                  onClick={limpiarFormulario}
                >
                 {modoFormulario === "crear" ? "Limpiar" : "Cancelar"}
                </button>

                <button
                  type="submit"
                  className="btn-small green darken-2"
                  disabled={guardando}
                >
                  {guardando
                  ? "Guardando..."
                  : modoFormulario === "crear"
                    ? "Guardar"
                    : "Actualizar"}
                </button>
              </div>
            </div>
          </form>
        )}

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
            placeholder="Buscar tara..."
            style={{
              margin: 0,
              height: "32px",
              maxWidth: "260px",
              fontSize: "13px"
            }}
          />

          <select
            value={clienteFiltro}
            onChange={(e) => {
              setClienteFiltro(e.target.value);
              setPaginaActual(1);
            }}
            className="browser-default"
            style={{
              height: "32px",
              maxWidth: "300px",
              fontSize: "13px",
              border: "1px solid #ccc"
            }}
          >
            <option value="">Todos los clientes</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.codigo} - {cliente.razon_social}
              </option>
            ))}
          </select>

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
              minWidth: "900px"
            }}
          >
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th style={{ padding: "8px 10px", width: "80px" }}>Código</th>
                <th style={{ padding: "8px 10px" }}>Cliente</th>
                <th style={{ padding: "8px 10px" }}>Descripción</th>
                <th style={{ padding: "8px 10px", width: "110px" }}>
                  Peso tara
                </th>
                <th style={{ padding: "8px 10px", width: "140px" }}>
                  Creación
                </th>
                <th style={{ padding: "8px 10px", width: "140px" }}>
                  Actualización
                </th>
                <th style={{ padding: "8px 10px", width: "100px" }}>
                  Estado
                </th>
                <th
                  style={{
                    padding: "8px 10px",
                    width: "125px",
                    textAlign: "center"
                  }}
                >
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
                      {item.cliente_codigo}
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

                    <td style={{ padding: "7px 10px" }}>
                      {item.descripcion}
                    </td>

                    <td style={{ padding: "7px 10px", fontWeight: 700 }}>
                      {formatearPeso(item.peso_tara)}
                    </td>

                    <td style={{ padding: "7px 10px", color: "#616161" }}>
                      {formatearFecha(item.fecha_creacion)}
                    </td>

                    <td style={{ padding: "7px 10px", color: "#616161" }}>
                      {formatearFecha(item.fecha_actualizacion)}
                    </td>

                    <td style={{ padding: "7px 10px" }}>
                      <EstadoTag estado={item.estado} />
                    </td>

                    <td style={{ padding: "7px 10px", textAlign: "center" }}>

                      <button
                        type="button"
                        className="btn-small blue darken-3"
                        style={btnAccion}
                        title="Editar"
                        onClick={() => editarTara(item)}
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
                    colSpan="7"
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      color: "#777"
                    }}
                  >
                    No se encontraron taras registradas.
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
              color: taraSeleccionada?.estado === 1 ? "#c62828" : "#2e7d32",
              fontSize: "32px"
            }}
          >
            {taraSeleccionada?.estado === 1 ? "block" : "check_circle"}
          </i>

          <div style={{ fontSize: "14px", color: "#424242" }}>
            <div>
              ¿Está seguro que desea{" "}
              <strong>
                {taraSeleccionada?.estado === 1 ? "desactivar" : "activar"}
              </strong>{" "}
              esta tara?
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
              {taraSeleccionada?.cliente_codigo} - {taraSeleccionada?.razon_social}
              <br />
              {taraSeleccionada?.descripcion}
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
            taraSeleccionada?.estado === 1
              ? "btn-small red darken-2"
              : "btn-small green darken-2"
          }
          onClick={ejecutarCambioEstado}
        >
          {taraSeleccionada?.estado === 1 ? "Desactivar" : "Activar"}
        </button>
      </div>
    </div>
  </div>
)}

      <style>
        {`
          @media (max-width: 992px) {
            div[style*="grid-template-columns: 1.4fr 1.5fr 0.8fr auto"] {
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

export default TarasClientePage;