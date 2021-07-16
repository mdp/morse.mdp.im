interface ResultProps {
    answers: string[][], // [[correctWord, selection], ...]
    spaced: boolean
}

export default function Result({answers, spaced}: ResultProps) {
    function renderAnswers() {
        const space = spaced ? " " : ""
        const keyWords = [];
        const selectedWords = [];
        for (let i=0; i < answers.length; i++) {
            let answer = answers[i];
            keyWords.push(<span key={"key" + i} className='correct'>{answer[0]}{space}</span>)
            if (answer[0] === answer[1]) {
                selectedWords.push(<span key={"selection" + i} className='correct'>{answer[1]}{space}</span>)
            } else {
                selectedWords.push(<span key= {"selection" + i} className='wrong'><span style={{ color: 'red' }}>{answer[1]}{space}</span></span>)
            }
        }
        return {keys: keyWords, selections: selectedWords}
    }

    const answerKey = renderAnswers();

    return <>
        <div>{answerKey.keys}</div>
        <div>{answerKey.selections}</div>
    </>
}
