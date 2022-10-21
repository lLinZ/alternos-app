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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/activity/add" element={<ActivityAddingPage />} />
        <Route path="/activity/resume" element={<RegistroActivityPage />} />
        <Route path="/departamentos/add" element={<DepartmentAddingPage />} />
        <Route path="/assignment" element={<ActivityAssignmentPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/register/admin" element={<RegisterAdminPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/user/add" element={<UserAddingPage />} />
        <Route path="/end" element={<EndPage />} />
        <Route path="/process" element={<ProcessListPage />} />
        <Route path="/process/add" element={<ProcessesPage />} />
        <Route path="/process/resume" element={<RegistroProcesosPage />} />
        <Route path="/casos/status/resume" element={<RegistroStatusPorCasoPage />} />
        <Route path="/transacciones/resume" element={<RegistroTransaccionesPage />} />
        <Route path="/requirements" element={<TrafficUserPage />} />
        <Route path="/requirements/basic" element={<BasicTaskPage />} />
        <Route path="/requirements/resume" element={<RegistroCasosPage />} />
        <Route path="/analisis/resume" element={<RegistroAnalisisPorCasoPage />} />
        <Route path="/tareas/resume" element={<RegistroTareasPage />} />
        <Route path="/users/cumplimiento/resume" element={<RegistroCumplimientoPage />} />
        {/* <Route path="/traffic" element={<TrafficUserPage />} /> */}
        <Route path="/requirements/add" element={<RequirementsPage />} />
        <Route path="/briefing/new/:processId/:caseId" element={<BriefingPage />} />
        <Route path="/briefing/:caseId" element={<GetBriefingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/files" element={<RegistrosPage />} />
        <Route path="/pagos" element={<RegistroPagosPage />} />
        <Route path="/brandcenter/add" element={<BrandCenterAddingPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
