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

function BruteCheck(str, substr, i, substrLen, array) {
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

function BruteForce(strFile, substrFile) {
    let str = read(strFile);
    if (str == undefined || str == "")
        return undefined;
    let substr = read(substrFile);
    if (substr == undefined || substr == "")
        return undefined;
    let strLen = str.length;
    let substrLen = substr.length;
    let array = [];

    const start = new Date().getTime();
    while (i < strLen - substrLen + 1) {
        j = 0;
        while (str[i + j] == substr[j]) {
            j++;
            if (j == substrLen) {
                array[array.length] = i;
                break;
            }
        }
        i++;
    }
    const end = new Date().getTime();

    if (time == true) console.log(`WorkTime BruteForce: ${end - start}ms`);
    return array;
}

function MakeHash(str, len, whatHashes) {
    let res = 0;
    if (whatHashes == "h1") {
        for (let i = 0; i < len; i++) {
            res += str.charCodeAt(i);
        }
    }
    else if (whatHashes == "h2") {
        for (let i = 0; i < len; i++) {
            res += str.charCodeAt(i) * str.charCodeAt(i);
        }
    }
    else if (whatHashes == "h3") {
        for (let i = 0; i < len; i++) {
            res = res * 2 + str.charCodeAt(i);
        }
    }
    return res;
}

function ChangeHash(hashStr, str, substrLen, i, whatHashes) {
    if (whatHashes == "h1") {
        hashStr += str.charCodeAt(i + substrLen) - str.charCodeAt(i);
    }
    else if (whatHashes == "h2") {
        hashStr += str.charCodeAt(i + substrLen) * str.charCodeAt(i + substrLen)
            - str.charCodeAt(i) * str.charCodeAt(i);
    }
    else if (whatHashes == "h3") {
        hashStr = (hashStr - str.charCodeAt(i) * (Math.pow(2, substrLen-1))) * 2
            + str.charCodeAt(i + substrLen);
    }
    return hashStr;
}

function Hashes(strFile, substrFile, collisionFlag, whatHashes) {
    let str = read(strFile);
    if (str == undefined || str == "")
        return undefined;
    let subStr = read(substrFile);
    if (subStr == undefined || subStr == "")
        return undefined;
    let strLen = str.length;
    let substrLen = subStr.length;
    let array = [];
    let i = 0;
    let collision = 0;
    let arrLen = 0;

    const start = new Date().getTime();
    let hashStr = MakeHash(str, substrLen, whatHashes);
    let hashSubStr = MakeHash(subStr, substrLen, whatHashes);
    while (i < strLen - substrLen + 1) {
        if (hashStr == hashSubStr) {
            arrLen = array.length;
            array = BruteCheck(str, subStr, i, substrLen, array);
            if (arrLen == array.length)
                collision += 1;
            if (howManyEntriesShow == array.length)
                break;
        }
        hashStr = ChangeHash(hashStr, str, substrLen, i, whatHashes);
        i++;
    }
    if (hashStr == hashSubStr && howManyEntriesShow != array.length) {
        arrLen = array.length;
        array = BruteCheck(str, subStr, i, substrLen, array);
        if (arrLen == array.length)
            collision += 1;
    }
    const end = new Date().getTime();

    if (time == true) console.log(`WorkTime ${whatHashes}: ${end - start}ms`);
    if (collisionFlag == true) console.log(`There are ${collision} collisions`);
    return array;
}

let flagsCount = 0;
let howManyEntriesShow;
let time = false;
function CheckFlags() {
    if (arg[2 + flagsCount] == "-c") {
        flagsCount++;
        collisionFlag = true;
        CheckFlags();
    }
    else if (arg[2 + flagsCount] == "-n") {
        howManyEntriesShow = arg[2 + flagsCount + 1];
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
if (mode == "b") {
    resArray = BruteForce(arg[3 + flagsCount], arg[4 + flagsCount]);
}
else if (mode == "h1" || mode == "h2" || mode == "h3") {
    resArray = Hashes(arg[3 + flagsCount], arg[4 + flagsCount], collisionFlag, mode);
}
else
    console.log("You need to choose mode (b, h1, h2, h3)");

if (resArray == undefined) console.log("One of the files is empty or not exit");
else {
    console.log("------First n entries-----");
    if (howManyEntriesShow > resArray.length) howManyEntriesShow = resArray.length;
    for (let i = 0; i < howManyEntriesShow; i++) {
        console.log(`|            ${resArray[i]}           |`);
    }
    console.log("--------------------------");
}