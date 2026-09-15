// A 'YYYY-MM-DD' string parses as UTC midnight, so the formatters read UTC too — otherwise a
// build machine west of Greenwich renders the previous day.
const dayFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const monthFormat = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

/** '2026-07-16' -> 'Jul 16' */
export const formatMeetupDay = (isoDate: string): string => dayFormat.format(new Date(isoDate));

/** '2026-07-16' -> 'July 2026' */
export const formatMeetupMonth = (isoDate: string): string => monthFormat.format(new Date(isoDate));
