import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import './AuthenticatedLayout.css';

const navigation = [
  { label: 'Dashboard', to: '/dashboard', enabled: true },
  { label: 'Apply Leave', to: '/apply-leave', enabled: true },
  { label: 'My Leaves', to: '/my-leaves', enabled: true },
  { label: 'Team Calendar', to: '/team-calendar' },
  { label: 'Profile', to: '/profile', enabled: true },
];

function AuthenticatedLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-layout">
      <header className="topbar">
        <div className="topbar-brand"><span className="brand-mark-small">EL</span><span>Employee Leave Management</span></div>
        <div className="topbar-user"><span className="user-name">{user?.name || 'Employee'}</span><button type="button" className="topbar-logout" onClick={handleLogout}>Log out</button></div>
      </header>
      <div className="layout-body">
        <aside className="sidebar" aria-label="Main navigation">
          <nav>
            {navigation.map((item) => item.enabled ? (
              <NavLink key={item.label} to={item.to} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>{item.label}</NavLink>
            ) : (
              <NavLink key={item.label} to={item.to} className="sidebar-link">{item.label}<span className="soon-label">Soon</span></NavLink>
            ))}
          </nav>
          <button className="sidebar-logout" type="button" onClick={handleLogout}>Log out</button>
        </aside>
        <div className="layout-content"><Outlet /></div>
      </div>
    </div>
  );
}

export default AuthenticatedLayout;