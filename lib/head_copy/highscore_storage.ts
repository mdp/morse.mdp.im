export interface Highscore {
    mode: string
    score: number
    wpm: number
    ts: number
    percentCorrect?: number
}

const MAX_RECORDS = 1000

const HIGHSCORE_KEY = "HighScoreDB"
const TOTAL_DECODED_KEY = "TotalCharactersDecoded"

export function getHighscores(key: string): Highscore[] {
    const hsArr: Highscore[] = JSON.parse(window.localStorage.getItem(HIGHSCORE_KEY) || "[]");
    return hsArr.filter((h) => h.mode === key).sort((a,b) => b.score - a.score)
}

export function addHighscore(hs: Highscore) {
    let hsArr: Highscore[] = JSON.parse(window.localStorage.getItem(HIGHSCORE_KEY) || "[]");
    if (hsArr.length > MAX_RECORDS) {
        hsArr = hsArr.sort((a,b) => b.ts - a.ts).slice(0, MAX_RECORDS - 1)
    }
    hsArr.push(hs)
    window.localStorage.setItem(HIGHSCORE_KEY, JSON.stringify(hsArr))
}

export function getTotalCharacterDecoded(): number {
    if (!process.browser) { return }
    const total = parseInt(window.localStorage.getItem(TOTAL_DECODED_KEY) || "0", 10)
    if (isNaN(total)) {
        return 0
    }

    return total
}

export function addTotalCharacterDecoded(n: number): number {
    let total = parseInt(window.localStorage.getItem(TOTAL_DECODED_KEY) || "0", 10)
    total = n + total
    window.localStorage.setItem(TOTAL_DECODED_KEY, "" + total)
    return total
}