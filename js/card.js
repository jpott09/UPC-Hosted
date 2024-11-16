import { Exam } from "./js/exam.js";

export class Card{
    constructor(parent_div, current_question){
        this.parent_div = parent_div;
        this.current_question = current_question;
        this.div = document.createElement("div");
        this.div.id = "card_div";
        this.div.classList.add("div_body");
        if(this.parent_div.contains(document.getElementById("card_div"))){
            this.parent_div.removeChild(document.getElementById("card_div"));
        }
        this.div.classList.add("div_body");
        this.parent_div.appendChild(this.div);
        // create the question text
        this.question_text_label = document.createElement("label");
        this.question_text_label.id = "question_text_label";
        this.question_text_label.classList.add("question_label");
        this.question_text_label.innerText = current_question.number + ": " + current_question.text;
        this.div.appendChild(this.question_text_label);
        // create the options
        this.options_div = document.createElement("div");
        this.options_div.id = "options_div";
        this.options_div.classList.add("div_body");
        this.div.appendChild(this.options_div);
        current_question.options.forEach(o => {
            let option_label = document.createElement("label");
            option_label.classList.add("option");
            option_label.innerText = o.letter + ": " + o.text;
            option_label.addEventListener("click", () => {
                this.selectOption(option_label);
            });
            this.options_div.appendChild(option_label);
        });
        // create the 'show answer' button
        this.show_answer_button = document.createElement("label");
        this.show_answer_button.id = "show_answer_button";
        this.show_answer_button.innerText = "Show Answer";
        this.show_answer_button.classList.add("show_answer_option");
        this.show_answer_button.addEventListener("click", () => {
            this.showCorrectAnswer();
        });
        this.div.appendChild(this.show_answer_button);
        // draw an image if there is one
        if(current_question.image){
            this.image = document.createElement("img");
            this.image.src = current_question.image;
            this.image.id = "question_image";
            this.image.classList.add("question_image");
            this.image.addEventListener("click", () =>{window.open(current_question.image);});
            this.div.appendChild(this.image);
        }
    }
    selectOption(label){
        let options = this.options_div.getElementsByTagName("label");
        for(let i = 0; i < options.length; i++){
            options[i].classList.remove("option_selected");
            if(options[i] === label){
                let question_options = this.current_question.options;
                this.current_question.setUserAnswer(question_options[i].letter);
            }
        }
        label.classList.add("option_selected");
    }
    showCorrectAnswer(){
        let correct_answer = this.current_question.answer.letter;
        let correct_answer_index = this.current_question.options.findIndex(o => o.letter === correct_answer);
        let options = this.options_div.getElementsByTagName("label");
        options[correct_answer_index].classList.add("option_correct");
    }
    remove(){
        if(this.parent_div.contains(this.div)){
            this.parent_div.removeChild(this.div);
        }
    }
}
export class CardDisplay{
    constructor(parent_div, current_chapter, home_callback){
        this.parent_div = parent_div;
        this.current_chapter  = current_chapter;
        this.home_callback = home_callback;
        this.Exam = new Exam(this.current_chapter);
        this.current_question = this.Exam.getNextQuestion();
        this.total_questions = this.current_chapter.getLastQuestionNumber();
        // create buttons div
        this.button_div = document.createElement("div");
        this.button_div.id = "div_card_buttons";
        this.button_div.classList.add("div_card_buttons");
        // create the previous button
        this.previous_button = document.createElement("button");
        this.previous_button.id = "previous_button";
        this.previous_button.innerText = "Previous";
        this.previous_button.addEventListener("click", () => {
            this.previous();
        });
        this.button_div.appendChild(this.previous_button);
        // create the home button
        this.home_button = document.createElement("button");
        this.home_button.id = "home_button";
        this.home_button.innerText = "Home";
        this.home_button.addEventListener("click", () => {
            this.goHome();
        });
        this.button_div.appendChild(this.home_button);
        // create the next button
        this.next_button = document.createElement("button");
        this.next_button.id = "next_button";
        if(this.current_question.number !== this.total_questions){
            this.next_button.innerText = "Next";
        }else{
            this.next_button.innerText = "Submit";
        }
        this.next_button.addEventListener("click", () => {
            this.next();
        });
        this.button_div.appendChild(this.next_button);
        // create empty results div
        this.results_div = document.createElement("div");
        this.results_div.id = "results_div";
        this.results_div.classList.add("div_body");
        // remove existing button div then add it
        if(this.parent_div.contains(document.getElementById("div_card_buttons"))){
            this.parent_div.removeChild(document.getElementById("div_card_buttons"));
        }
        this.parent_div.appendChild(this.button_div);
        // remove existing results div then add it
        if(this.parent_div.contains(document.getElementById("results_div"))){
            this.parent_div.removeChild(document.getElementById("results_div"));
        }
        this.parent_div.appendChild(this.results_div);
        // create the card
        this.card = new Card(this.parent_div, this.current_question);
    }
    next(){
        if(this.current_question.number === this.total_questions){
            this.showResults();
        }else{
            this.current_question = this.Exam.getNextQuestion();
            this.card = new Card(this.parent_div, this.current_question, this.total_questions);
            if(this.current_question.number === this.total_questions){
                this.next_button.innerText = "Submit";
            }
        }
    }
    previous(){
        if(this.current_question.number !== 1){
            this.current_question = this.Exam.getPreviousQuestion();
            this.card = new Card(this.parent_div, this.current_question, this.total_questions);
            if(this.current_question.number !== this.total_questions){
                this.next_button.innerText = "Next";
            }
        }
    }
    goHome(){
        this.remove();
        this.home_callback();
    }
    showResults(){
        let Results = this.Exam.getResults();
        // remove the button div
        if(this.parent_div.contains(this.button_div)){
            this.parent_div.removeChild(this.button_div);
        }
        if(this.parent_div.contains(this.results_div)){
            this.parent_div.removeChild(this.results_div);
        }
        // remove the card div
        this.card.remove();
        this.card = null;
        // display the results
        this.results_div = document.createElement("div");
        this.results_div.id = "results_div";
        this.results_div.classList.add("results_div");
        this.parent_div.appendChild(this.results_div);
        // create a home button
        this.home_button = document.createElement("button");
        this.home_button.id = "home_button";
        this.home_button.classList.add("home_button");
        this.home_button.innerText = "Home";
        this.home_button.addEventListener("click", () => {
            this.home_callback();
        });
        this.results_div.appendChild(this.home_button);
        // show results
        let correct_label = document.createElement("label");
        correct_label.classList.add("blue_label");
        correct_label.innerText = "Correct: " + Results.correct_question_count;
        this.results_div.appendChild(correct_label);
        let incorrect_label = document.createElement("label");
        incorrect_label.classList.add("blue_label");
        incorrect_label.innerText = "Incorrect: " + Results.incorrect_question_count;
        this.results_div.appendChild(incorrect_label);
        let unanswered_label = document.createElement("label");
        unanswered_label.classList.add("blue_label");
        unanswered_label.innerText = "Unanswered: " + Results.unanswered_question_count;
        this.results_div.appendChild(unanswered_label);
        let percent_label = document.createElement("label");
        percent_label.classList.add("blue_label");
        percent_label.innerText = "Percent: " + Results.percent + "%";
        this.results_div.appendChild(percent_label);
        let passed_label = document.createElement("label");
        if(Results.passed){
            passed_label.innerText = "Passed";
            passed_label.classList.add("highlight_blue_label")
        }else{
            passed_label.innerText = "Failed";
            passed_label.classList.add("highlight_orange_label");
        }
        this.results_div.appendChild(passed_label);
        let incorrect_answers_label = document.createElement("label");
        incorrect_answers_label.innerText = "Incorrect Answers:";
        incorrect_answers_label.classList.add("highlight_blue_label");
        incorrect_answers_label.style.marginTop = "10px";
        incorrect_answers_label.style.marginBottom = "10px";
        this.results_div.appendChild(incorrect_answers_label);
        let count = 0;
        Results.correct_questions.forEach(q => {
            count++
            let question_label = document.createElement("label");
            question_label.innerText = q.number + ": " + q.text;
            this.results_div.appendChild(question_label);
            let answer_label = document.createElement("label");
            answer_label.innerText = "Answer: " + q.answer.letter + " - " + q.getOptionText(q.answer.letter);
            answer_label.classList.add("blue_label");
            this.results_div.appendChild(answer_label);
        });
        if(count === 0){
            let no_incorrect_label = document.createElement("label");
            no_incorrect_label.innerText = "None";
            no_incorrect_label.classList.add("orange_label");
            this.results_div.appendChild(no_incorrect_label);
        }
        let unsanswered_answers_label = document.createElement("label");
        unsanswered_answers_label.innerText = "Unanswered Questions:";
        unsanswered_answers_label.classList.add("highlight_blue_label");
        unsanswered_answers_label.style.marginTop = "10px";
        unsanswered_answers_label.style.marginBottom = "10px";
        this.results_div.appendChild(unsanswered_answers_label);
        count = 0;
        Results.unanswered_questions.forEach(q => {
            count++;
            let question_label = document.createElement("label");
            question_label.innerText = q.number + ": " + q.text;
            this.results_div.appendChild(question_label);
            let answer_label = document.createElement("label");
            answer_label.innerText = "Answer: " + q.answer.letter + " - " + q.getOptionText(q.answer.letter);;
            answer_label.classList.add("blue_label");
            answer_label.style.marginBottom = "10px";
            this.results_div.appendChild(answer_label);

        });
        if(count === 0){
            let no_unanswered_label = document.createElement("label");
            no_unanswered_label.innerText = "None";
            no_unanswered_label.classList.add("orange_label");
            this.results_div.appendChild(no_unanswered_label);
        }
        // add another home button
        // create a home button
        this.home_button = document.createElement("button");
        this.home_button.id = "home_button2";
        this.home_button.classList.add("home_button");
        this.home_button.innerText = "Home";
        this.home_button.addEventListener("click", () => {
            this.home_callback();
        });
        this.results_div.appendChild(this.home_button);
    }
    remove(){
        if(this.parent_div.contains(this.results_div)){
            this.parent_div.removeChild(this.results_div);
        }
        if(this.parent_div.contains(this.button_div)){
            this.parent_div.removeChild(this.button_div);
        }
        if(this.card){
            this.card.remove();
        }
    }
}