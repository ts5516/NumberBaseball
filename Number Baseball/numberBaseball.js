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
    gamestate: GAMESTATE.GAMEPLAY
}

exports = { GAMESTATE, numberBaseball };

export function PlayGame() {
    const prompt = require("prompt-sync")();

    InitPlay();

    while (numberBaseball.gamestate !== GAMESTATE.GAMEEND) {
        const input = prompt("숫자 입력: ");
        PlayNumberBaseball(input);

        if (numberBaseball.gamestate === GAMESTATE.GAMEOVER) GameOver();
    }

}

function InitPlay() {
    numberBaseball.gamestate = GAMESTATE.GAMEPLAY;
    numberBaseball.number = '';
    CreateNumber();
    WriteGameStartScript();
}

function CreateNumber() {
    const numArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    numArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < 4; i++) {
        numberBaseball.number += numArray[i];
    }
}

function WriteGameStartScript() {
    console.log("\n숫자야구를 시작합니다!\n");
    console.log("숫자를 입력해주세요!");
    console.log("숫자는 0~9까지 중복되지 않는 4자리 숫자입니다!");
}

/**
 * @param {string} input inputs received from users
 */
function PlayNumberBaseball(input) {
    if (IsValidNumber(input)) {
        CompareNumber(input);
        ReportcompareResult();
    } else {
        console.log("올바르지 않은 입력입니다. 다시 입력해주세요!");
    }
}

/**
 * 
 * @param {string} num inputs received from users
 * @returns {boolean} determine if this is appropriate number for this game
 */
function IsValidNumber(num) {
    if (!IsValidNumberLength(num)) {
        return false;
    } else if (!IsContainOnlyNumber(num)) {
        return false;
    } else if (!IsRedundancyNumber(num)) {
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
function IsValidNumberLength(num) {
    return num.length === 4;
}

/**
 * 
 * @param {string} num inputs received from users
 * @returns {boolean} if param contains only 0~9, return true
 */
function IsContainOnlyNumber(num) {
    return !(num.match(/[^0-9]/));
}

/**
 * 
 * @param {string} num inputs received from users
 * @returns {boolean} if param is redundancy number, return true
 */
function IsRedundancyNumber(num) {
    const arr = [...num];
    const set = new Set(arr);

    return arr.length === set.size;
}

/**
 * 
 * @param {string} input inputs received from users
 */
function CompareNumber(input) {
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

function ReportcompareResult() {
    if (numberBaseball.strike === 0 && numberBaseball.ball === 0) {
        console.log("Out");
    } else if (numberBaseball.strike === 0) {
        console.log(numberBaseball.ball + "B");
    } else if (numberBaseball.ball === 0) {
        if (numberBaseball.strike === numberBaseball.number.length) {
            console.log("정답입니다!");
            numberBaseball.gamestate = GAMESTATE.GAMEOVER;
        } else {
            console.log(numberBaseball.strike + "S");
        }
    } else {
        console.log(numberBaseball.strike + "S " + numberBaseball.ball + "B");
    }

    numberBaseball.strike = 0;
    numberBaseball.ball = 0;
}

function GameOver() {
    console.log("게임이 종료되었습니다. 재시작하시겠습니까? (y/n)");
    const prompt = require("prompt-sync")();
    const input = prompt("재시작 여부: ");

    if (input === 'n') {
        numberBaseball.gamestate = GAMESTATE.GAMEEND;
    } else {
        InitPlay();
    }
}

PlayGame();