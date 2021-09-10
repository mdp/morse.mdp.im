import CallSignGame from "./callsign_game";
import Game from "./game";
import PhraseGame from "./phrase_game";
import RandomChars from "./random_chars";
import WordGame from "./word_game";

export interface GameDefinition {
    id: string,
    title: string,
    description: string,
    questionPool: Game
}

const gameList: GameDefinition[] = [
    {
        id: 'dxcc100_6', title: "DXCC 100 6 Char Calls",
        description: `DXCC 100 6 Character Calls`,
        questionPool: new CallSignGame('/data/dxcc100_6char.json', {
            spaced: false, turns: 50
        })
    },
    {
        id: 'random_five', title: "Random 5 Characters",
        description: `Simple game of 5 characters`,
        questionPool: new RandomChars({turns: 50, length: 5})
    },
    {
        id: 'random_six', title: "Random 6 Characters",
        description: `Simple game of 6 random characters`,
        questionPool: new RandomChars({turns: 50, length: 6})
    },
    {
        id: 'cwops_calls', title: "CWOps Callsigns",
        description: `In this game we will jumble up the 500 top words into groups of 3 for 50 turns.
        You'll hear each set of words then need to pick them from a list, in order of appearance.
        `,
        questionPool: new CallSignGame('/data/cwops_calls.json', {
            spaced: false, turns: 50
        })
    },
    {
        id: "common_qso_phrases", title: "Common QSO Phrases",
        description: `In this exercise you'll be presented with a series of common QSO phrases which you'll need to remember
        and recall in the subsequent multiple choice questions`,
        questionPool: new PhraseGame('/data/common_qso_phrases.json', {
            spaced: true, turns: 50
        })
    },
    {
        id: "2-words", title: "2 Words",
        description: `2 to 7 letter words in groups of 2`,
        questionPool: new WordGame('/data/2_7_letter_words.json', {
            spaced: true, turns: 50, phraseWordCount: 2
        })
    },
]

export default gameList;