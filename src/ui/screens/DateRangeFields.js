function DateRangeFields({ startDate, endDate, onChange, errors, minDate }) {
  return (
    <div className="date-fields">
      <div className="apply-field">
        <label htmlFor="startDate">Start date</label>
        <input id="startDate" name="startDate" type="date" min={minDate} value={startDate} onChange={onChange} aria-invalid={Boolean(errors.startDate)} />
        {errors.startDate && <p className="apply-field-error">{errors.startDate}</p>}
      </div>
      <div className="apply-field">
        <label htmlFor="endDate">End date</label>
        <input id="endDate" name="endDate" type="date" min={startDate || minDate} value={endDate} onChange={onChange} aria-invalid={Boolean(errors.endDate)} />
        {errors.endDate && <p className="apply-field-error">{errors.endDate}</p>}
      </div>
    </div>
  );
}

export default DateRangeFields;
