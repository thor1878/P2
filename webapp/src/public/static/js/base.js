let path = window.location.pathname;
let navlinks = document.querySelectorAll("#navbar li");

for (const link of navlinks) {
    link.classList.remove("active");
    if (path === link.getAttribute("name")) {
        link.classList.add("active");
    }
}

//slider
function toggleTheme() {
      let toggle =  document.querySelector("#toggleTheme");
            document.documentElement.classList.toggle('darktheme');
       
   }

