const parseDate = (dateString) => {
  const [month, day, year] = dateString.split("/").map(Number);
  return new Date(year, month, day+1); // month is 0-indexed
};

module.exports = {
  parseDate,
};
