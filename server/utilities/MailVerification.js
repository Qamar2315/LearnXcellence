module.exports.verifyTeacherEmail=(email)=>{
    const regex = /[a-zA-Z0-9._%+-]+@faculty\.comsats\.edu\.pk/;
    return regex.test(email);
}

module.exports.verifyStudentEmail=(email)=>{
    const regex = /[a-zA-Z0-9._%+-]+@isbstudent\.comsats\.edu\.pk/;
    return regex.test(email);
}