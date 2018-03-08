export function formatDate(startDate, endDate) {
  let formatted = '';
  let year, month, day;
  const isRange = startDate.getTime() !== endDate.getTime();
  const nowYear = new Date().getFullYear();

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  if (isRange) {
    month = [
      months[startDate.getMonth()],
      months[endDate.getMonth()]
    ];
    year = [startDate.getFullYear(), endDate.getFullYear()];
    day = [startDate.getDate(), endDate.getDate()];

    if (month[0] !== month[1]) {
      formatted = month[0] + ' ' + day[0] + '-' + month[1] + ' ' + day[1];
    } else {
      formatted = month[0] + ' ' + day[0] + '-' + day[1];
    }

    if (year[0] !== nowYear || year[1] !== nowYear) {
      formatted += ', ' + year[1];
    }
  }
  else {
    year = startDate.getFullYear();
    month = months[startDate.getMonth()];
    day = startDate.getDate();

    formatted = month + ' ' + day;
    if (year !== nowYear) {
      formatted += ', ' + year;
    }
  }

  return formatted;
}