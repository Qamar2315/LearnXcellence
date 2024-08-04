const generateCourseCode=(arr)=> {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    for (let i = 0; i < 9; i++) {
      randomString += characters[Math.floor(Math.random() * characters.length)];
    }
    for(let i of arr){
        if(i.classId === randomString){
            generateClassCode(arr)
        }
    }
    return randomString;
}
module.exports={
    generateCourseCode
}