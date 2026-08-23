function StatisticsCard({ label, value, tone }) {
  return <article className={`stat-card ${tone}`}><span className="stat-dot" aria-hidden="true" /><div><div className="stat-label">{label}</div><strong>{value}</strong></div></article>;
}

export default StatisticsCard;