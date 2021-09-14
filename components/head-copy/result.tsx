import { Answer } from "../../lib/head_copy/game";

interface ResultProps {
    answers: Answer[]
    spaced: boolean
}

export default function Result({answers, spaced}: ResultProps) {
    function renderAnswers() {
        const space = spaced ? " " : ""
        const keyWords = [];
        const selectedWords = [];
        for (let i=0; i < answers.length; i++) {
            let answer = answers[i];
            keyWords.push(<span key={"key" + i} className='correct'>{answer.actual}{space}</span>)
            if (answer.actual === answer.selected) {
                selectedWords.push(<span key={"selection" + i} className='correct'>{answer.actual}{space}</span>)
            } else {
                selectedWords.push(<span key= {"selection" + i} className='wrong'><span style={{ color: 'red' }}>{answer.selected}{space}</span></span>)
            }
        }
        return {keys: keyWords, selections: selectedWords}
    }

    const answerKey = renderAnswers();

    return <div className="text-center text-3xl">
        <div>{answerKey.keys}</div>
        <div>{answerKey.selections}</div>
    </div>
}
