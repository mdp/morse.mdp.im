import { Question } from "../gamelib";

export default abstract class Game {
    abstract readonly turns: number
    abstract readonly type: string
    abstract source: string
    abstract isReady: boolean     // when getQuestion is available
    error: any
    state: string | null

    abstract loadData(data: any): void;

    abstract unloadData(): void;

    // Call whenever we need to get a new question
    // TurnIdx can usually be ignored unless we want to ensure
    // that questions are unique or have a particular order
    abstract getQuestion(turnIdx: number): Question;



    constructor() {
        this.state = "empty"
        this.error = null
    }

    load(done: (err?: any) => void) : void {
        if (this.state !== 'empty') { return }
        this.state = 'loading'
        fetch(this.source).then(res => {
            if(res.status >= 400) {
                this.error = `Error loading data(${this.source}): ${res.status} - ${res.statusText}`
                done(this.error)
            } else {
                res.json().then(data => {
                    this.loadData(data)
                    this.isReady = true;
                    this.state = 'loaded'
                    done()
                })
            }
        }).catch((e) => {
            console.log(e)
            this.error = e
            this.error = `Error loading data(${this.source}): ${e}`
            done(this.error)
        })
    }

    unload(): void {
        this.isReady = false;
        this.state = 'empty';
    }

}