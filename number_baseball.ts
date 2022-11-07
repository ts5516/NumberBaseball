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

class NumberBaseball {
    readonly NUM_LEN: number = 4;

    private number: string;
    private strike: number;
    private ball: number;
    gameState: string;

    constructor() {
        this.number = '';
        this.strike = 0;
        this.ball = 0;
        this.gameState = GAMESTATE.GAMEPLAY;
    }

    generateNumber() {
        const numArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        numArray.sort(() => Math.random() - 0.5);
        this.number = '';

        for (let i = 0; i < 4; i++) {
            this.number += numArray[i];
        }
    }

    initStrikeAndBall() {
        this.strike = 0;
        this.ball = 0;
    }

    addStrike() {
        this.strike++;
    }

    addBall() {
        this.ball++;
    }

    getStrike() {
        return this.strike;
    }

    getBall() {
        return this.ball;
    }

    getNumber() {
        return this.number;
    }
}

const readLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function playGame() {
    let numberBaseball = initGame();

    do {
        const inputStr = await input(numberBaseball);
        numberBaseball = update(inputStr, numberBaseball);
        render(numberBaseball);
    } while (numberBaseball.gameState !== GAMESTATE.GAMEOVER);

    gameEnd();
}

function initGame() {
    writeGameStartScript();

    const nb = new NumberBaseball();
    return nb;
}

function input(numberBaseball: NumberBaseball) {
    let questionText = '';

    if (numberBaseball.getStrike() === numberBaseball.NUM_LEN) {
        questionText = '게임이 종료되었습니다. 재시작하시겠습니까? (y/n)\n';
    } else {
        questionText = '숫자 입력: ';
    }

    return new Promise((resolve) => {
        readLine.question(questionText, (inputStr) => resolve(inputStr));
    })
}

function update(inputStr: any, numberBaseball: NumberBaseball) {
    if (numberBaseball.getNumber() === '')
        numberBaseball.generateNumber();

    if (numberBaseball.getStrike() === numberBaseball.NUM_LEN) {
        return doRestartOrEnd(inputStr, numberBaseball);
    } else {
        return doCompareAnswer(inputStr, numberBaseball);
    }
}

function doRestartOrEnd(inputStr: string, numberBaseball: NumberBaseball) {
    if (inputStr === 'n') {
        numberBaseball.gameState = GAMESTATE.GAMEOVER;
        return numberBaseball;
    } else {
        return initGame();
    }
}

function doCompareAnswer(inputStr: string, numberBaseball: NumberBaseball) {
    if (isValidInput(inputStr)) {
        compareToAnswer(inputStr, numberBaseball);
    } else {
        console.log("올바르지 않은 입력입니다. 다시 입력해주세요!");
    }

    return numberBaseball;
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
function compareToAnswer(inputStr: string, numberBaseball: NumberBaseball) {
    numberBaseball.initStrikeAndBall();

    for (let i = 0; i < numberBaseball.NUM_LEN; i++) {
        if (numberBaseball.getNumber().indexOf(inputStr[i]) !== -1) {
            if (numberBaseball.getNumber()[i] === inputStr[i]) {
                numberBaseball.addStrike();
            } else {
                numberBaseball.addBall();
            }
        }
    }
    console.log(numberBaseball.getNumber());
}

function render(numberBaseball: NumberBaseball) {
    if (numberBaseball.getNumber() !== '' &&
        numberBaseball.gameState !== GAMESTATE.GAMEOVER) {
        reportcompareResult(numberBaseball);
    }
}

function writeGameStartScript() {
    console.log("\n숫자야구를 시작합니다!\n");
    console.log("숫자를 입력해주세요!");
    console.log("숫자는 0~9까지 중복되지 않는 4자리 숫자입니다!");
}

function reportcompareResult(numberBaseball: NumberBaseball) {
    if (numberBaseball.getStrike() === 0 && numberBaseball.getBall() === 0) {
        console.log("Out");
    } else if (numberBaseball.getStrike() === 0) {
        console.log(numberBaseball.getBall() + "B");
    } else if (numberBaseball.getBall() === 0) {
        if (numberBaseball.getStrike() === numberBaseball.NUM_LEN) {
            console.log("정답입니다!");
        } else {
            console.log(numberBaseball.getStrike() + "S");
        }
    } else {
        console.log(numberBaseball.getStrike() + "S " + numberBaseball.getBall() + "B");
    }
}

function gameEnd() {
    readLine.close();
    process.exit(1);
}

playGame();