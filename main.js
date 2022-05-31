const fs = require('fs');

const PATH_TO_WORDS_FILE = 'words.txt';
const VOWELS = ['A', 'E', 'I', 'O', 'U'];

async function main() {
    const word = pickAWord();
    let hiddenWord = '';
    let attempts = 10;

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
                playerInput.close();
                return console.log(`\n🎉CONGRATULATIONS, YOU WIN! 🥳`);
            }
            playerInput.question("\nEnter a letter: \n> ", (letter) => {
                letter = letter.toUpperCase();

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
        }
    }

    playTheGame(attempts);
};


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