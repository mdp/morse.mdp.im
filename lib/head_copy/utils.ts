import levenshteinDistance from "../levenshtein"

export function shuffle_array(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array
}

export function randomPick(array: any[]): string {
    return array[Math.floor(Math.random() * array.length)];
}

export function unique(arr: any[]): any[] {
    return arr.filter((value, index, self) => self.indexOf(value) === index)
}
  
export function randomChar(list: string | string[]): string {
    return list[Math.floor(Math.random() * list.length)];
}

// TODO: build a levenshtein sorter that takes into account similar morse code characters
export function similar(word: string, source: string[], amount: number): string[] {
    const sim = source.concat().sort(function (a, b): number {
        const aNum = levenshteinDistance(word, a);
        const bNum = levenshteinDistance(word, b);
        if (aNum > bNum) {
            return 1
        } else if (aNum < bNum) {
            return -1
        }
        return 0;
    })

    // Bias towards words of a similar length (within 1 character)

    // Take the top 10% of sorted similar words
    const topResults = sim.slice(1, Math.floor(source.length * 0.10))
    let sameLength = topResults.filter((w) => Math.abs(w.length - word.length) <= 1)

    let results = sameLength
    
    // Randomize the top list a bit to ensure it's not always the same
    const sampleSize = Math.ceil(amount * 1.5)

    // In case we don't have enough similar length words
    if (sameLength.length < sampleSize ) {
        results = unique(sameLength.concat(topResults))
    }

    // Get the top results
    results = results.slice(0, sampleSize)

    // Mix them up
    shuffle_array(results)

    // And return the requested amount
    return results.slice(0, amount)
}