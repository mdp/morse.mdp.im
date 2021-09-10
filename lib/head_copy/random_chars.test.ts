import RandomChars, { letters } from "./random_chars";


test('Getting back a random group question', () => {
    const r = new RandomChars({turns: 50, length: 5})
    const question = r.getQuestion(0);
    expect(question.phrase.length === 1)
    expect(question.answers.length === 5)
});