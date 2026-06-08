import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";

import GaritaPage from "../pages/garita/GaritaPage";
import RecepcionPage from "../pages/recepcion/RecepcionPage";
import CalibradoPage from "../pages/calibrado/CalibradoPage";
import HidrotermicoPage from "../pages/hidrotermico/HidrotermicoPage";
import EmpaquePage from "../pages/empaque/EmpaquePage";

import PlanDiario from "../pages/recepcion/guias/PlanDiario";
import RegistroGuias from "../pages/recepcion/guias/RegistroGuias";
import ConsultaGuias from "../pages/recepcion/guias/ConsultaGuias";

import CampaniasPage from "../pages/administracion/CampaniasPage";
import VariedadesPage from "../pages/administracion/VariedadesPage";
import ClientesPage from "../pages/administracion/ClientesPage";
import AgricultoresPage from "../pages/administracion/AgricultoresPage";
import LineasProcesoPage from "../pages/administracion/LineasProcesoPage";
import TiposProduccionPage from "../pages/administracion/TiposProduccionPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />

        <Route path="garita" element={<GaritaPage />} />

        <Route path="recepcion" element={<RecepcionPage />}>
          <Route path="guias/plan-diario" element={<PlanDiario />} />
          <Route path="guias/registro" element={<RegistroGuias />} />
          <Route path="guias/consulta" element={<ConsultaGuias />} />
        </Route>

        <Route path="calibrado" element={<CalibradoPage />} />
        <Route path="hidrotermico" element={<HidrotermicoPage />} />
        <Route path="empaque" element={<EmpaquePage />} />

        <Route path="administracion/campanias" element={<CampaniasPage />} />
        <Route path="administracion/variedades" element={<VariedadesPage />} />
        <Route path="administracion/clientes" element={<ClientesPage />} />
        <Route path="administracion/agricultores" element={<AgricultoresPage />} />
        <Route path="administracion/lineas-proceso" element={<LineasProcesoPage />} />
        <Route path="administracion/tipos-produccion" element={<TiposProduccionPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;