var phrase = document.getElementById('userInput');
var conservedPhrase = document.getElementById('conservedPhrase');
var already = document.getElementById('already');
var letter = document.getElementById('letter');
var head = document.getElementById('head');
var body = document.getElementById('body');
var leftArm = document.getElementById('leftArm');
var rightArm = document.getElementById('rightArm');
var leftLeg = document.getElementById('leftLeg');
var rightLeg = document.getElementById('rightLeg');

const buttonClick = new Audio();
const goodLetter = new Audio();
const badLetter = new Audio();
const winSound = new Audio();
const loseSound = new Audio();
const mouseClick = new Audio();
const playAgainSound = new Audio();
const letsGoSound = new Audio();

buttonClick.src = "audio/drawLinesSound.wav";
goodLetter.src = "audio/goodLetter.wav";
badLetter.src = "audio/badLetter.wav";
winSound.src = "audio/winSound.wav";
loseSound.src = "audio/loseSound.wav";
mouseClick.src = "audio/mouseClick.wav";
playAgainSound.src = "audio/playAgainSound.wav";
letsGoSound.src = "audio/letsGoSound.wav";

document.getElementById('background').style.transform = "scale(" + String(window.innerWidth/1536) + ", " + String(window.innerHeight/754) + ")";

function drawLines() {

    if (phrase.value == '') {
        return;
    }

    reset(false);

    var phraseString = removeSpaces(String(phrase.value));

    var phraseLength = phraseString.length;
    var lines = document.querySelector("#lines");

    const phraseArray = phraseString.split('');

    var curWordLength = 0;
    var curLineLength = 0;

    for (let i = 0; i < phraseLength; i++) {

        if (curWordLength + curLineLength >= 12) {
            lines.innerHTML = lines.innerHTML.substring(0, lines.innerHTML.length - 12);
            lines.innerHTML += "<br />";
            curLineLength = 0;
        }

        if (phraseArray[i] == ' ') {

            for (let i = 0; i < curWordLength; i++) {
                lines.innerHTML += ' _ ';
            }

            lines.innerHTML += "&nbsp&nbsp";
            curLineLength += curWordLength + 1;
            curWordLength = 0;

        } else {
            curWordLength++;
        }

    }

    for (let i = 0; i < curWordLength; i++) {
        lines.innerHTML += ' _ ';
    }

    buttonClick.play();

    document.getElementById('conservedPhrase').value = phrase.value;
    document.getElementById('userInput').value = '';
}

function removeSpaces(phrase) {

    var leading = true;
    var space = false;

    var finalPhrase = "";

    for (let i = 0; i < phrase.length; i++) {

        if (phrase.charAt(i) === " " && (leading == true || space == true)) {

        } else if (isLetter(phrase.charAt(i))) {
            finalPhrase += phrase.charAt(i);
            leading = false;
            space = false;
        } else {
            finalPhrase += " ";
            space = true;
        }
    }

    if (!isLetter(finalPhrase.charAt(finalPhrase.length - 1))) {
        finalPhrase = finalPhrase.substring(0, finalPhrase.length - 1);
    }

    return finalPhrase;
}

function guessLetter() {

    var lines = document.querySelector("#lines");

    if (letter.value == '' || lines.innerHTML == '') {
        return;
    }

    var phraseLength = String(conservedPhrase.value).length;
    const phraseArray = String(conservedPhrase.value).split('');

    var safe = false;
    var index = 0;
    var beginning = true;

    for (let i = 0; i < phraseLength; i++) {

        if (phraseArray[i].toUpperCase() == letter.value.toUpperCase() && beginning == true) {
            replaceLetter(letter.value.toUpperCase(), index);
            safe = true;
        } else if (phraseArray[i].toUpperCase() == letter.value.toUpperCase() && beginning == false) {
            replaceLetter(letter.value.toLowerCase(), index);
            safe = true;
        }

        if (isLetter(phraseArray[i])) {
            index++;
            beginning = false;
        } else {
            beginning = true;
        }
    }

    if (safe == false) {
        punish();
    } else {
        if (!checkVictory()) {
            goodLetter.play();
        }
    }

    addToAlready(letter.value.toLowerCase());
    document.getElementById('letter').value = '';
}

