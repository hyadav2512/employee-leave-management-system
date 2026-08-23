import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearLeaveError, fetchLeaveInfo, submitLeaveRequest } from '../../store/slices/leaveSlice';
import { fetchDashboard } from '../../store/slices/dashboardSlice';
import { calculateWorkingDays, getToday } from '../../utils/leaveDates';
import DateRangeFields from './DateRangeFields';
import FileUpload from './FileUpload';
import LeaveBalanceInfo from './LeaveBalanceInfo';
import LeaveTypeSelect from './LeaveTypeSelect';
import './ApplyLeave.css';

const initialForm = { leaveType: '', startDate: '', endDate: '', reason: '' };

function ApplyLeave() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { types, balances, loading, submitting, error, balanceError } = useSelector((state) => state.leave);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const today = getToday();
  const selectedBalance = balances.find((balance) => balance.type === form.leaveType);
  const workingDays = calculateWorkingDays(form.startDate, form.endDate);

  useEffect(() => { dispatch(fetchLeaveInfo()); }, [dispatch]);

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    if (error) dispatch(clearLeaveError());
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.leaveType) nextErrors.leaveType = 'Please select a leave type.';
    if (!form.startDate) nextErrors.startDate = 'Start date is required.';
    else if (form.startDate < today) nextErrors.startDate = 'Start date cannot be in the past.';
    if (!form.endDate) nextErrors.endDate = 'End date is required.';
    else if (form.startDate && form.endDate < form.startDate) nextErrors.endDate = 'End date cannot be before start date.';
    if (!form.reason.trim()) nextErrors.reason = 'Reason is required.';
    else if (form.reason.trim().length > 500) nextErrors.reason = 'Reason must be 500 characters or fewer.';
    if (form.startDate && form.endDate && !workingDays) nextErrors.endDate = 'Select at least one working day.';
    if (selectedBalance && workingDays > selectedBalance.remaining) {
      nextErrors.leaveType = `You only have ${selectedBalance.remaining} days of ${selectedBalance.type} remaining.`;
    }
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length || submitting) return;

    const result = await dispatch(submitLeaveRequest({ ...form, reason: form.reason.trim(), numberOfDays: workingDays }));
    if (submitLeaveRequest.fulfilled.match(result)) {
      setSuccess(true);
      dispatch(fetchDashboard());
      navigate('/dashboard', { state: { notification: 'Leave request submitted successfully.' } });
    }
  };

  if (loading && !types.length) return <main className="page-shell"><div className="apply-page-state">Loading leave information...</div></main>;
  if (error && !types.length) return <main className="page-shell"><div className="apply-page-state"><h1>Unable to load leave information.</h1><p>{error}</p><button className="apply-primary" type="button" onClick={() => dispatch(fetchLeaveInfo())}>Retry</button></div></main>;
  if (!types.length) return <main className="page-shell"><div className="apply-page-state"><h1>No leave types are currently available.</h1><p>Please check again later.</p></div></main>;

  return (
    <main className="page-shell apply-page">
      <header className="apply-heading"><div><p className="section-eyebrow">Time away</p><h1>Apply for leave</h1><p>Request time off from work.</p></div></header>
      <section className="apply-panel" aria-labelledby="apply-form-title">
        <div className="apply-panel-heading"><h2 id="apply-form-title">Leave request</h2><p>Choose your dates and tell us briefly why you need time away.</p></div>
        {success && <div className="apply-success" role="status">Leave request submitted successfully. Redirecting to your dashboard...</div>}
        {error && <div className="apply-error" role="alert">{error}</div>}
        {balanceError && <div className="apply-error" role="alert">{balanceError} You can select a leave type, but your balance must be available before submitting.</div>}
        <form onSubmit={handleSubmit} noValidate>
          <LeaveTypeSelect types={types} value={form.leaveType} onChange={updateForm} error={errors.leaveType} />
          <LeaveBalanceInfo balance={selectedBalance} requestedDays={workingDays} />
          <DateRangeFields startDate={form.startDate} endDate={form.endDate} onChange={updateForm} errors={errors} minDate={today} />
          <div className="working-days" aria-live="polite"><span>Working days</span><strong>{workingDays}</strong><small>Weekends are excluded</small></div>
          <div className="apply-field"><label htmlFor="reason">Reason</label><textarea id="reason" name="reason" rows="5" maxLength="500" value={form.reason} onChange={updateForm} aria-invalid={Boolean(errors.reason)} placeholder="Add a short explanation" /> <div className="reason-meta"><span className={errors.reason ? 'apply-field-error' : ''}>{errors.reason}</span><small>{form.reason.length}/500</small></div></div>
          <FileUpload file={file} onChange={(event) => setFile(event.target.files[0] || null)} />
          <div className="apply-actions"><button className="apply-cancel" type="button" onClick={() => navigate('/dashboard')}>Cancel</button><button className="apply-primary" type="submit" disabled={submitting || success}>{submitting ? 'Submitting...' : 'Submit request'}</button></div>
        </form>
      </section>
    </main>
  );
}

export default ApplyLeave;
