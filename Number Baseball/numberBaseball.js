import promptSync from 'prompt-sync';

/**
 * Report Gamestate
 * @enum {string}
 */
const GAMESTATE = {
    GAMEPLAY: "gameplay",
    GAMEOVER: "gameover",
    GAMEEND: "gameend"
}

Object.freeze(GAMESTATE);

const numberBaseball = {
    number: '',
    strike: 0,
    ball: 0,
    gameState: GAMESTATE.GAMEPLAY
}

export function playGame() {
    const prompt = promptSync();

    initPlay();

    while (numberBaseball.gameState !== GAMESTATE.GAMEEND) {
        const input = prompt("숫자 입력: ");
        playNumberBaseball(input);

        if (numberBaseball.gameState === GAMESTATE.GAMEOVER) {
            gameOver();
        }
    }
}

function initPlay() {
    numberBaseball.gameState = GAMESTATE.GAMEPLAY;
    numberBaseball.number = '';
    createNumber();
    writeGameStartScript();
}

function createNumber() {
    const numArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    numArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < 4; i++) {
        numberBaseball.number += numArray[i];
    }
}

function writeGameStartScript() {
    console.log("\n숫자야구를 시작합니다!\n");
    console.log("숫자를 입력해주세요!");
    console.log("숫자는 0~9까지 중복되지 않는 4자리 숫자입니다!");
}

/**
 * @param {string} input inputs received from users
 */
function playNumberBaseball(input) {
    if (isValidNumber(input)) {
        compareNumber(input);
        reportcompareResult();
    } else {
        console.log("올바르지 않은 입력입니다. 다시 입력해주세요!");
    }
}

/**
 * 
 * @param {string} num inputs received from users
 * @returns {boolean} determine if this is appropriate number for this game
 */
function isValidNumber(num) {
    if (!isValidNumberLength(num)) {
        return false;
    } else if (!isContainOnlyNumber(num)) {
        return false;
    } else if (!isRedundancyNumber(num)) {
        return false;
    } else {
        return true;
    }
}

/**
 * 
 * @param {string} num inputs received from users
 * @returns {boolean} if param size is 4, return true
 */
function isValidNumberLength(num) {
    return num.length === 4;
}

/**
 * 
 * @param {string} num inputs received from users
 * @returns {boolean} if param contains only 0~9, return true
 */
function isContainOnlyNumber(num) {
    return !(num.match(/[^0-9]/));
}

/**
 * 
 * @param {string} num inputs received from users
 * @returns {boolean} if param is redundancy number, return true
 */
function isRedundancyNumber(num) {
    const arr = [...num];
    const set = new Set(arr);

    return arr.length === set.size;
}

/**
 * 
 * @param {string} input inputs received from users
 */
function compareNumber(input) {
    for (let i = 0; i < numberBaseball.number.length; i++) {
        if (numberBaseball.number.indexOf(input[i]) !== -1) {
            if (numberBaseball.number[i] === input[i]) {
                numberBaseball.strike++;
            } else {
                numberBaseball.ball++;
            }
        }
    }
}

function reportcompareResult() {
    if (numberBaseball.strike === 0 && numberBaseball.ball === 0) {
        console.log("Out");
    } else if (numberBaseball.strike === 0) {
        console.log(numberBaseball.ball + "B");
    } else if (numberBaseball.ball === 0) {
        if (numberBaseball.strike === numberBaseball.number.length) {
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

function gameOver() {
    console.log("게임이 종료되었습니다. 재시작하시겠습니까? (y/n)");
    const prompt = promptSync();
    const input = prompt("재시작 여부: ");

    if (input === 'n') {
        numberBaseball.gameState = GAMESTATE.GAMEEND;
    } else {
        initPlay();
    }
}

playGame();