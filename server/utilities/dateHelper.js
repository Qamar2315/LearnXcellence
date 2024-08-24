/**
 * Parses a date string in the format "MM/DD/YYYY" and returns a Date object.
 *
 * @param {string} dateString - The date string to be parsed, in the format "MM/DD/YYYY".
 * @returns {Date} - A Date object representing the parsed date.
 */
const parseDate = (dateString) => {
  // Split the date string into an array of [month, day, year] and convert each to a number
  const [month, day, year] = dateString.split("/").map(Number);

  // Create a new Date object
  // Note: JavaScript's Date constructor expects the month to be 0-indexed (i.e., January is 0)
  // The day is incremented by 1 due to the way Date handles date overflow internally
  return new Date(year, month - 1, day);
};

module.exports = {
  parseDate,
};
