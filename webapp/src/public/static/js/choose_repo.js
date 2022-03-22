let buttons = document.querySelectorAll('.card');
let selected = -1;
console.log(buttons);

for (const button of buttons) {
    button.addEventListener("click", () => {
        
        for (const button of buttons) {
            button.classList.remove('active');
        }

        button.classList.add('active');
      
        selected = button.id;
        console.log(selected);
    });

}




