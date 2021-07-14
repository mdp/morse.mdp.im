import levenshteinDistance from "./levenshtein";

// Represents a single question
export interface Question {
    spaced: boolean,
    phrase: string[],
    answers: string[][],
}

// Represents all the possible phrases and and answer corpus for each column
export interface PhraseList {
    phrases: string[][],
    corpus: string[][],
}


// The actual game data, everything needed to run a game
export interface GameData {
  phraseList?: PhraseList,
  wordList?: string[],
  spaced?: boolean,
  description: string,
  turns: number,
  source: string,
  type: string, 
  title: string, 
}


function randomPick(array: any[]): string {
  return array[Math.floor(Math.random() * array.length)];
}

function similar(word: string, source: string[], amount: number): string[] {
  const sim = source.concat().sort(function(a,b): number {
    const aNum = levenshteinDistance(word, a);
    const bNum = levenshteinDistance(word, b);
    if (aNum > bNum) {
      return 1
    } else if (aNum < bNum) {
      return -1
    }
    return 0;
  })
  return sim.slice(1, amount + 1)
}

// Split call into 2 parts, with the number always in the first half
// A4BCD => [A4, BCD]
// AB4CD => [AB4, CD]
// AB4CDE => [AB4, CDE]
function splitCall(call: string) {
    const callSplit = [];
    // 5/2 => 2.5 => 2
    // call.slice(0,2)
    let callLen = call.length
    let splitAt = Math.floor(callLen/2)
    if (callLen % 2 === 1 && isNaN(parseInt(call.charAt(splitAt - 1)))) {
      splitAt = splitAt + 1
    }
    return [call.substr(0, splitAt), call.substr(splitAt, callLen)]
}

export const callSignsToPhraseList = function(callSigns: string[]): PhraseList {
    const phrases = callSigns.map((c) => splitCall(c))
    const corpus = [[]]

    for (let i=0; i < 2; i++) {
      const phraseArr = phrases.map((p) => p[i])
      corpus[i] = phraseArr.filter((value, index, self) => self.indexOf(value) === index)
    }

    return {
      phrases,
      corpus
    }
}


export const buildQuestionFromWords = function(words: string[],
  {wordCount, answerCount, spaced}: {wordCount: number, answerCount: number, spaced?: boolean}): Question {
    const q: Question = {
        spaced: spaced || true,
        phrase: [],
        answers: []
    }
    for (let j=0; j < wordCount; j++) {
        const wordPick = randomPick(words);
        const answers = similar(wordPick, words, answerCount - 1).concat(wordPick).sort()
        q.phrase.push(wordPick)
        q.answers.push(answers)
    }
    return q;
}

export const buildQuestionFromPhrases = function(phraseList: PhraseList,
  {answerCount, spaced}: {answerCount: number, spaced: boolean}): Question {
    const phraseLen = phraseList.phrases[0].length;
    const q: Question = {
        phrase: [],
        answers: [],
        spaced,
    }
    const phrasePick = randomPick(phraseList.phrases);
    for (let j=0; j < phraseLen; j++) {
        const corpus = phraseList.corpus[j].filter((p) => p.length === phrasePick[j].length )
        const answers = similar(phrasePick[j], corpus, answerCount - 1).concat(phrasePick[j]).sort()
        q.phrase.push(phrasePick[j])
        q.answers.push(answers)
    }
    return q;
}