const Status = require("../models/Status");

const createStatus = (statusData) => Status.create(statusData);
const findStatusById = (id) => Status.findById(id);
const updateStatusById = (id, updateData) => Status.findByIdAndUpdate(id, updateData, { new: true });
// Delete a status by ID
const deleteStatus = (id) => Status.findByIdAndDelete(id);

module.exports = {
    createStatus,
    findStatusById,
    updateStatusById,
    deleteStatus
};
