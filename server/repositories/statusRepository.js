const Status = require("../models/Status");

const createStatus = (statusData) => Status.create(statusData);
const findStatusById = (id) => Status.findById(id);
const updateStatusById = (id, updateData) => Status.findByIdAndUpdate(id, updateData);

module.exports = {
    createStatus,
    findStatusById,
    updateStatusById
};
