const fs = require('fs');

const PATH_TO_WORDS_FILE = 'words.txt';
const VOWELS = ['A', 'E', 'I', 'O', 'U'];

async function main() {
    const word = pickAWord();
    let usedLetters = [];
    let hiddenWord = '';
    let attempts = 5;

    console.log("===== STARTING HANGMAN GAME =====");
    await sleep(1500);
    console.log('> ✳️  Picking a random word ...');
    await sleep(1500);
    console.log('> ✳️  Check for vowels (A E I O U) ...');
    await sleep(1500);

    const letters = word.split("");
    for (let i = 0; i < letters.length; i++) {
        if (VOWELS.includes(letters[i])) {
            hiddenWord += `${letters[i].toUpperCase()}`;
        } else {
            hiddenWord += '_';
        }
    };
    usedLetters = [...VOWELS];

    console.log(`> ✳️  The word is:\n🔰\t${hiddenWord}\n`);
    console.log(`> ✳️  You have ${attempts} attempts.`);
    console.log("*** 🚀 LET'S BEGIN 🚀 ***");
    await sleep(1000);

    const playTheGame = (attempts) => {
        const playerInput = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        if (attempts > 0) {
            if (attempts == 1) console.log("> ⚠️  YOU HAVE ONE MORE ATTEMPT, be careful!");
            if (!hiddenWord.includes('_')) {
                console.log(`\n🎉CONGRATULATIONS, YOU WIN! 🥳`);
                playerInput.close();

                return checkToPlayAgain();
            }
            playerInput.question("\nEnter a letter: \n> ", (letter) => {
                console.clear();
                console.log(`> ${letter}`);

                if (!letter || typeof letter !== 'string') {
                    console.log(`\n❌ Please enter a valid LETTER ...`);
                    playerInput.close();

                    return playTheGame(attempts);
                }
                letter = letter.toUpperCase();

                if (hiddenWord.includes(letter) || usedLetters.includes(letter)) {
                    console.log(`> ⚠️  Letter "${letter}" is revealed OR you already entered it!`);
                    console.log(`🔰\t${hiddenWord}`);
                    playerInput.close();

                    return playTheGame(attempts);
                }
                usedLetters.push(letter);

                if (checkLetter(letter, word)) {
                    console.log(`\n✅ VALID LETTER! ATTEMPTS: ${attempts} / 10`);

                    letters.forEach((ltr, index) => {
                        if (ltr === letter.toUpperCase()) {
                            hiddenWord = hiddenWord.split("");
                            hiddenWord[index] = letter;
                            hiddenWord = hiddenWord.join("");
                        }
                    });
                    console.log(`🔰\t${hiddenWord}`);
                    playerInput.close();
                    playTheGame(attempts);
                } else {
                    attempts -= 1;
                    console.log(`\n❌ INVALID LETTER! ATTEMPTS: ${attempts} / 10`)
                    console.log(`🔰\t${hiddenWord}`);
                    playerInput.close();

                    playTheGame(attempts);
                }
            });
        } else {
            console.log(`✅\t${word.toUpperCase()}`);
            console.log(`⚫☢️  GAME OVER, YOU DIED ! ⚰️ 🚑`);
            playerInput.close();

            return checkToPlayAgain();
        }
    }

    playTheGame(attempts);
};

function checkToPlayAgain() {
    const input = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log(`====================`);
    console.log(`\n🚀 WHAT'S NEXT ?? 🔰`);
    console.log(`1️⃣  press "1" to play again the game, if you dare!`);
    console.log(`0️⃣  press "0" to EXIT!`);

    input.question("> ", (option) => {
        if (option === "1") {
            input.close();
            console.clear();
            return main();
        }
        if (option === "0") {
            console.clear();
            console.log("*** 😔 BYE BYE 👋 ***");
            input.close();
            process.exit(0);
        }

        console.clear();
        console.log(`❌ INVALID OPTION! Please select an option from the menu below.`);
        input.close();
        return checkToPlayAgain();
    });
}

function pickAWord() {
    try {
        const words = fs.readFileSync(PATH_TO_WORDS_FILE, 'utf-8').split('\r\n');
        return words[Math.floor(Math.random() * words.length)].toUpperCase();
    } catch (e) {
        console.error(e);
    }
}

function checkLetter(letter, word) {
    const letters = word.split("");

    return true ? letters.includes(letter.toUpperCase()) : false
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main();