const ProctoringReport = require('../models/ProctoringReport');

const createProctoringReport = async (reportData) => {
    return await ProctoringReport.create(reportData);
};

module.exports = {
    createProctoringReport,
};
