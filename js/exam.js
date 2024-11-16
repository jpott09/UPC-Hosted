import { Results } from "./objects.js";

export class Exam{
    constructor(chapter){
        this.chapter = chapter;
        this.current_question_number = 0;
        this.last_question_number = this.chapter.questions.length;
    }
    getNextQuestion(){
        /* returns the next question in the chapter. Returns null on fail*/
        if(this.current_question_number < this.last_question_number){
            this.current_question_number++;
            return this.chapter.getQuestion(this.current_question_number);
        }else{
            return null;
        }
    }
    getPreviousQuestion(){
        /* returns the previous question in the chapter. Returns null on fail*/
        if(this.current_question_number > 1){
            this.current_question_number--;
            return this.chapter.getQuestion(this.current_question_number);
        }else{
            return null;
        }
    }
    setUserAnswer(answer_letter){
        /* sets the user answer for the current question */
        let current_question = this.chapter.getQuestion(this.current_question_number);
        current_question.setUserAnswer(answer_letter);
    }
    getResults(){
        /* returns the results of the exam */
        let correct_answers = [];
        let incorrect_answers = [];
        let unanswered_questions = [];
        this.chapter.questions.forEach(q => {
            if(q.correct){
                correct_answers.push(q);
            }else if(q.correct === null){
                unanswered_questions.push(q);
            }else if(q.correct === false){
                incorrect_answers.push(q);
            }else{
                throw new Error("Unexpected question.correct value: " + q.correct);
            }
        });
        return new Results(correct_answers, incorrect_answers, unanswered_questions);
    }
}