import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EndPage } from './pages/EndPage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { RegisterAdminPage } from './pages/RegisterAdminPage';
import { ProcessesPage } from './pages/ProcessesPage';
import { ProcessListPage } from './pages/ProcessListPage';
import { RequirementsPage } from './pages/RequirementsPage';
import { UserRequirementsPage } from './pages/UserRequirementsPage';
import { BriefingPage } from './pages/BriefingPage';
import { TrafficUserPage } from './pages/TrafficUserPage';
import { GetBriefingPage } from './pages/GetBriefingPage';
import { UserAddingPage } from './pages/UserAddingPage';
import { ActivityPage } from './pages/ActivityPage';
import { ActivityAddingPage } from './pages/ActivityAddingPage';
import { DepartmentAddingPage } from './pages/DepartmentAddingPage';
import { ActivityAssignmentPage } from './pages/ActivityAssignmentPage';
import { BasicTaskPage } from './pages/BasicTask';
import { ProfilePage } from './pages/ProfilePage';
import { RegistrosPage } from './pages/RegistrosPage';
import { RegistroProcesosPage } from './pages/registros/RegistroProcesosPage'
import { RegistroActivityPage } from './pages/registros/RegistroActivityPage'
import { RegistroCasosPage } from './pages/registros/RegistroCasosPage'
import { RegistroTareasPage } from './pages/registros/RegistroTareasPage'
import { RegistroStatusPorCasoPage } from './pages/registros/RegistroStatusPorCasoPage';
import { RegistroAnalisisPorCasoPage } from './pages/registros/RegistroAnalisisPorCasoPage';
import { RegistroCumplimientoPage } from './pages/registros/RegistroCumplimientoPage';
import { RegistroPagosPage } from './pages/registros/RegistroPagosPage';
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
import { RegistroTareasPorCasoPage } from './pages/registros/RegistroTareasPorCaso';
import { EditOfferPage } from './pages/EditOfferPage';
import { ClientAddingPage } from './pages/ClientAddingPage';
import { RegistroTransaccionesPorPeriodoPage } from './pages/registros/RegistroTransaccionesPorPeriodo';

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

        {/* Procesos  */}
        <Route path="/process" element={<ProcessListPage />} />
        <Route path="/process/add" element={<ProcessesPage />} />
        <Route path="/process/external" element={<ExternalProcessPage />} />
        <Route path="/process/external/add" element={<ExternalProcessAddingPage />} />

        {/* Ofertas */}
        <Route path="/offers/edit/:id" element={<EditOfferPage />} />

        {/* Requerimientos */}
        <Route path="/requirements" element={<TrafficUserPage />} />
        <Route path="/requirements/add" element={<RequirementsPage />} />
        <Route path="/requirements/basic" element={<BasicTaskPage />} />

        <Route path="/offer/add" element={<OfferAddingPage />} />
        {/* Briefing */}
        <Route path="/briefing/new/:processId/:caseId" element={<BriefingPage />} />
        <Route path="/briefing/:caseId" element={<GetBriefingPage />} />

        {/* Agregar departamento */}
        <Route path="/departamentos/add" element={<DepartmentAddingPage />} />

        {/* Asignacion de tareas */}
        <Route path="/assignment" element={<ActivityAssignmentPage />} />

        {/* Modulo Administrador */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/user/add" element={<UserAddingPage />} />
        <Route path="/register/admin" element={<RegisterAdminPage />} />

        {/* Clientes */}
        <Route path="/user/add/client" element={<ClientAddingPage />} />

        {/* Pagina de perfil */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Agregar info brandcenter */}
        <Route path="/brandcenter/add" element={<BrandCenterAddingPage />} />

        {/* Resumenes */}
        <Route path="/pagos" element={<RegistroPagosPage />} />
        <Route path="/offer/resume" element={<RegistroOfferPage />} />
        <Route path="/offer/resume/pending" element={<RegistroPendingOffersPage />} />
        <Route path="/process/resume" element={<RegistroProcesosPage />} />
        <Route path="/casos/status/resume" element={<RegistroStatusPorCasoPage />} />
        <Route path="/transacciones/resume" element={<RegistroTransaccionesPage />} />
        <Route path="/pagos/periodo/resume" element={<RegistroTransaccionesPorPeriodoPage />} />
        <Route path="/requirements/resume" element={<RegistroCasosPage />} />
        <Route path="/analisis/resume" element={<RegistroAnalisisPorCasoPage />} />
        <Route path="/tareas/resume" element={<RegistroTareasPage />} />
        <Route path="/tareas/casos" element={<RegistroTareasPorCasoPage />} />
        <Route path="/users/cumplimiento/resume" element={<RegistroCumplimientoPage />} />
        <Route path="/users/estadocuenta" element={<RegistroAccountPage />} />
        <Route path="/kanban/usuario" element={<KanbanUser />} />
        <Route path="/kanban/caso" element={<KanbanCase />} />

        {/* Anuncios */}
        <Route path="/announcement" element={<AnnouncementAdding />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
