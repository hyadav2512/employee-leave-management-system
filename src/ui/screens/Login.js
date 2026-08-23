import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, login } from '../../store/slices/authSlice';
import './Login.css';

const initialForm = { email: '', password: '' };

function Login() {
  const [form, setForm] = useState(initialForm);
  const [validationErrors, setValidationErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const errors = {};
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Please enter a valid email address';
    if (!form.password) errors.password = 'Password is required';
    else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters';
    return errors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setValidationErrors((current) => ({ ...current, [name]: undefined }));
    if (error) dispatch(clearAuthError());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validate();
    setValidationErrors(errors);
    if (Object.keys(errors).length) return;
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) navigate('/dashboard');
  };

  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-heading">
        <div className="brand-mark" aria-hidden="true">EL</div>
        <p className="eyebrow">Employee portal</p>
        <h1 id="login-heading">Employee Leave Management</h1>
        <p className="login-intro">Sign in to manage your leave and time away.</p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} aria-invalid={Boolean(validationErrors.email)} aria-describedby={validationErrors.email ? 'email-error' : undefined} />
            {validationErrors.email && <p className="field-error" id="email-error">{validationErrors.email}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" value={form.password} onChange={handleChange} aria-invalid={Boolean(validationErrors.password)} aria-describedby={validationErrors.password ? 'password-error' : undefined} />
            {validationErrors.password && <p className="field-error" id="password-error">{validationErrors.password}</p>}
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="login-button" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        </form>
      </section>
    </main>
  );
}

export default Login;