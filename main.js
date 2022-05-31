const fs = require('fs');

const PATH_TO_WORDS_FILE = 'words.txt';
const VOWELS = ['a', 'e', 'i', 'o', 'u'];

async function main() {
    const word = pickAWord();
    const usedLetters = [];
    let hiddenWord = '';
    let attempts = 3;

    console.log("===== STARTING HANGMAN GAME =====");
    await sleep(1500);
    console.log('> ✳️ Picking a random word ...');
    await sleep(1500);
    console.log('> ✳️ Check for vowels(A E I O U) ...');
    await sleep(1500);

    const letters = word.split("");
    for (let i = 0; i < letters.length; i++) {
        if (VOWELS.includes(letters[i])) {
            hiddenWord += `${letters[i].toUpperCase()}`;
        } else {
            hiddenWord += '_';
        }
    }
    console.log(`> ✳️ The word is:\n🔰\t${hiddenWord}\t🔰 \n${word}`);
    console.log(`> ✳️ You have ${attempts} attempts.`);
    console.log("*** 🚀 LET'S BEGIN 🚀 ***");
    await sleep(1000);

    const playTheGame = (attempts) => {
        const playerInput = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        if (attempts > 0) {
            if (attempts == 1) console.log("> ⚠️ Last chance, be careful!")
            playerInput.question("Enter a letter: \n> ", (letter) => {
                if (checkLetter(letter, word)) {
                    console.log(`\n✅ VALID LETTER! ATTEMPTS: ${attempts} / 10`);

                    letters.forEach((ltr, index) => {
                        if (ltr === letter) {
                            hiddenWord = hiddenWord.split("");
                            hiddenWord[index] = letter.toUpperCase();
                            hiddenWord = hiddenWord.join("");
                        }
                    });
                    console.log(`🔰\t${hiddenWord}\t🔰`);
                    playerInput.close();
                    playTheGame(attempts);
                } else {
                    attempts -= 1;
                    console.log(`\n❌ INVALID LETTER! ATTEMPTS: ${attempts} / 10`)
                    console.log(`🔰\t${hiddenWord}\t🔰`);
                    playerInput.close();

                    playTheGame(attempts);
                }
            });
        } else {
            console.log(`⚫☢️  GAME OVER, YOU DIED ! ⚰️ 🚑`)
            playerInput.close();
        }
    }

    playTheGame(attempts);
};


function pickAWord() {
    try {
        const words = fs.readFileSync(PATH_TO_WORDS_FILE, 'utf-8').split('\r\n');
        return words[Math.floor(Math.random() * words.length)];
    } catch (e) {
        console.error(e);
    }
}

function checkLetter(letter, word) {
    const letters = word.split("");

    return true ? letters.includes(letter) : false
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main();