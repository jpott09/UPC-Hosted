export class Links {
    constructor(header_element,parent_div, async_onlclick_callback){
        /* Takes a parent div (to draw links within) and callback function to call when a link is clicked */
        // parent div is the div where this class will be shown
        this.header_element = header_element;
        // set the header element text
        this.header_element.innerText = "2018 UPC Tests and Exams";
        this.parent_div = parent_div;
        // on_click_callback is the function that will be called when a link is clicked
        this.async_onlclick_callback = async_onlclick_callback;
        // links div will hold the unordered lists with li links
        this.links_div = document.createElement("div");
        this.links_div.id = "links";
        this.links_div.classList.add("div_body");
        // {"Exam Name": chapter_number}
        this.exams = {
            "General Examination #1": 18,
            "General Examination #2": 19,
            "General Examination #3": 20,
        };
        this.practice_tests = {
            "Administration": 1,
            "Definitions": 2,
            "General Regulations": 3,
            "Plumbing Fixtures and Fixture Fittings": 4,
            "Water Heaters": 5,
            "Water Supply and Distribution": 6,
            "Sanitary Drainage": 7,
            "Indirect Wastes": 8,
            "Vents": 9,
            "Traps and Interceptors": 10,
            "Storm Drainage": 11,
            "Fuel Gas Piping": 12,
            "Health Care Facilities and Medical Gas and Vacuum Systems": 13,
            "Firestop Protection": 14,
            "Alternative Water Sources for Nonpotable Applications": 15,
            "Nonpotable Rainwater Catchment Systems": 16,
            "Referenced Standards": 17
        }
        // GENERAL EXAMS ---------------------------------------------
        this.general_exams_header = document.createElement("h2");
        this.general_exams_header.innerText = "General Exams";
        this.links_div.appendChild(this.general_exams_header);
        this.general_exams_list = document.createElement("ul");
        this.general_exams_list.id = "general_exams_list";
        this.links_div.appendChild(this.general_exams_list);
        for (let exam in this.exams){
            let li = document.createElement("li");
            li.innerText = exam;
            li.id = this.exams[exam];
            li.addEventListener("click", async () => {
                await this.async_onlclick_callback(li.id);
            })
            this.general_exams_list.appendChild(li);
        }
        // PRACTICE TESTS ---------------------------------------------
        this.practice_tests_header = document.createElement("h2");
        this.practice_tests_header.innerText = "Practice Tests";
        this.links_div.appendChild(this.practice_tests_header);
        this.practice_tests_list = document.createElement("ul");
        this.practice_tests_list.id = "practice_tests_list";
        this.links_div.appendChild(this.practice_tests_list);
        for (let test in this.practice_tests){
            let li = document.createElement("li");
            li.innerText = test;
            li.id = this.practice_tests[test];
            li.addEventListener("click", async () => {
                await this.async_onlclick_callback(li.id);
            })
            this.practice_tests_list.appendChild(li);
        }
        this.parent_div.appendChild(this.links_div);
    }
    show(){
        /* Shows the links div */
        if(!this.parent_div.contains(this.links_div)){
            this.parent_div.appendChild(this.links_div);
        }
        // set the header element text
        this.header_element.innerText = "2018 UPC Tests and Exams";
    }
    hide(){
        /* Hides the links div */
        if(this.parent_div.contains(this.links_div)){
            this.parent_div.removeChild(this.links_div);
        }
    }
}