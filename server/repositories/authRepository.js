const Account = require('../models/Account');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Otp = require('../models/OtpModel');

const findAccountByEmail = (email) => Account.findOne({ email });
const findStudentByAccountId = (accountId) => Student.findOne({ account: accountId });
const findTeacherByAccountId = (accountId) => Teacher.findOne({ account: accountId });
const createAccount = (email, password) => Account.create({ email, password });
const createStudent = (name, accountId) => Student.create({ name, account: accountId, isGroupLeader: false });
const createTeacher = (name, accountId) => Teacher.create({ name, account: accountId });
const findStudentById = (studentId) => Student.findById(studentId).populate('account');
const findTeacherById = (teacherId) => Teacher.findById(teacherId).populate('account');
const findAccountById = (accountId) => Account.findById(accountId).populate('otp');
const findAccountByIdForNotifications = (accountId) => Account.findById(accountId).populate('notifications');
const updateAccountEmailVerification = (id, isVerified) => Account.findByIdAndUpdate(id, { email_verified: isVerified });
const getExistingOtp = (email) => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    return Otp.findOne({ email, createdAt: { $gt: thirtyMinutesAgo } });
};
const createNewOtp = (otp) => Otp.create({  otp });
const deleteOtp = (id) => Otp.findByIdAndDelete(id);
const setAccountOtpToNull = (accountId) => Account.findByIdAndUpdate(accountId, { otp: null });

module.exports = {
    findAccountByEmail,
    findStudentByAccountId,
    findTeacherByAccountId,
    createAccount,
    createStudent,
    createTeacher,
    findStudentById,
    findTeacherById,
    findAccountById,
    updateAccountEmailVerification,
    getExistingOtp,
    createNewOtp,
    deleteOtp,
    setAccountOtpToNull,
    findAccountByIdForNotifications
};
