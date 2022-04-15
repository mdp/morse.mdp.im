import Game from "../../game";
import { RandomCharsTurns } from "../random_chars";
import { letters as lcwoLetters } from "./lcwo";
import { letters as cwopsLetters } from "./cwops";

export const newestThreeSet = (letters: string[]): string[][] => {
    let newestThree = []
    for (let i=0; i <= letters.length - 3; i++) {
        newestThree.push(letters.slice(i, i+3))
    }
    return newestThree
}

export const inclusiveSet = (letters: string[]): string[][] => {
    let inclusive = []
    for (let i=0; i <= letters.length - 3; i++) {
        inclusive.push(letters.slice(0, i+3))
    }
    return inclusive
}

// Pass in a set of letters and get back a game list progressing through the set
export const buildProgressiveGameList = function(id: string, letters: string[]): Game[] {
    // Build a list of letters starting with groups of newest 3
    // abcdef => ['abc', 'bcd', 'cde', 'def']
    // abcdef => ['abc', 'abcd', 'abcde', 'abcdef']
    const newestThree = newestThreeSet(letters)
    const inclusive = inclusiveSet(letters)
    const games = []
    for (let i=0; i < newestThree.length; i++) {
        games.push(
            new RandomCharsTurns({
                id: `${id}_newest_${i}`,
                name: `${newestThree[i].join(', ')}`,
                description: "Three newest letters",
                charSet: newestThree[i],
                turns: 50,
                length: 5,
            }),
        )
        games.push(
            new RandomCharsTurns({
                id: `${id}_inclusive_${i}`,
                name: `All Previous and ${inclusive[i].slice(-1)}`,
                description: `All the letters up to ${inclusive[i].slice(-1)}`,
                charSet: inclusive[i],
                turns: 50,
                length: 5,
            }),
        )
    }
    return games
}