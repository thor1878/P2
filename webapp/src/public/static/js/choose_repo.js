
let repobuttons = document.querySelectorAll('.card');

let selected = localStorage.getItem("activeCard");
let selectedsub = localStorage.getItem("activesubCard");

let globalallsubs = document.querySelectorAll(".subcard");

//Loop through all buttons in html doc with tag .card
for (const button of repobuttons) {
   
    console.log();
   
    

//add click event to all subcards
for (const item of globalallsubs) {
    if(item.id === selectedsub){
        item.classList.add("active");   
        let daddy = item.parentElement; 
        let btnminknap = daddy.parentElement.querySelector(".card");
        btnminknap.classList.add('active');
        activate_dropdown(btnminknap, "add");

    }
    item.addEventListener("click",()=>{
        //remove all subtag on all subcards
        for (const sub of globalallsubs) {
            sub.classList.remove("active");
        }

        selected = item.id;
        item.classList.add("active");
        localStorage.setItem("activesubCard",selectedsub);
     
    })
   

}
    
    
    // if(button.id === selected)
    // {

    //     button.classList.add('active');
    //     activate_dropdown(button, "add");
        
    // }
    
    

    button.addEventListener("click", () => {
        
        for (const button of repobuttons) {
            button.classList.remove('active');
            activate_dropdown(button,"remove");
                   
        }

        
        activate_dropdown(button,"add");
        button.classList.add('active');
        selected = button.id;
        localStorage.setItem("activeCard",selected);
    });



}

//Remove or add show class to sub cards
function activate_dropdown(btn, state){
    
    let parent = btn.parentElement;
    let all_contents = parent.querySelectorAll(".content");
    console.log(all_contents);


if(state === "remove")
{
    for (const item of all_contents) {
        item.classList.remove("show");
    }
}
else if(state === "add")
{
    for (const item of all_contents) {
        
        item.classList.add("show");
    }
   
}
    

   
    
   

}




