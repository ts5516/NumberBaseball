const GAMESTATE = {
    GAMEPLAY: "gameplay",
    GAMEOVER: "gameover",
    GAMEEND: "gameend"
}

Object.freeze(GAMESTATE);

var numberBaseball = {
    number : '',
    strike : 0,
    ball : 0,
    gamestate : GAMESTATE.GAMEPLAY
}

function PlayGame(){
    const prompt = require("prompt-sync")();
    
    InitPlay();

    while(numberBaseball.gamestate !== GAMESTATE.GAMEEND){
        var input = prompt("숫자 입력: ");
        PlayNumberBaseball(input);

        if(numberBaseball.gamestate === GAMESTATE.GAMEOVER){
            GameOver();
        }
    }
    
}

function InitPlay(){
    numberBaseball.gamestate = GAMESTATE.GAMEPLAY;
    numberBaseball.number = '';
    CreateNumber();
    WriteGameStartScript();
}

function CreateNumber(){
    var numArray = new Array('0','1','2','3','4','5','6','7','8','9');

    Shuffle(numArray);

    for(var i = 0; i<4; i++)
        numberBaseball.number += numArray[i];
}

function Shuffle(array){
    array.sort(() => Math.random() - 0.5);
}

function WriteGameStartScript(){
    console.log("\n숫자야구를 시작합니다!\n");
    console.log("숫자를 입력해주세요!");
    console.log("숫자는 0~9까지 중복되지 않는 4자리 숫자입니다!");
}

function PlayNumberBaseball(input){
    if(IsValidNumber(input)){
        CompareNumber(input);
        ReportcompareResult();
    }
    else{
        console.log("올바르지 않은 입력입니다. 다시 입력해주세요!");
    }
}

function IsValidNumber(num){
    if(!IsValidNumberLength(num))
        return false;
    else if(!IsNumber(num))
        return false;
    else if(!IsRedundancyNumber(num))
        return false;

    return true;
}

function IsValidNumberLength(num){
    return num.length === 4;
}

function IsNumber(num){
    return !(num.match(/[^0-9]/));
}

function IsRedundancyNumber(num){
    const arr = [...num];
    const set = new Set(arr);

    return arr.length === set.size;
}

function CompareNumber(input){
    for(var i = 0; i<4; i++){
        if(numberBaseball.number.indexOf(input[i]) !== -1){
            if(numberBaseball.number[i] === input[i])
                numberBaseball.strike++;
            else
                numberBaseball.ball++;
        }
    }
}

function ReportcompareResult(){
    if(numberBaseball.strike === 0 && numberBaseball.ball === 0)
        console.log("Out");
    else if(numberBaseball.strike === 0)
        console.log(numberBaseball.ball + "B");
    else if(numberBaseball.ball === 0){
        if(numberBaseball.strike === 4){
            console.log("정답입니다!");
            numberBaseball.gamestate = GAMESTATE.GAMEOVER;
        }
        else
            console.log(numberBaseball.strike + "S");
    }
    else
        console.log(numberBaseball.strike + "S " + numberBaseball.ball + "B");
    
    numberBaseball.strike = 0;
    numberBaseball.ball = 0;
}

function GameOver(){
    console.log("게임이 종료되었습니다. 재시작하시겠습니까? (y/n)");
    const prompt = require("prompt-sync")();
    var input = prompt("재시작 여부: ");

    if(input === 'n')
        numberBaseball.gamestate = GAMESTATE.GAMEEND;
    else{
        InitPlay();
    }
}

PlayGame();