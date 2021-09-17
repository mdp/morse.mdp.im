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
    // Get the top 2x similar words
    const results = sim.slice(1, amount * 2 +1).sort()
    // Mix them up
    shuffle_array(results)

    // And return the requested amount
    return results.slice(0, amount)
}