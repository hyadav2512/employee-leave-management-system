function formatDate(date) { return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(`${date}T00:00:00`)); }

function UpcomingLeaves({ leaves }) {
  return <section className="dashboard-card activity-card"><div className="section-heading"><div><p className="section-eyebrow">Schedule</p><h2>Upcoming leaves</h2></div><span className="section-count">{leaves.length}</span></div>{leaves.length ? <div className="upcoming-list">{leaves.map((leave) => <div className="upcoming-item" key={leave.id}><div><strong>{leave.type}</strong><span>{formatDate(leave.startDate)} - {formatDate(leave.endDate)}</span></div><div className="upcoming-days">{leave.days} working days</div><span className="status approved">{leave.status}</span></div>)}</div> : <p className="empty-state">No upcoming leaves</p>}</section>;
}

export default UpcomingLeaves;