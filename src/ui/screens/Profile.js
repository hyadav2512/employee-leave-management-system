import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, updateProfile } from '../../store/slices/authSlice';
import profileService from '../../services/profileService';
import ChangePasswordForm from './ChangePasswordForm';
import ProfileForm from './ProfileForm';
import './Profile.css';

function Profile() {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [notification, setNotification] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const loadProfile = async () => { setLoading(true); setError(''); try { const data = await profileService.getProfile(); setProfile(data); setForm({ name: data.name || '', phone: data.phone || '' }); setImagePreview(data.profileImage || ''); } catch (requestError) { setError(requestError.response?.status === 401 ? 'Your session has expired. Please sign in again.' : 'Unable to load your profile.'); } finally { setLoading(false); } };
  useEffect(() => { loadProfile(); }, []);
  const update = (event) => { setForm((current) => ({ ...current, [event.target.name]: event.target.value })); setNotification(''); };
  const selectImage = (event) => { const selected = event.target.files[0]; if (!selected) return; if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) { setError('Please choose a JPEG, PNG, or WEBP image.'); return; } if (selected.size > 1.5 * 1024 * 1024) { setError('Profile image must be smaller than 1.5 MB.'); return; } const reader = new FileReader(); reader.onload = () => setImagePreview(reader.result); reader.readAsDataURL(selected); };
  const saveProfile = async (event) => { event.preventDefault(); const nextErrors = {}; if (form.name.trim().length < 2 || form.name.trim().length > 80) nextErrors.name = 'Name must be between 2 and 80 characters.'; if (form.phone && !/^\d{10}$/.test(form.phone)) nextErrors.phone = 'Please enter a valid 10-digit phone number.'; setFormErrors(nextErrors); if (Object.keys(nextErrors).length) return; setSaving(true); setError(''); const result = await dispatch(updateProfile({ ...form, profileImage: imagePreview })); setSaving(false); if (updateProfile.fulfilled.match(result)) { setProfile((current) => ({ ...current, ...result.payload })); setNotification('Profile updated successfully.'); } else setError(result.payload); };
  const savePassword = async (passwords) => { setPasswordSaving(true); setPasswordError(''); const result = await dispatch(changePassword(passwords)); setPasswordSaving(false); if (changePassword.fulfilled.match(result)) { setNotification(result.payload.message); return true; } setPasswordError(result.payload); return false; };
  if (loading) return <main className="page-shell profile-page"><div className="profile-skeleton">Loading your profile...</div></main>;
  if (error && !profile) return <main className="page-shell profile-page"><div className="profile-state"><h1>Unable to load your profile.</h1><p>{error}</p><button className="apply-primary" type="button" onClick={loadProfile}>Retry</button></div></main>;
  return <main className="page-shell profile-page"><header className="profile-heading"><div><p className="section-eyebrow">Account</p><h1>Employee profile</h1><p>Manage your personal information and password.</p></div></header>{notification && <div className="apply-success" role="status">{notification}</div>}{error && <div className="profile-error" role="alert">{error}</div>}<section className="profile-section"><div className="profile-section-heading"><h2>Personal information</h2><p>Name, phone, and profile picture can be updated.</p></div><ProfileForm profile={profile || authUser} form={{ ...profile, ...form }} errors={formErrors} saving={saving} onChange={update} onSubmit={saveProfile} onImageChange={selectImage} imagePreview={imagePreview} onRemoveImage={() => setImagePreview('')} /></section><section className="profile-section"><div className="profile-section-heading"><h2>Change password</h2><p>Use a unique password of at least 8 characters.</p></div><ChangePasswordForm saving={passwordSaving} error={passwordError} onSubmit={savePassword} /></section></main>;
}
export default Profile;
