function LeaveStatusBadge({ status }) { return <span className={`status ${status.toLowerCase()}`}>{status}</span>; }
export default LeaveStatusBadge;
