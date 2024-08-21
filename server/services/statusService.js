const statusRepository = require("../repositories/statusRepository");
const projectRepository = require("../repositories/projectRepository");
const AppError = require("../utilities/AppError");

const addStatus = async (classId, projectId, statusData) => {
  const project = await projectRepository.findProjectByIdAndCourse(
    projectId,
    classId
  );
  if (!project) {
    throw new AppError("Project Not Found", 400);
  }
  if (project.viva) {
    throw new AppError("Viva Is Scheduled So Can't Add Status Now", 400);
  }
  if (project.status) {
    throw new AppError("Status Already Exists", 400);
  }
  const status = await statusRepository.createStatus(statusData);
  if (!status) {
    throw new AppError("Not Saved due To Some Internal Error", 400);
  }
  project.status = status;
  await project.save();
  return {
    _id: status._id,
    status: status.status,
    description: status.description,
  };
};

const updateStatus = async (statusId, statusData) => {
  const status = await statusRepository.findStatusById(statusId);
  if (!status) {
    throw new AppError("Status Not Found", 400);
  }
  const updatedStatus = await statusRepository.updateStatusById(
    statusId,
    statusData
  );
    if (!updatedStatus) {
        throw new AppError("Not Updated due To Some Internal Error", 400);
    }
    return {
        _id: updatedStatus._id,
        status: updatedStatus.status,
        description: updatedStatus.description,
    };
};

const getStatusById = async (statusId) => {
  const status = await statusRepository.findStatusById(statusId);
  if (!status) {
    throw new AppError("Status Not Found", 400);
  }
  return {
    _id: status._id,
    status: status.status,
    description: status.description,
  };
};

module.exports = {
  addStatus,
  updateStatus,
  getStatusById,
};
