let repoCards = document.querySelectorAll('.card');
let repoSubCards = document.querySelectorAll(".sub-card");

let selected = localStorage.getItem("activeCard");
let selectedSubCard = localStorage.getItem("activeSubCard");

//Loop through all cards in html doc with tag .card
for (const card of repoCards) {
    //Add click event to all subcards
    for (const subCard of repoSubCards) {
        if (subCard.id === selectedSubCard) {
            subCard.classList.add("active");
            let daddy = subCard.parentElement;
            let grandDaddy = daddy.parentElement.querySelector(".card");
            grandDaddy.classList.add('active');
            activateDropdown(grandDaddy, "add");
        }

        subCard.addEventListener("click", () => {
            //Remove all subtag on all subcards
            for (const sub of repoSubCards) {
                sub.classList.remove("active");
            }

            selectedSubCard = subCard.id;
            subCard.classList.add("active");
            localStorage.setItem("activeSubCard", selectedSubCard);
        })
    }

    card.addEventListener("click", () => {
        for (const card of repoCards) {
            card.classList.remove('active');
            activateDropdown(card, "remove");      
        }

        activateDropdown(card, "add");
        card.classList.add('active');
        selected = card.id;
        localStorage.setItem("activeCard", selected);
    });
}

//Remove or add show class to sub cards
function activateDropdown(btn, state){
    let parent = btn.parentElement;
    let allContents = parent.querySelectorAll(".content");
    console.log(allContents);

    if (state === "remove") {
        for (const item of allContents) {
            item.classList.remove("show");
        }
    } else if (state === "add") {
        for (const item of allContents) {
            item.classList.add("show");
        }
    }
}
