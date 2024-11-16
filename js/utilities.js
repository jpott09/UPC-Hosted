import { Chapter, Question } from "./UPC-Hosted/js/objects.js";

export function isMobile(){
    // use mobi to detect any mobile device
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function verifyExit(text){
    return window.confirm(text);
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