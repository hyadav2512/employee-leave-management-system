function formatDate(date) { return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${date}T00:00:00`)); }

function RecentLeaveActivity({ activities, onViewAll }) {
  return <section className="dashboard-card activity-card"><div className="section-heading"><div><p className="section-eyebrow">Requests</p><h2>Recent activity</h2></div><button className="text-button" type="button" onClick={onViewAll}>View all</button></div>{activities.length ? <div className="activity-list">{activities.slice(0, 5).map((activity) => <div className="activity-item" key={activity.id}><div className="activity-main"><strong>{activity.type}</strong><span>{formatDate(activity.startDate)} - {formatDate(activity.endDate)} · {activity.days} days</span></div><div className="activity-applied">Applied {formatDate(activity.appliedDate)}</div><span className={`status ${activity.status.toLowerCase()}`}>{activity.status}</span></div>)}</div> : <p className="empty-state">No recent leave activity</p>}</section>;
}

export default RecentLeaveActivity;