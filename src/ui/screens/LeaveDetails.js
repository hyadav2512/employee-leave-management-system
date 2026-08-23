import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { cancelLeaveRequest, fetchLeaveRequest } from '../../store/slices/leaveSlice';
import ConfirmationModal from '../shared/ConfirmationModal';
import LeaveStatusBadge from '../shared/LeaveStatusBadge';
import LeaveTimeline from './LeaveTimeline';
import './MyLeaves.css';

function LeaveDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { details, detailsLoading, cancelling, error } = useSelector((state) => state.leave);
  const [confirming, setConfirming] = useState(false);
  useEffect(() => { dispatch(fetchLeaveRequest(id)); }, [dispatch, id]);

  const confirmCancel = async () => {
    const result = await dispatch(cancelLeaveRequest(id));
    if (cancelLeaveRequest.fulfilled.match(result)) { setConfirming(false); navigate('/my-leaves', { state: { notification: 'Leave request cancelled successfully.' } }); }
  };
  if (detailsLoading) return <main className="page-shell"><div className="apply-page-state">Loading leave request...</div></main>;
  if (error || !details) return <main className="page-shell"><div className="apply-page-state"><h1>{error || 'Leave request not found.'}</h1><Link className="apply-primary" to="/my-leaves">Back to my requests</Link></div></main>;
  return <main className="page-shell my-leaves-page"><Link className="back-link" to="/my-leaves">Back to my requests</Link><header className="detail-heading"><div><p className="section-eyebrow">Leave request</p><h1>{details.leaveType}</h1><p>{details.startDate} to {details.endDate}</p></div><LeaveStatusBadge status={details.status} /></header>{error && <div className="list-error" role="alert">{error}</div>}<section className="detail-layout"><article className="detail-panel"><h2>Request details</h2><dl className="detail-grid"><div><dt>Start date</dt><dd>{details.startDate}</dd></div><div><dt>End date</dt><dd>{details.endDate}</dd></div><div><dt>Working days</dt><dd>{details.numberOfDays}</dd></div><div><dt>Applied on</dt><dd>{details.createdAt.slice(0, 10)}</dd></div></dl><div className="detail-reason"><h3>Reason</h3><p>{details.reason}</p></div>{details.managerComment && <div className="detail-reason"><h3>Manager comment</h3><p>{details.managerComment}</p></div>}{details.status === 'Pending' && <button className="danger-button standalone" type="button" onClick={() => setConfirming(true)}>Cancel request</button>}</article><aside className="detail-panel"><h2>Status timeline</h2><LeaveTimeline request={details} /></aside></section>{confirming && <ConfirmationModal onClose={() => setConfirming(false)} onConfirm={confirmCancel} loading={cancelling} />}</main>;
}
export default LeaveDetails;
