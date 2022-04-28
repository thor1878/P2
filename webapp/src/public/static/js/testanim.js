function reveal() {
  let reveals = document.querySelectorAll(".step-div");

  for (var i = 0; i < reveals.length; i++) {
    let windowHeight = window.innerHeight;
    let elementTop = reveals[i].getBoundingClientRect().top;
    let elementVisible = 15;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      
    }
  }
}

window.addEventListener("scroll", reveal);