function replaceLetter(letter, index) {

    var lines = document.querySelector("#lines");
    var encryptedPhrase = lines.innerText;

    for (let i = 0; i < encryptedPhrase.length; i++) {

        if (index == 0 && encryptedPhrase.charAt(i) == '_') {

            lines.innerText = encryptedPhrase.substring(0, i) + letter + encryptedPhrase.substring(i + 1, encryptedPhrase.length);
            break;

        } else if (encryptedPhrase.charAt(i) == '_' || isLetter(encryptedPhrase.charAt(i))) {
            index--;
        }

    }

}

function isLetter(character) {
    return character.toLowerCase() != character.toUpperCase();
}

function punish() {

    if (window.getComputedStyle(head).display == "none") {
        document.getElementById('head').style = "display:block";
    } else if (window.getComputedStyle(body).display == "none") {
        document.getElementById('body').style = "display:block";
    } else if (window.getComputedStyle(leftArm).display == "none") {
        document.getElementById('leftArm').style = "display:block";
    } else if (window.getComputedStyle(rightArm).display == "none") {
        document.getElementById('rightArm').style = "display:block";
    } else if (window.getComputedStyle(leftLeg).display == "none") {
        document.getElementById('leftLeg').style = "display:block";
    } else {
        document.getElementById('rightLeg').style = "display:block";
        displayLoseScreen();
        return;
    }

    badLetter.play();
}

function checkVictory() {

    var encryptedPhrase = lines.innerText;

    for (let i = 0; i < encryptedPhrase.length; i++) {
        if (encryptedPhrase.charAt(i) == '_') {
            return false;
        }
    }

    displayWinScreen();
    return true;
}

function addToAlready(letter) {

    var already = document.querySelector("#already");
    var alreadyString = already.innerText;

    if (!alreadyString.includes(letter)) {

        if (alreadyString.length == 55 || alreadyString.length == 27) {
            already.innerHTML += "<br />&nbsp" + letter + "&nbsp";
        } else {
            already.innerHTML += "&nbsp" + letter + "&nbsp";
        }
    }
}

function blurBackground() {
    var blur = document.getElementById('background');
    blur.classList.toggle('active');
}

function displayWinScreen() {
    blurBackground();
    document.getElementById('winScreen').style = "visibility: visible";
    winSound.play();
}

function displayLoseScreen() {
    blurBackground();
    document.getElementById('loseScreen').style = "visibility: visible";
    loseSound.play();
}

function reset(fullReset) {

    if (fullReset == true) {
        blurBackground();
        document.getElementById('winScreen').style = "visibility: hidden";
        document.getElementById('loseScreen').style = "visibility: hidden";
        playAgainSound.play();
    }

    document.getElementById('head').style = "display:none";
    document.getElementById('body').style = "display:none";
    document.getElementById('leftArm').style = "display:none";
    document.getElementById('rightArm').style = "display:none";
    document.getElementById('leftLeg').style = "display:none";
    document.getElementById('rightLeg').style = "display:none";
    lines.innerHTML = '';
    already.innerHTML = '';
}

function alphaOnly(event) {
    var key = event.keyCode;
    return ((key >= 65 && key <= 90) || (key >= 97 && key <= 122) || key == 8 || key == 32);
}

function alphaOnlyNoSpaces(event) {
    var key = event.keyCode;
    return ((key >= 65 && key <= 90) || (key >= 97 && key <= 122) || key == 8);
}

function displayHowToPlay() {
    blurBackground();
    document.getElementById('howToPlayScreen').style = "visibility: visible";
    document.getElementById('howToPlayScreen').style.transform = "scale(" + window.innerWidth/1536 + ", " + window.innerHeight/754 + ")";
    mouseClick.play();
}

function startGame() {
    blurBackground();
    document.getElementById('howToPlayScreen').style = "visibility: hidden";
    letsGoSound.play();
}