let buttons = document.querySelectorAll('.card');
let selected = -1;
console.log(buttons);

for (const button of buttons) {
    button.addEventListener("click",()=>{
        button.classList.add('card2');
      
        selected = button.id;
        console.log(selected);

    });

}




