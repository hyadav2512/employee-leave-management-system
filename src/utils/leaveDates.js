export function calculateWorkingDays(startDate, endDate) {
  if (!startDate || !endDate || startDate > endDate) return 0;
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  let days = 0;

  for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const weekday = date.getDay();
    if (weekday !== 0 && weekday !== 6) days += 1;
  }
  return days;
}

export function getToday() {
  return new Date().toISOString().slice(0, 10);
}
