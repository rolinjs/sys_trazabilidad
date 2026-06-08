function CalibradoPage() {
  return (
    <div className="container" style={{ marginTop: "20px" }}>
      <h5>Calibrado</h5>

      <div className="row">
        <div className="col s12 m4">
          <div className="card-panel center">
            <i className="material-icons blue-text">input</i>
            <h6>Abastecimiento</h6>
            <p>Ingreso del lote al proceso de calibrado.</p>
          </div>
        </div>

        <div className="col s12 m4">
          <div className="card-panel center">
            <i className="material-icons blue-text">grid_view</i>
            <h6>Entarimado</h6>
            <p>Registro de jabas, calibres y tarimas.</p>
          </div>
        </div>

        <div className="col s12 m4">
          <div className="card-panel center">
            <i className="material-icons blue-text">delete_sweep</i>
            <h6>Descarte</h6>
            <p>Control de descarte y reproceso.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalibradoPage;