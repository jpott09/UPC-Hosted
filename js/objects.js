export class Answer{
    constructor(number, letter){
        this.number = number;
        this.letter = letter;
    }
}
export class Option{
    constructor(letter, text){
        this.letter = letter;
        this.text = text;
    }
}
export class Question{
    constructor(number, text, image=null){
        this.number = number;
        this.text = text;
        if(image === "none"){image=null;}
        this.image = image;
        this.options = [];
        this.answer = null;
        this.user_answer_letter = null;
        this.correct = null;
    }
    addOption(option_letter,option_text){
        this.options.push(new Option(option_letter,option_text));
    }
    setAnswer(answer_number, answer_letter){
        this.answer = new Answer(answer_number, answer_letter);
    }
    setUserAnswer( answer_letter){
        this.user_answer_letter = answer_letter;
        if(this.user_answer_letter === this.answer.letter){
            this.correct = true;
        }else{
            this.correct = false;
        }
    }
    getOptionText(option_letter){
        for (let o of this.options) {
            if (o.letter === option_letter) {
                return o.text;
            }
        }
        return null;
    }
}
export class Chapter{
    constructor(number, title){
        this.number = number;
        this.title = title;
        this.questions = [];
        this.answers = [];
    }
    addQuestion(question_number, question_text, question_image=null){
        this.questions.push(new Question(question_number, question_text,question_image));
    }
    addQuestionObject(question){
        this.questions.push(question);
    }
    addAnswer(answer_number, answer_letter){
        this.answers.push(new Answer(answer_number, answer_letter));
    }
    getQuestion(question_number){
        for (let q of this.questions) {
            if (q.number === question_number) {
                return q;
            }
        }
        return null;
    }
    getLastQuestionNumber(){
        let last_question = this.questions[this.questions.length-1];
        return last_question.number;
    }
    getAnswer(question_number){
        for (let a of this.answers) {
            if (a.number === question_number) {
                return a;
            }
        }
        return null;
    }
}
export class Results{
    constructor(correct_questions, incorrect_questions, unanswered_questions){
        this.correct_questions = correct_questions;
        this.incorrect_questions = incorrect_questions;
        this.unanswered_questions = unanswered_questions;
        this.total_question_count = correct_questions.length + incorrect_questions.length + unanswered_questions.length;
        this.correct_question_count = correct_questions.length;
        this.incorrect_question_count = incorrect_questions.length;
        this.unanswered_question_count = unanswered_questions.length;
        // calculate results
        this.percent = Math.round((this.correct_question_count / this.total_question_count) * 100);
        this.passed = false;
        if(this.percent >= 70){
            this.passed = true;
        }
    }
    getPercent(){
        return this.percent;
    }
    getPassed(){
        return this.passed;
    }
}