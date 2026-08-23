import LeaveStatusBadge from '../shared/LeaveStatusBadge';
function LeaveTimeline({ request }) { return <ol className="leave-timeline"><li className="complete"><strong>Request created</strong><small>{request.createdAt.slice(0, 10)}</small></li><li className="complete"><LeaveStatusBadge status={request.status} /><small>{request.status === 'Pending' ? 'Awaiting review' : request.updatedAt.slice(0, 10)}</small></li></ol>; }
export default LeaveTimeline;
