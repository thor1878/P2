let repoButtons = document.querySelectorAll('.card');
let selected = localStorage.getItem("activeCard");
let selectedSubCard = localStorage.getItem("activeSubCard");
let globalAllSubs = document.querySelectorAll(".sub-card");

//Loop through all buttons in html doc with tag .card
for (const button of repoButtons) {   
    //Add click event to all subcards
    for (const item of globalAllSubs) {
        if(item.id === selectedSubCard) {
            item.classList.add("active");   
            let daddy = item.parentElement; 
            let btnminknap = daddy.parentElement.querySelector(".card");
            btnminknap.classList.add('active');
            activateDropdown(btnminknap, "add");
        }

        item.addEventListener("click", () => {
            //Remove all subtag on all subcards
            for (const sub of globalAllSubs) {
                sub.classList.remove("active");
            }

            selected = item.id;
            item.classList.add("active");
            localStorage.setItem("activeSubCard", selectedSubCard);
        })
    }
    
    // if (button.id === selected) {
    //     button.classList.add('active');
    //     activateDropdown(button, "add"); 
    // }

    button.addEventListener("click", () => {
        for (const button of repoButtons) {
            button.classList.remove('active');
            activateDropdown(button, "remove");      
        }

        activateDropdown(button, "add");
        button.classList.add('active');
        selected = button.id;
        localStorage.setItem("activeCard", selected);
    });
}

//Remove or add show class to sub cards
function activateDropdown(btn, state){
    let parent = btn.parentElement;
    let all_contents = parent.querySelectorAll(".content");
    console.log(all_contents);

    if (state === "remove") {
        for (const item of all_contents) {
            item.classList.remove("show");
        }
    } else if (state === "add") {
        for (const item of all_contents) {
            item.classList.add("show");
        }
    }
}
