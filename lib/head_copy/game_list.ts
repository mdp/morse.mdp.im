import { CallSignGameTurns } from "./games/callsign_game";
import Game from "./game";
import { RandomCharsTurns, LETTERS, RandomCharsStreak } from "./games/random_chars";
import { WordGameTurns } from "./games/word_game";

const gameList: Game[] = [
    new CallSignGameTurns({
        id: "dxcc100_6",
        name: "DXCC100",
        description: "Source for DXCC100",
        source: '/data/dxcc100_6char.json',
        spaced: false,
        turns: 50
    }),
    new RandomCharsTurns({
        id: "random_five",
        name: "Random 5 Characters",
        description: "5 Letters as random",
        charSet: LETTERS,
        turns: 50,
        length: 5,
    }),
    new RandomCharsStreak({
        id: "random_five_streak",
        name: "Random 5 Characters Streak",
        description: "5 Letters as random",
        charSet: LETTERS,
        lives: 3,
        length: 5,
    }),
    new RandomCharsTurns({
        id: "random_six",
        name: "Random 6 Characters",
        description: "6 Letters as random",
        charSet: LETTERS,
        turns: 50,
        length: 6,
    }),
    new WordGameTurns({
        id: "2-words",
        name: "2 Random Words",
        description: "Two unreleated 2 to 7 character words",
        source: '/data/2_7_letter_words.json',
        spaced: false,
        turns: 50,
        phraseWordCount: 2,
    }),
]


export default gameList;