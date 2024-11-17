import { Chapter, Question, Answer, Option } from "./objects.js";

export function isMobile(){
    // use mobi to detect any mobile device
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function verifyExit(text){
    return window.confirm(text);
}

export function random_number(min,max){
    /* return a random number >= min and <= max */
    return Math.floor(Math.random() * (max - min + 1) + min);
}
export function random_index_item(array){
    /* pick a random index from an array */
    return array[random_number(0,array.length-1)];
}

export async function ajaxChapter(chapter_number){
    const response = await fetch('data/chapters/chapter_'+chapter_number+'.json');
    if(!response.ok){
        throw new Error('Cannot fetch data for chapter '+chapter_number+'. data/chapters/chapter_'+chapter_number+'.json');
    }
    const data = await response.json();
    return data;
}

export function dataToChapter(data,image_folder_path){
    if(!data){console.log("Error in dataToChapter(): data is null");return}
    let chapter = new Chapter(data["number"],data["text"]);
    // add answers
    data.answers.forEach(a => {
        chapter.addAnswer(a["number"],a["letter"]);
    });
    // add questions
    data.questions.forEach(q => {
        let image_filepath = null;
        if(q["image"] !== "none"){
            image_filepath = image_folder_path+q["image"] + ".png";
        }
        let question = new Question(q["number"], q["text"],image_filepath);
        // add options
        let option_list = q["options"];
        option_list.forEach(o => {
            question.addOption(o["letter"], o["text"]);
        });
        // add correct answer from chapter answers
        let correct_answer = chapter.getAnswer(q["number"]);
        if(!correct_answer){console.log("Error in dataToChapter(): correct_answer is null")}
        question.setAnswer(correct_answer.number, correct_answer.letter);
        chapter.addQuestionObject(question);
    });
    // Log the loaded chapter data
    let output = "Chapter Loaded: " + chapter.number + " " + chapter.title + " Total Questions: " + chapter.questions.length + " Total Answers: " + chapter.answers.length;
    output += "\nTotal Questions: " + chapter.questions.length;
    output += "\nTotal Answers: " + chapter.answers.length;
    let option_count = 0;
    chapter.questions.forEach(q => {
        q.options.forEach(o => {
            option_count++;
        });
    });
    output += "\nTotal Options: " + option_count;
    console.log(output);
    return chapter;
}

export async function ajaxRandomizedExam(question_count,image_folder_path=""){
    let exam_1_data = await ajaxChapter(18);
    let exam_2_data = await ajaxChapter(19);
    let exam_3_data = await ajaxChapter(20);
    let exam_1_chapter = dataToChapter(exam_1_data,image_folder_path);
    let exam_2_chapter = dataToChapter(exam_2_data,image_folder_path);
    let exam_3_chapter = dataToChapter(exam_3_data,image_folder_path);
    let total_questions = exam_1_chapter.questions.length + exam_2_chapter.questions.length + exam_3_chapter.questions.length;
    if(question_count > total_questions){
        question_count = total_questions;
    }
    let randomized_exam_title = "Randomized Exam: " + String(question_count) + " Questions";
    let randomized_exam = new Chapter(question_count,randomized_exam_title);
    let chapters = [exam_1_chapter,exam_2_chapter,exam_3_chapter];
    while(true){
        // pick a random chapter
        let random_index = random_number(0,chapters.length-1);
        // pull the question and answer
        let random_question = random_index_item(chapters[random_index].questions);
        let random_answer = chapters[random_index].getAnswer(random_question.number);
        // remove the question and answer from the chapter
        chapters[random_index].questions = chapters[random_index].questions.filter(q => q.number !== random_question.number);
        chapters[random_index].answers = chapters[random_index].answers.filter(a => a.number !== random_answer.number);
        // change the question and answer number to the next available number in the randomized exam
        let this_question_number = randomized_exam.getLastQuestionNumber() + 1;
        random_question.number = this_question_number;
        random_answer.number = this_question_number;
        // add the question and answer to the randomized exam
        randomized_exam.addQuestionObject(random_question);
        randomized_exam.addAnswerObject(random_answer);
        // check if the randomized exam is complete
        if(randomized_exam.questions.length >= question_count){
            break;
        }
    }
    console.log("Randomized Exam Generated:\nTitle: " + randomized_exam_title + "\nChapter Number: " + randomized_exam.number + "\nTotal Questions: " + randomized_exam.questions.length);
    return randomized_exam;
}