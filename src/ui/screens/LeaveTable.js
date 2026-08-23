import { Link } from 'react-router-dom';
import LeaveStatusBadge from '../shared/LeaveStatusBadge';

function LeaveTable({ requests, loading }) {
  if (loading) return <div className="table-loading">Loading your leave requests...</div>;
  return <div className="leave-table-wrap"><table className="leave-table"><thead><tr><th>Leave type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Status</th><th>Applied on</th><th>Action</th></tr></thead><tbody>{requests.map((request) => <tr key={request.id}><td data-label="Leave type">{request.leaveType}</td><td data-label="Dates">{request.startDate} to {request.endDate}</td><td data-label="Days">{request.numberOfDays}</td><td data-label="Reason" className="reason-cell">{request.reason}</td><td data-label="Status"><LeaveStatusBadge status={request.status} /></td><td data-label="Applied on">{request.createdAt.slice(0, 10)}</td><td data-label="Action"><Link className="view-link" to={`/my-leaves/${request.id}`}>View</Link></td></tr>)}</tbody></table></div>;
}
export default LeaveTable;
