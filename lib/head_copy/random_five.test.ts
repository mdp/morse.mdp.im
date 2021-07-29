import RandomFive, { letters } from "./random_five";


test('Getting back a random group question', () => {
    const r = new RandomFive({turns: 50})
    const question = r.getQuestion(0);
    expect(question.phrase.length === 1)
    expect(question.answers.length === 5)
});