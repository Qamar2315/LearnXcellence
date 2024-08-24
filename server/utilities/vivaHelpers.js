/**
 * Adds a specified number of business days to a given start date.
 * Weekends (Saturday and Sunday) are excluded from the count.
 *
 * @param {Date|string} startDate - The start date from which to add business days. Can be a Date object or a date string.
 * @param {number} numDays - The number of business days to add.
 * @returns {string} - The new date in YYYY-MM-DD format after adding the business days.
 */
function addBusinessDays(startDate, numDays) {
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
    const weekendDays = [6, 0]; // Saturday (6) and Sunday (0)

    const startTimestamp = new Date(startDate).getTime();
    let currentTimestamp = startTimestamp;
    let addedDays = 0;

    while (addedDays < numDays) {
        currentTimestamp += oneDay;
        const currentDate = new Date(currentTimestamp);
        const currentDayOfWeek = currentDate.getDay();

        if (!weekendDays.includes(currentDayOfWeek)) {
            addedDays++;
        }
    }
    
    // Convert back to a date string in YYYY-MM-DD format
    return new Date(currentTimestamp).toISOString().substring(0, 10);
}

/**
 * Generates a unique token for a viva based on the total number of vivas.
 *
 * @param {Array} vivas - An array of viva objects.
 * @returns {number} - The generated viva token.
 */
const generateVivaToken = (vivas) => {
    return vivas.length + 1;
};

/**
 * Determines the next viva date based on the number of existing vivas.
 *
 * @param {Array} vivas - An array of viva objects.
 * @param {Date|string} vivaStartDate - The initial start date for scheduling vivas.
 * @returns {string} - The calculated viva date in YYYY-MM-DD format.
 */
const generateVivaDate = (vivas, vivaStartDate) => {
    if (vivas.length <= 10) {
        return vivaStartDate;
    } else if (vivas.length <= 20) {
        return addBusinessDays(vivaStartDate, 0);
    } else if (vivas.length <= 30) {
        return addBusinessDays(vivaStartDate, 1);
    }
    // Default case if vivas.length > 30
    return addBusinessDays(vivaStartDate, 2);
};

/**
 * Retrieves vivas that are scheduled for today.
 *
 * @param {Array} vivas - An array of viva objects.
 * @returns {Array} - An array of vivas that are scheduled for today.
 */
const getTodayVivas = (vivas) => {
    const today = new Date().toISOString().substring(0, 10);
    const finalVivas = [];

    if (vivas.length === 0) {
        return finalVivas;
    }

    for (const viva of vivas) {
        if (viva.status === 'scheduled' && viva.vivaDate.toISOString().substring(0, 10) === today) {
            finalVivas.push(viva);
        }
    }

    return finalVivas;
};

module.exports = {
    generateVivaToken,
    generateVivaDate,
    getTodayVivas
};
