const vivaRepository = require('../repositories/vivaRepository');
const AppError = require('../utilities/AppError');
const { generateVivaToken, generateVivaDate, getTodayVivas } = require('../utilities/vivaHelpers');

const addViva = async (courseId, projectId) => {
    const project = await vivaRepository.findProjectById(projectId);
    if (!project) throw new AppError("Project Not Found", 400);
    if (project.status.status != 'approved') throw new AppError("Project Is Not Approved", 400);

    const existingViva = await vivaRepository.findVivaByProjectId(project._id);
    if (existingViva) throw new AppError("Viva Of This Project Already Added", 400);

    const getCourse = await vivaRepository.findCourseById(courseId);
    if (!getCourse) throw new AppError("Course Not Found", 400);
    await getCourse.populate('vivas');

    if (!getCourse.vivaStartDate) throw new AppError("Viva Start Date Not Set", 400);

    const vivaDate = generateVivaDate(getCourse.vivas, getCourse.vivaStartDate);
    const tokenNumber = generateVivaToken(getCourse.vivas);

    const viva = await vivaRepository.createViva({
        project,
        tokenNumber,
        status: 'scheduled',
        dateCreated: new Date().toISOString().substring(0, 10),
        currentStatus: 'waiting',
        vivaDate
    });

    project.viva = viva;
    await vivaRepository.saveProject(project);

    getCourse.vivas.push(viva);
    await vivaRepository.saveCourse(getCourse);

    return {
        _id: viva._id,
        project: viva.project,
        tokenNumber: viva.tokenNumber,
        status: viva.status,
        currentStatus: viva.currentStatus,
        vivaDate: viva.vivaDate
    };
};

const updateViva = async (vivaId, updateData) => {
    const viva = await vivaRepository.findVivaById(vivaId);
    if (!viva) throw new AppError("Viva Not Found", 400);

    await vivaRepository.updateViva(vivaId, updateData);
};

const sendViva = async (vivaId) => {
    const viva = await vivaRepository.findVivaById(vivaId);
    if (!viva) throw new AppError("Viva Not Found", 400);

    return {
        _id: viva._id,
        project: viva.project,
        tokenNumber: viva.tokenNumber,
        status: viva.status,
        currentStatus: viva.currentStatus,
        vivaDate: viva.vivaDate
    };
};

const getTodaysViva = async (courseId) => {
    const getCourse = await vivaRepository.findCourseById(courseId);
    if (!getCourse) throw new AppError("Course Not Found", 400);

    const vivas = getTodayVivas(getCourse.vivas);
    if (vivas.length === 0) throw new AppError("No Vivas For Today", 400);

    return vivas;
};

module.exports = {
    addViva,
    updateViva,
    sendViva,
    getTodaysViva
};
