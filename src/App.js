import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './ui/screens/Login';
import Dashboard from './ui/screens/Dashboard';
import ApplyLeave from './ui/screens/ApplyLeave';
import MyLeaves from './ui/screens/MyLeaves';
import LeaveDetails from './ui/screens/LeaveDetails';
import Profile from './ui/screens/Profile';
import ProtectedRoute from './routes/ProtectedRoute';
import AuthenticatedLayout from './ui/shared/AuthenticatedLayout';
import ComingSoon from './ui/shared/ComingSoon';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/apply-leave" element={<ApplyLeave />} />
          <Route path="/my-leaves" element={<MyLeaves />} />
          <Route path="/my-leaves/:id" element={<LeaveDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/team-calendar" element={<ComingSoon />} />
          <Route path="/profile" element={<ComingSoon />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
