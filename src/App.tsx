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
import { ActividadesPage } from './pages/ActividadesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/activity/add" element={<ActividadesPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/register/admin" element={<RegisterAdminPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/user/add" element={<UserAddingPage />} />
        <Route path="/end" element={<EndPage />} />
        <Route path="/process" element={<ProcessListPage />} />
        <Route path="/process/add" element={<ProcessesPage />} />
        <Route path="/requirements" element={<TrafficUserPage />} />
        {/* <Route path="/traffic" element={<TrafficUserPage />} /> */}
        <Route path="/requirements/add" element={<RequirementsPage />} />
        <Route path="/briefing/new/:processId/:caseId" element={<BriefingPage />} />
        <Route path="/briefing/:caseId" element={<GetBriefingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
