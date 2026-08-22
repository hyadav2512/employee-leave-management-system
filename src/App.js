import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';
import ComingSoon from './components/common/ComingSoon';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/apply-leave" element={<ComingSoon />} />
          <Route path="/my-leaves" element={<ComingSoon />} />
          <Route path="/team-calendar" element={<ComingSoon />} />
          <Route path="/profile" element={<ComingSoon />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
