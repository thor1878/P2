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
        }
        button.classList.add('active');
        selected = button.id;
        localStorage.setItem("activeCard",selected);
    });

}




