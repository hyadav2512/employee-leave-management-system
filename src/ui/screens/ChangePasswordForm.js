import { useState } from 'react';

const initialForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
function ChangePasswordForm({ saving, error, onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => { event.preventDefault(); const next = {}; if (!form.currentPassword) next.currentPassword = 'Current password is required.'; if (!form.newPassword || form.newPassword.length < 8) next.newPassword = 'New password must be at least 8 characters.'; if (form.newPassword !== form.confirmPassword) next.confirmPassword = 'Passwords do not match.'; if (form.currentPassword === form.newPassword) next.newPassword = 'New password must be different.'; setErrors(next); if (!Object.keys(next).length) { const success = await onSubmit(form); if (success) setForm(initialForm); } };
  return <form className="password-form" onSubmit={submit} noValidate>{[['currentPassword', 'Current password'], ['newPassword', 'New password'], ['confirmPassword', 'Confirm new password']].map(([name, label]) => <label key={name}>{label}<input name={name} type="password" value={form[name]} onChange={update} autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'} aria-invalid={Boolean(errors[name])} />{errors[name] && <span className="profile-field-error">{errors[name]}</span>}</label>)}{error && <div className="profile-error" role="alert">{error}</div>}<button className="apply-primary" type="submit" disabled={saving}>{saving ? 'Changing password...' : 'Change password'}</button></form>;
}
export default ChangePasswordForm;
