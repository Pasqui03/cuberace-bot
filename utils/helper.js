function convertStringTimeToNumber(str) {
    arr = str.split(":");
    arr.reverse();
    seconds = Number(arr[0]);
    for (let i = 1; i < arr.length; i++) {
        seconds += Number(arr[i]) * (60 * i);
    }
    return seconds;
}

function isAvgDNF(avg) {
    let count = 0;
    avg.forEach(attempt => {
        if (attempt === "DNF") {
            count++;
        }
    })
    return count >= 2;
}

function convertNumberToStringTime(time) {
    const date = new Date(null);
    date.setMilliseconds(time * 1000);
    return date.toISOString().substr(11, 11).replace(/^[0:]*(?!\.)/g, '');
}

module.exports = {
    convertStringTimeToNumber,
    isAvgDNF,
    convertNumberToStringTime
}