function LeaveBalanceCard({ balance }) {
  const percentage = balance.allocated ? Math.round((balance.remaining / balance.allocated) * 100) : 0;
  return (
    <article className="balance-card">
      <div className="card-kicker">{balance.type}</div>
      <div className="balance-number">{balance.remaining}<span> days</span></div>
      <div className="balance-label">Remaining</div>
      <div className="progress-track" role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100" aria-label={`${balance.type} remaining`}><span style={{ width: `${percentage}%` }} /></div>
      <div className="balance-meta"><span>Used: {balance.used}</span><span>Total: {balance.allocated}</span></div>
    </article>
  );
}

export default LeaveBalanceCard;