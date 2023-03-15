let fs = require('fs');
let arg = process.argv;
let i = 0;
let collisionFlag = false;

function read(inFile) {
    try {
        inText = fs.readFileSync(inFile, "utf-8");
        return inText;
    }
    catch (e) {
        return undefined;
    }
}

function CheckMatchBrute(str, substr, i, substrLen, array) {
    // Проверяет совпадение строк, посимвольным сравнением. 
    let j = 0;
    while (str[i + j] == substr[j]) {
        j++;
        if (j == substrLen) {
            array[array.length] = i;
            break;
        }
    }

    return array;
}

function StringSearchBruteForce(str, substr) {
    // Вычисляет массив индексов вхождений подстроки в строку, используя метод грубой силы.
    let strLen = str.length;
    let substrLen = substr.length;
    let array = [];

    const start = new Date().getTime();
    while (i < strLen - substrLen + 1) {
        array = CheckMatchBrute(str, substr, i, substrLen, array)
        i++;
    }
    const end = new Date().getTime();

    if (time == true) console.log(`WorkTime BruteForce: ${end - start}ms`);
    return array;
}

function MakeHash(str, len, hashType) {
    let res = 0;
    if (hashType == "h1") {
        for (let i = 0; i < len; i++) {
            res += str.charCodeAt(i);
        }
    }
    else if (hashType == "h2") {
        for (let i = 0; i < len; i++) {
            res += str.charCodeAt(i)**2;
        }
    }
    else if (hashType == "h3") {
        for (let i = 0; i < len; i++) {
            res = 2 * res + str.charCodeAt(i);
        }
    }
    return res;
}

function UpdateHash(hashStr, str, substrLen, i, hashType) {
    // Сдвигает скользащее окно хэша на 1 в право.
    if (hashType == "h1") {
        hashStr += str.charCodeAt(i + substrLen) - str.charCodeAt(i);
    }
    else if (hashType == "h2") {
        hashStr += str.charCodeAt(i + substrLen)**2 - str.charCodeAt(i)**2;
    }
    else if (hashType == "h3") {
        hashStr = 2 * (hashStr - str.charCodeAt(i) * (Math.pow(2, substrLen-1)))
            + str.charCodeAt(i + substrLen);
    }
    return hashStr;
}

function StringSearchWithHashes(str, substr, collisionFlag, hashType) {
    // Вычисляет массив индексов вхождений подстроки в строку, используя хеширование.
    let strLen = str.length;
    let substrLen = substr.length;
    let array = [];
    let i = 0;
    let collision = 0;
    let prevArrLen = 0;

    const start = new Date().getTime();
    let hashStr = MakeHash(str, substrLen, hashType);
    let hashSubStr = MakeHash(substr, substrLen, hashType);
    while (i < strLen - substrLen + 1) {
        if (hashStr == hashSubStr) {
            prevArrLen = array.length;
            array = CheckMatchBrute(str, substr, i, substrLen, array);
            if (prevArrLen == array.length)
                collision += 1;
            if (countOfEntries == array.length)
                break;
        }
        hashStr = UpdateHash(hashStr, str, substrLen, i, hashType);
        i++;
    }
    if (hashStr == hashSubStr && countOfEntries != array.length) {
        prevArrLen = array.length;
        array = CheckMatchBrute(str, substr, i, substrLen, array);
        if (prevArrLen == array.length)
            collision += 1;
    }
    const end = new Date().getTime();

    if (time == true) console.log(`WorkTime ${hashType}: ${end - start}ms`);
    if (collisionFlag == true) console.log(`There are ${collision} collisions`);
    return array;
}

let flagsCount = 0;
let countOfEntries;
let time = false;
function CheckFlags() {
    // Обрабатывает опциональные параметры командной строки
    if (arg[2 + flagsCount] == "-c") {
        flagsCount++;
        collisionFlag = true;
        CheckFlags();
    }
    else if (arg[2 + flagsCount] == "-n") {
        countOfEntries = arg[2 + flagsCount + 1];
        flagsCount++;
        flagsCount++;
        CheckFlags();
    }
    else if (arg[2 + flagsCount] == "-t") {
        flagsCount++;
        time = true;
        CheckFlags();
    }
}
CheckFlags();
let mode = arg[2 + flagsCount];
let resArray = [];

if (mode != "h1" && mode != "h2" && mode != "h3" && mode != "b"){
    console.log("You need to choose mode (b, h1, h2, h3)");
}
else {
    let str = read(arg[3 + flagsCount]);
    let substr = read(arg[4 + flagsCount]);
    if (str == undefined || str == "" || substr == undefined || substr == "")
        resArray = undefined;
    else
        resArray = mode == "b" 
            ? StringSearchBruteForce(str, substr) 
            : StringSearchWithHashes(str, substr, collisionFlag, mode)
}

if (resArray == undefined) console.log("One of the files is empty or not exit");
else {
    console.log("------First n entries-----");
    if (countOfEntries > resArray.length) countOfEntries = resArray.length;
    for (let i = 0; i < countOfEntries; i++) {
        console.log(`|            ${resArray[i]}           |`);
    }
    console.log("--------------------------");
}