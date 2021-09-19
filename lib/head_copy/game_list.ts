import { CallSignGameRufzxp, CallSignGameStreak, CallSignGameTurns } from "./games/callsign_game";
import Game, { FetchData } from "./game";
import { RandomCharsTurns, LETTERS, RandomCharsStreak, RandomCharsRufzxp } from "./games/random_chars";
import { WordGameRufzxp, WordGameStreak, WordGameTurns } from "./games/word_game";


export const turnGameList: Game[] = [
    new CallSignGameTurns({
        id: "dxcc100_6",
        name: "DXCC100 6 Char Calls",
        description: "Source for DXCC100",
        data: new FetchData('/data/dxcc100_6char.json'),
        spaced: false,
        turns: 50
    }),
    new CallSignGameTurns({
        id: "cwops_calls",
        name: "CWOps callsigns",
        description: "CWOps member callsigns",
        data: new FetchData('/data/cwops_calls.json'),
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
        data: new FetchData('/data/2_7_letter_words.json'),
        spaced: false,
        turns: 50,
        phraseWordCount: 2,
    }),
    new WordGameTurns({
        id: "2-qso-words",
        name: "2 Random QSO Words",
        description: "Two unreleated common QSO words",
        data: new FetchData('/data/top_qso_words.json'),
        spaced: false,
        turns: 50,
        phraseWordCount: 2,
    }),

]

export const streakGameList: Game[] = [
    new CallSignGameStreak({
        id: "dxcc100_6_streak",
        name: "DXCC100 6 Char Calls",
        description: "Source for DXCC100",
        data: new FetchData('/data/dxcc100_6char.json'),
        spaced: false,
        lives: 3
    }),
    new CallSignGameStreak({
        id: "cwops_calls_streak",
        name: "CWOps callsigns",
        description: "CWOps member callsigns",
        data: new FetchData('/data/cwops_calls.json'),
        spaced: false,
        lives: 3
    }),
    new RandomCharsStreak({
        id: "random_five_streak",
        name: "Random 5 Characters",
        description: "5 Letters as random",
        charSet: LETTERS,
        lives: 3,
        length: 5,
    }),
    new RandomCharsStreak({
        id: "random_six_streak",
        name: "Random 6 Characters",
        description: "6 Letters as random",
        charSet: LETTERS,
        lives: 3,
        length: 5,
    }),
    new WordGameStreak({
        id: "2-words-streak",
        name: "2 Random Words",
        description: "Two unreleated 2 to 7 character words",
        data: new FetchData('/data/2_7_letter_words.json'),
        spaced: false,
        lives: 3,
        phraseWordCount: 2,
    }),
    new WordGameStreak({
        id: "2-qso-words-streak",
        name: "2 Random QSO Words",
        description: "Two unreleated common QSO words",
        data: new FetchData('/data/top_qso_words.json'),
        spaced: false,
        lives: 3,
        phraseWordCount: 2,
    }),

]

export const rufzxpGameList: Game[] = [
    new CallSignGameRufzxp({
        id: "dxcc100_6_rufzxp",
        name: "DXCC100 6 Char Calls",
        description: "Source for DXCC100",
        data: new FetchData('/data/dxcc100_6char.json'),
        spaced: false,
        turns: 50
    }),
    new CallSignGameRufzxp({
        id: "cwops_calls_rufzxp",
        name: "CWOps callsigns",
        description: "CWOps member callsigns",
        data: new FetchData('/data/cwops_calls.json'),
        spaced: false,
        turns: 50
    }),
    new RandomCharsRufzxp({
        id: "random_five_rufzxp",
        name: "Random 5 Characters",
        description: "5 Letters as random",
        charSet: LETTERS,
        turns: 50,
        length: 5,
    }),
    new RandomCharsRufzxp({
        id: "random_six_rufzxp",
        name: "Random 6 Characters",
        description: "6 Letters as random",
        charSet: LETTERS,
        turns: 50,
        length: 5,
    }),
    new WordGameRufzxp({
        id: "2-words-rufzxp",
        name: "2 Random Words",
        description: "Two unreleated 2 to 7 character words",
        data: new FetchData('/data/2_7_letter_words.json'),
        spaced: false,
        turns: 50,
        phraseWordCount: 2,
    }),
    new WordGameRufzxp({
        id: "2-qso-words-rufzxp",
        name: "2 Random QSO Words",
        description: "Two unreleated common QSO words",
        data: new FetchData('/data/top_qso_words.json'),
        spaced: false,
        turns: 50,
        phraseWordCount: 2,
    }),
]

const allGames = [].concat(streakGameList, turnGameList, rufzxpGameList);

export default allGames