// ----- Logic to control the drop down on 'Choose repository' -----

const allCards = document.querySelectorAll('.card');
const allSubCards = document.querySelectorAll(".sub-card");

const selectedCard = localStorage.getItem("activeCard");
const selectedSubCard = localStorage.getItem("activeSubCard");

// Loop through all cards in the html with the tag .card
for (const card of allCards) {

    // Loop through all subCards of card
    for (const subCard of allSubCards) {
        if (subCard.id === selectedSubCard) {
            subCard.classList.add("active");
            const cardParent = subCard.parentElement.parentElement.querySelector(".card");
            cardParent.classList.add('active');
            activateDropdown(cardParent, "add");
        }

        // Listen for click events on all subCards
        subCard.addEventListener("click", () => {
            for (const sub of allSubCards) {
                sub.classList.remove("active");
            }

            subCard.classList.add("active");
            localStorage.setItem("activeSubCard", subCard.id);
        })
    }

    // Listen for click events on all cards
    card.addEventListener("click", () => {
        for (const card of allCards) {
            card.classList.remove('active');
            activateDropdown(card, "remove");      
        }

        activateDropdown(card, "add");
        card.classList.add('active');
        localStorage.setItem("activeCard", card.id);
    });
}

// Remove or add .show class to sub cards
function activateDropdown(btn, state){
    const allContents = btn.parentElement.querySelectorAll(".content");

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

function setupRepository(repo) {
    if (confirm('Confirm setup of repository')) {
        document.body.classList.add('loading-animation');
        location.href = `/${repo}/setup`;
    }
}