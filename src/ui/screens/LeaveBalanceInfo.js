function LeaveBalanceInfo({ balance, requestedDays }) {
  if (!balance) return <div className="balance-info muted">Select a leave type to see your available balance.</div>;
  const remaining = balance.remaining - requestedDays;
  return (
    <div className="balance-info" aria-live="polite">
      <div><span>Available balance</span><strong>{balance.remaining} days</strong></div>
      {requestedDays > 0 && <div><span>After this request</span><strong className={remaining < 0 ? 'balance-warning' : ''}>{remaining} days</strong></div>}
      <small className="balance-note">Pending requests do not reduce your available balance until approved.</small>
    </div>
  );
}

export default LeaveBalanceInfo;
