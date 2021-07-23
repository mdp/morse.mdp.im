export interface AnswerSetProps {
    words: string[],
    pick: string,
    onAnswer: (answer: string, selection: string)=>void,
}

export function AnswerSet({words, pick, onAnswer}: AnswerSetProps) {

    const onClick = (e) => {
      const selected = e.target.innerText;
      if (selected === pick) {
        onAnswer(pick, selected);
      } else {
        onAnswer(pick, selected);
      }
    }
  
    const answerSet = words.sort().map((word, i) =>
        <li key={word + i} className="items-center my-2 px-4">
            <button className="w-full justify-center eightbit-btn text-xl p-4 mt-3" onClick={onClick}>{word}</button>
        </li>
    )
  
    return(
      <ul className="w-full flex-row">{answerSet}</ul>
    )
  }