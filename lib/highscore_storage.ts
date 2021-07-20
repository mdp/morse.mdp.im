export interface Highscore {
    score: number,
    createdAt: Date,
    percentCorrect: number,
}

const MAX_RECORDS_PER_KEY = 500

export function getHighscores(key): Highscore[] {
    const hsArr = JSON.parse(window.localStorage.getItem(key) || "[]")
    hsArr.sort((a, b) => b[0] - a[0]);
    return hsArr.map((h) => {
        return {
            score: h[0],
            percentCorrect: h[1],
            createdAt: new Date(h[2]*1000),
        }
    })
}

export function setHighscore(key, score, percentCorrect): number {
    let records = getHighscores(key)
    if (records.length > MAX_RECORDS_PER_KEY - 1) {
        records = records.slice(0, MAX_RECORDS_PER_KEY - 1)
    }
    const ts = Math.floor(Date.now() / 1000)
    const highscores = records.map((r) => [r.score, r.percentCorrect, r.createdAt.getTime()/1000])
    highscores.push([
        score,
        percentCorrect,
        ts,
    ])
    window.localStorage.setItem(key, JSON.stringify(highscores))
    return ts
}