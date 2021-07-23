export interface Highscore {
    score: number,
    wpm: number,
    createdAt: Date,
    percentCorrect: number,
}

const MAX_RECORDS_PER_KEY = 500

const TOTAL_DECODED_KEY = "TotalCharactersDecoded"

export function getHighscores(key: string): Highscore[] {
    const hsArr = JSON.parse(window.localStorage.getItem(key) || "[]")
    hsArr.sort((a, b) => b[0] - a[0]);
    return hsArr.map((h) => {
        return {
            score: h[0],
            wpm: h[1],
            percentCorrect: h[2],
            createdAt: new Date(h[3]*1000),
        }
    })
}

export function setHighscore(key, score, wpm, percentCorrect): number {
    let records = getHighscores(key)
    if (records.length > MAX_RECORDS_PER_KEY - 1) {
        records = records.slice(0, MAX_RECORDS_PER_KEY - 1)
    }
    const ts = Math.floor(Date.now() / 1000)
    const highscores = records.map((r) => [r.score, r.wpm, r.percentCorrect, r.createdAt.getTime()/1000])
    highscores.push([
        score,
        wpm,
        percentCorrect,
        ts,
    ])
    window.localStorage.setItem(key, JSON.stringify(highscores))
    return ts
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