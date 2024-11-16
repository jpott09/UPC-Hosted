// import link display
import {Links} from "./UPC-Hosted/js/links.js";
import {CardDisplay} from "./UPC-Hosted/js/card.js";
// import utilities
import * as utils from "./UPC-Hosted/js/utilities.js";
document.addEventListener("DOMContentLoaded", () => {

    // OBJECTS AND VARIABLES
    let image_folder_path = "./UPC-Hosted/assets/web_images/"
    let div_body = document.getElementById("div_body");

    // DISPLAY OBJECTS
    let links = new Links(div_body, getExam);
    let card_display = null;


    // FUNCTIONS --------------------------------------------------------
    async function getExam(chapter_number){
        let data = await utils.ajaxChapter(chapter_number);
        let chapter = utils.dataToChapter(data,image_folder_path);
        if(!chapter){console.log("Error in getExam(): chapter is null");return}
        links.hide();
        card_display = new CardDisplay(div_body, chapter,showHome);
    }
    function showHome(){
        card_display.remove();
        links.show();
    }

});
