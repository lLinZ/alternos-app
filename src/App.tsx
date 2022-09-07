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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/register/admin" element={<RegisterAdminPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/end" element={<EndPage />} />
        <Route path="/process" element={<ProcessListPage />} />
        <Route path="/process/add" element={<ProcessesPage />} />
        <Route path="/requirements" element={<UserRequirementsPage />} />
        <Route path="/requirements/add" element={<RequirementsPage />} />
        <Route path="/briefing" element={<BriefingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
