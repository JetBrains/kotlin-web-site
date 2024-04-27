export function formatDate(startDate, endDate) {
  const startYear = startDate.getFullYear();
  const startMonth = startDate.toLocaleString('en-us', { month: 'long' });
  const startDay = startDate.getDate();
  const endYear = endDate.getFullYear();
  const endMonth = endDate.toLocaleString('en-us', { month: 'long' });
  const endDay = endDate.getDate();

  if (
    startYear !== endYear ||
    startMonth !== endMonth ||
    startDay !== endDay
  ) {
    // Format for date range
    let formatted = `${startMonth} ${startDay}-${endMonth} ${endDay}`;
    if (startYear !== endYear) {
      formatted += `, ${endYear}`;
    }
    return formatted;
  } else {
    // Format for single date
    let formatted = `${startMonth} ${startDay}`;
    if (startYear !== new Date().getFullYear()) {
      formatted += `, ${startYear}`;
    }
    return formatted;
  }
}
