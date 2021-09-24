import { levenshteinMorseDistance } from "../levenshtein"

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


export function morseSort(word: string, source: string[]): string[] {
    return source.concat().sort(function (a, b): number {
        // Bias towards words of a similar size
        const aNum = levenshteinMorseDistance(word, a) + Math.abs(word.length - a.length);
        const bNum = levenshteinMorseDistance(word, b) + Math.abs(word.length - b.length);
        if (aNum > bNum) {
            return 1
        } else if (aNum < bNum) {
            return -1
        }
        return 0;
    })
}

export function similar(word: string, source: string[], amount: number): string[] {
    const sim = morseSort(word, source)

    // Randomize the top list a bit to ensure it's not always the same
    const sampleSize = Math.ceil(amount * 1.5)

    // Get the top results
    const results = sim.slice(1, sampleSize)

    // Mix them up
    shuffle_array(results)

    // And return the requested amount
    return results.slice(0, amount)
}