let path = window.location.pathname;
let navlinks = document.querySelectorAll("#navbar li");

for (const link of navlinks) {
    link.classList.remove("active");
    //console.log(link.getAttribute("name"));
    if (path === link.getAttribute("name")) {
        link.classList.add("active");
    }
}
