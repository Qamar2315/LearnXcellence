const asyncHandler = require("../utilities/CatchAsync");
const vivaService = require("../services/vivaService");

const addViva = asyncHandler(async (req, res) => {
  const { courseId, projectId } = req.params;
  const viva = await vivaService.addViva(courseId, projectId);
  res.status(201).json({
    success: true,
    message: "Viva added successfully",
    data: viva,
  });
});

const updateViva = asyncHandler(async (req, res) => {
  const { vivaId } = req.params;
  const updatedViva = await vivaService.updateViva(vivaId, req.body);
  res.status(201).json({
    success: true,
    message: "Viva updated successfully",
    data: updatedViva,
  });
});

const sendViva = asyncHandler(async (req, res) => {
  const { vivaId } = req.params;
  const viva = await vivaService.sendViva(vivaId);
  res.status(201).json({
    success: true,
    message: "Viva sent successfully",
    data: viva,
  });
});

const getTodaysViva = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const vivas = await vivaService.getTodaysViva(courseId);
  res.status(201).json({
    success: true,
    message: "Today's vivas fetched successfully",
    data: vivas,
  });
});

const getAllVivas = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const vivas = await vivaService.getAllVivas(courseId);
  res.status(201).json({
    success: true,
    message: "All vivas fetched successfully",
    data: vivas,
  });
});

const generateVivaQuestions = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { numberOfQuestions, difficulty, questionType } = req.query;
  
    const questions = await vivaService.generateVivaQuestions(
      projectId,
      numberOfQuestions,
      difficulty,
      questionType
    );
  
    res.status(200).json({
      success: true,
      message: "Viva Questions Generated",
      data: questions,
    });
  });
  

module.exports = {
  addViva,
  updateViva,
  sendViva,
  getTodaysViva,
  getAllVivas,
  generateVivaQuestions
};
