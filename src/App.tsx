import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EndPage } from './pages/EndPage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { RegisterAdminPage } from './pages/RegisterAdminPage';
import { RegisterParamsPage } from './pages/RegisterParamsPage';
import { ProcessesPage } from './pages/ProcessesPage';
import { ProcessesPageCopy } from './pages/ProcessesPageCopy';
import { ProcessListPage } from './pages/ProcessListPage';
import { RequirementsPage } from './pages/RequirementsPage';
// import { UserRequirementsPage } from './pages/UserRequirementsPage';
import { BriefingPage } from './pages/BriefingPage';
import { TrafficUserPage } from './pages/TrafficUserPage';
import { GetBriefingPage } from './pages/GetBriefingPage';
import { UserAddingPage } from './pages/UserAddingPage';
import { ActivityPage } from './pages/ActivityPage';
import { ActivityAddingPage } from './pages/ActivityAddingPage';
import { DepartmentPage } from './pages/DepartmentPage';
import { DepartmentAddingPage } from './pages/DepartmentAddingPage';
import { ActivityAssignmentPage } from './pages/ActivityAssignmentPage';
import { BasicTaskPage } from './pages/BasicTask';
import { ProfilePage } from './pages/ProfilePage';
// import { RegistrosPage } from './pages/RegistrosPage';
import { RegistroProcesosPage } from './pages/registros/RegistroProcesosPage'
import { RegistroActivityPage } from './pages/registros/RegistroActivityPage'
import { ActivityProcessPage } from './pages/registros/ActivityProcessPage'
import { RegistroCasosPage } from './pages/registros/RegistroCasosPage'
import { RegistroTareasPage } from './pages/registros/RegistroTareasPage'
import { RegistroStatusPorCasoPage } from './pages/registros/RegistroStatusPorCasoPage';
import { RegistroAnalisisPorCasoPage } from './pages/registros/RegistroAnalisisPorCasoPage';
import { RegistroCumplimientoPage } from './pages/registros/RegistroCumplimientoPage';
import { RegistroPagosPage } from './pages/registros/RegistroPagosPage';
import { BrandCenterPage } from './pages/BrandCenterPage';
import { BrandCenterAddingPage } from './pages/BrandCenterAddingPage';
import { RegistroTransaccionesPage } from './pages/registros/RegistroTransaccionesPage';
import { ExternalProcessAddingPage } from './pages/ExternalProcessAddingPage';
import { ExternalProcessPage } from './pages/ExternalProcessPage';
import { OfferAddingPage } from './pages/OfferAddingPage';
import { RegistroOfferPage } from './pages/registros/RegistroOfferPage';
import { RegistroPendingOffersPage } from './pages/registros/RegistroPendingOffers';
import { RegistroAccountPage } from './pages/registros/RegistroAccount';
import { AnnouncementAdding } from './pages/AnnouncementAdding';
import { KanbanUser } from './pages/registros/KanbanUser';
import { KanbanCase } from './pages/registros/KanbanCase';
import { GanttCase } from './pages/registros/GanttCase';
import { RegistroTareasPorCasoPage } from './pages/registros/RegistroTareasPorCaso';
import { EditOfferPage } from './pages/EditOfferPage';
import { ClientAddingPage } from './pages/ClientAddingPage';
import { RegistroTransaccionesPorPeriodoPage } from './pages/registros/RegistroTransaccionesPorPeriodo';
import { RegistroAccountAdminPage } from './pages/registros/RegistroAccountAdmin';
import { RegistroOfertasPorStatusPage } from './pages/registros/RegistroOfertasPorStatus';
// import { RegistroCasosCerradosPage } from './pages/registros/RegistroCasosCerrados';
import { ClientsPage } from './pages/ClientsPage';
// import { RegistroCasosExternosPage } from './pages/registros/RegistroCasosExternosPage';
import { AvisosDeCobroPage } from './pages/AvisosDeCobroPage';
import { AvisosDeCobroAddingPage } from './pages/AvisosDeCobroAddingPage';
import { RegistroOfertasPage } from './pages/registros/RegistroOfertasPage';
import { RegistroBriefingsPage } from './pages/registros/RegistroBriefingsPage';
import { OfferDetailPage } from './pages/OfferDetailPage';
import { OfferDetailBriefing } from './pages/OfferDetailBriefingPage';
import { FichaClientePage } from './pages/FichaClientePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Log in */}
        <Route path="/" element={<LoginPage />} />

        {/* Registrarse */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Cerrar sesion */}
        <Route path="/end" element={<EndPage />} />

        {/* Actividades */}
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/activity/add" element={<ActivityAddingPage />} />
        <Route path="/activity/resume" element={<RegistroActivityPage />} />
        <Route path="/activity/list/:process_id" element={<ActivityProcessPage />} />

        {/* Procesos  */}
        <Route path="/process" element={<ProcessListPage />} />
        <Route path="/process/add" element={<ProcessesPage />} />
        <Route path="/process/copy/:process_id" element={<ProcessesPageCopy />} />
        <Route path="/process/external" element={<ExternalProcessPage />} />
        <Route path="/process/external/add" element={<ExternalProcessAddingPage />} />

        {/* Ofertas */}
        <Route path="/offers/edit/:id" element={<EditOfferPage />} />
        <Route path="/offer/add" element={<OfferAddingPage />} />
        <Route path="/offers" element={<RegistroOfertasPage />} />

        {/* Requerimientos */}
        <Route path="/requirements" element={<TrafficUserPage />} />
        <Route path="/requirements/add" element={<RequirementsPage />} />
        <Route path="/requirements/basic" element={<BasicTaskPage />} />
        <Route path="/requirements/briefings" element={<RegistroBriefingsPage />} />
        <Route path="/requirements/offer/:id" element={<OfferDetailBriefing />} />

        {/* Briefing */}
        <Route path="/briefing/new/:processId/:caseId" element={<BriefingPage />} />
        <Route path="/briefing/:caseId" element={<GetBriefingPage />} />

        {/* Agregar departamento */}
        <Route path="/departamentos" element={<DepartmentPage />} />
        <Route path="/departments/add" element={<DepartmentAddingPage />} />

        {/* Asignacion de tareas */}
        <Route path="/assignment" element={<ActivityAssignmentPage />} />

        {/* Modulo Administrador */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/user/add" element={<UserAddingPage />} />
        <Route path="/register/admin" element={<RegisterAdminPage />} />
        <Route path="/register/params" element={<RegisterParamsPage />} />

        {/* Avisos de cobro */}
        <Route path="/avisosdecobro" element={<AvisosDeCobroPage />} />
        <Route path="/avisosdecobro/add" element={<AvisosDeCobroAddingPage />} />

        {/* Clientes */}
        <Route path="/user/add/client" element={<ClientAddingPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/client/:id" element={<FichaClientePage />} />

        {/* Pagina de perfil */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Agregar info brandcenter */}
        <Route path="/brandcenter" element={<BrandCenterPage />} />
        <Route path="/brandcenter/add" element={<BrandCenterAddingPage />} />
        <Route path="/offer/:id" element={<OfferDetailPage />} />

        {/* Resumenes */}
        <Route path="/pagos" element={<RegistroPagosPage />} />
        <Route path="/offer/resume" element={<RegistroOfferPage />} />
        <Route path="/offer/resume/status" element={<RegistroOfertasPorStatusPage />} />
        <Route path="/offer/resume/pending" element={<RegistroPendingOffersPage />} />
        <Route path="/process/resume" element={<RegistroProcesosPage />} />
        <Route path="/casos/status/resume" element={<RegistroStatusPorCasoPage />} />
        <Route path="/client/estadocuenta" element={<RegistroAccountAdminPage />} />
        <Route path="/transacciones/resume" element={<RegistroTransaccionesPage />} />
        <Route path="/pagos/periodo/resume" element={<RegistroTransaccionesPorPeriodoPage />} />
        <Route path="/requirements/resume" element={<RegistroCasosPage />} />
        {/* <Route path="/requirements/closed/resume" element={<RegistroCasosCerradosPage />} /> */}
        {/* <Route path="/requirements/external/resume" element={<RegistroCasosExternosPage />} /> */}
        <Route path="/analisis/resume" element={<RegistroAnalisisPorCasoPage />} />
        <Route path="/tareas/resume" element={<RegistroTareasPage />} />
        <Route path="/tareas/casos" element={<RegistroTareasPorCasoPage />} />
        <Route path="/users/cumplimiento/resume" element={<RegistroCumplimientoPage />} />
        <Route path="/users/estadocuenta" element={<RegistroAccountPage />} />
        <Route path="/kanban/usuario" element={<KanbanUser />} />
        <Route path="/kanban/caso" element={<KanbanCase />} />
        <Route path="/gantt/caso" element={<GanttCase />} />

        {/* Anuncios */}
        <Route path="/announcement" element={<AnnouncementAdding />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
