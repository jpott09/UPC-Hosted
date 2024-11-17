// import link display
import {Links} from "./links.js";
import {CardDisplay} from "./card.js";
// import utilities
import * as utils from "./utilities.js";
document.addEventListener("DOMContentLoaded", () => {

    // OBJECTS AND VARIABLES
    let image_folder_path = "./assets/web_images/"
    let h2_header = document.getElementById("h2_header");
    let div_body = document.getElementById("div_body");

    // DISPLAY OBJECTS
    let links = new Links(h2_header, div_body, getExam, randomizedExam);
    let card_display = null;


    // FUNCTIONS --------------------------------------------------------
    async function getExam(chapter_number){
        let data = await utils.ajaxChapter(chapter_number);
        let chapter = utils.dataToChapter(data,image_folder_path);
        if(!chapter){console.log("Error in getExam(): chapter is null");return}
        links.hide();
        card_display = new CardDisplay(h2_header, div_body, chapter,showHome);
    }
    async function randomizedExam(question_count=100){
        let chapter = await utils.ajaxRandomizedExam(question_count);
        if(!chapter){console.log("Error in randomizedExam(): chapter is null");return}
        links.hide();
        card_display = new CardDisplay(h2_header, div_body, chapter,showHome);
    }
    function showHome(){
        card_display.remove();
        links.show();
    }

});
