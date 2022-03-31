
let buttons = document.querySelectorAll('.card');


let selected = localStorage.getItem("activeCard");



for (const button of buttons) {
   
   
    if(button.id === selected)
    {
        button.classList.add('active');
    }

    button.addEventListener("click", () => {
        
        for (const button of buttons) {
            button.classList.remove('active');
           
            //det er det samme som dropdown lol
            button.nextElementSibling.classList.remove("show");
                   
        }

        button.classList.add('active');
        activate_dropdown(button);

        selected = button.id;
        localStorage.setItem("activeCard",selected);
    });



}

function activate_dropdown(btn){


    let dropdown = btn.nextElementSibling;

    if(btn.className == "card active")
    {
        dropdown.classList.add("show");
        console.log("diller haha")
    }
    else
    {
        dropdown.classList.remove("show");
    }
    
   

}
