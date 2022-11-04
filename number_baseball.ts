import * as readline from 'readline';

/**
 * Report Gamestate
 * @enum {string}
 */
const GAMESTATE = {
    GAMEPLAY: "gameplay",
    GAMEOVER: "gameover",
}

Object.freeze(GAMESTATE);

const numberBaseball = {
    answer: '',
    strike: 0,
    ball: 0,
    gameState: GAMESTATE.GAMEPLAY
}

const readLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function playAndInitGame() {
    numberBaseball.gameState = GAMESTATE.GAMEPLAY;
    numberBaseball.answer = '';
    createNumber();
    writeGameStartScript();
    goToNextTurn();
}

function createNumber() {
    const numArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    numArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < 4; i++) {
        numberBaseball.answer += numArray[i];
    }
}

function writeGameStartScript() {
    console.log("\n숫자야구를 시작합니다!\n");
    console.log("숫자를 입력해주세요!");
    console.log("숫자는 0~9까지 중복되지 않는 4자리 숫자입니다!");
}

function goToNextTurn() {
    if (numberBaseball.gameState === GAMESTATE.GAMEPLAY) {
        eventInputNumber();
    } else if (numberBaseball.gameState === GAMESTATE.GAMEOVER) {
        eventInputRestartOrEnd();
    }
}

function eventInputNumber() {
    readLine.question('숫자 입력: ', function (input) {
        compareToAnswer(input);
        goToNextTurn();
    });
}

function eventInputRestartOrEnd() {
    readLine.question('게임이 종료되었습니다. 재시작하시겠습니까? (y/n)\n',
        function (input) {
            if (input === 'n') {
                readLine.close();
                process.exit();
            } else {
                playAndInitGame();
            }
        });
}

/**
 * @param {string} inputStr inputs received from users
 */
function compareToAnswer(inputStr: string) {
    if (isValidInput(inputStr)) {
        startCompareToAnswer(inputStr);
        reportcompareResult();
    } else {
        console.log("올바르지 않은 입력입니다. 다시 입력해주세요!");
    }
}

/**
 * 
 * @param {string} inputStr inputs received from users
 * @returns {boolean} determine if this is appropriate number for this game
 */
function isValidInput(inputStr: string): boolean {
    if (!isValidInputLength(inputStr)) {
        return false;
    } else if (!isContainOnlyInput(inputStr)) {
        return false;
    } else if (!isRedundancyInput(inputStr)) {
        return false;
    } else {
        return true;
    }
}

/**
 * 
 * @param {string} inputStr inputs received from users
 * @returns {boolean} if param size is 4, return true
 */
function isValidInputLength(inputStr: string): boolean {
    return inputStr.length === 4;
}

/**
 * 
 * @param {string} inputStr inputs received from users
 * @returns {boolean} if param contains only 0~9, return true
 */
function isContainOnlyInput(inputStr: string): boolean {
    return !(inputStr.match(/[^0-9]/));
}

/**
 * 
 * @param {string} inputStr inputs received from users
 * @returns {boolean} if param is redundancy number, return true
 */
function isRedundancyInput(inputStr: string): boolean {
    const arr = [...inputStr];
    const set = new Set(arr);

    return arr.length === set.size;
}

/**
 * 
 * @param {string} inputStr inputs received from users
 */
function startCompareToAnswer(inputStr: string) {
    for (let i = 0; i < numberBaseball.answer.length; i++) {
        if (numberBaseball.answer.indexOf(inputStr[i]) !== -1) {
            if (numberBaseball.answer[i] === inputStr[i]) {
                numberBaseball.strike++;
            } else {
                numberBaseball.ball++;
            }
        }
    }
    console.log(numberBaseball.answer);
}

function reportcompareResult() {
    if (numberBaseball.strike === 0 && numberBaseball.ball === 0) {
        console.log("Out");
    } else if (numberBaseball.strike === 0) {
        console.log(numberBaseball.ball + "B");
    } else if (numberBaseball.ball === 0) {
        if (numberBaseball.strike === numberBaseball.answer.length) {
            console.log("정답입니다!");
            numberBaseball.gameState = GAMESTATE.GAMEOVER;
        } else {
            console.log(numberBaseball.strike + "S");
        }
    } else {
        console.log(numberBaseball.strike + "S " + numberBaseball.ball + "B");
    }

    numberBaseball.strike = 0;
    numberBaseball.ball = 0;
}

playAndInitGame();