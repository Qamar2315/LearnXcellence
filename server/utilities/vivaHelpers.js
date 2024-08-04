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
    return new Date(currentTimestamp).toISOString.toISOString().substring(0, 10);
}

const generateVivaToken=(vivas)=>{
    return vivas.length+1
}
const generateVivaDate=(vivas,vivaStartDate)=>{
    if(vivas.length<=10){
        return vivaStartDate;
    }else if(vivas.length<=20){
        return addBusinessDays(vivaStartDate,0);
    }else if(vivas.length<=30){
        return addBusinessDays(vivaStartDate,1);
    }
}
const getTodayVivas=(vivas)=>{
    const today = new Date().toISOString().substring(0, 10);
    let finalVivas=[]
    if(vivas.length==0){
        return finalVivas;
    }
    for(let viva of vivas){
        if(viva.status=='scheduled'){
            if(viva.vivaDate.toISOString().substring(0, 10) == today){
                finalVivas.push(viva);
            }
        }
    }
    return finalVivas;
}

module.exports={
    generateVivaToken,
    generateVivaDate,
    getTodayVivas
}