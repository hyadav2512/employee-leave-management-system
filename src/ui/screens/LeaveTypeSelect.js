function LeaveTypeSelect({ types, value, onChange, error }) {
  return (
    <div className="apply-field">
      <label htmlFor="leaveType">Leave type</label>
      <select id="leaveType" name="leaveType" value={value} onChange={onChange} aria-invalid={Boolean(error)}>
        <option value="">Select leave type</option>
        {types.map((type) => <option key={type.id} value={type.name}>{type.name}</option>)}
      </select>
      {error && <p className="apply-field-error">{error}</p>}
    </div>
  );
}

export default LeaveTypeSelect;
