// Animation on homepage - keys and colors defined.
let text = document.querySelector(".animation-text");
const objects = [
    { key: 'const ', color: 'rgb(101,166,221)' },
    { key: '{ ', color: 'rgb(217,217,217)' },
    { key: 'sum ', color: 'rgb(96,200,255)' },
    { key: ' } ', color: 'rgb(217,217,217)' },
    { key: '= ', color: 'rgb(217,217,217)' },
    { key: 'require', color: 'rgb(225,224,177)' },
    { key: '(', color: 'rgb(217,217,217)' },
    { key: '\'src/sum.js\'', color: 'rgb(210,155,130)' },
    { key: ')', color: 'rgb(217,217,217)' },
    { key: ';\n\n', color: 'rgb(217,217,217)' },
    { key: 'test', color: 'rgb(225,224,177)' },
    { key: '(', color: 'rgb(217,217,217)' },
    { key: '\'Sum two numbers\'', color: 'rgb(210,155,130)' },
    { key: ', ', color: 'rgb(217,217,217)' },
    { key: '() ', color: 'rgb(217,217,217)' },
    { key: '=> ', color: 'rgb(101,166,221)' },
    { key: '{\n', color: 'rgb(217,217,217)' },
    { key: '\texpect', color: 'rgb(225,224,177)' },
    { key: '(', color: 'rgb(217,217,217)' },
    { key: 'sum', color: 'rgb(225,224,177)' },
    { key: '(', color: 'rgb(217,217,217)' },
    { key: '3', color: 'rgb(190,211,176)' },
    { key: ', ', color: 'rgb(217,217,217)' },
    { key: '4', color: 'rgb(190,211,176)' },
    { key: ')).', color: 'rgb(217,217,217)' },
    { key: 'toBe', color: 'rgb(225,224,177)' },
    { key: '(', color: 'rgb(217,217,217)' },
    { key: '7', color: 'rgb(190,211,176)' },
    { key: ');\n', color: 'rgb(217,217,217)' },
    { key: '});', color: 'rgb(217,217,217)' },
]

// Prints the next key (in animation)
async function logChar(timeout, char, color) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let span = document.createElement("span");
            span.innerHTML += char;
            span.style.color = color;
            text.append(span);
            resolve();
        }, timeout);
    })
}

// Prints the whole test case animation with a random timeout
async function logStuff() {
    for (const obj of objects) {
        for (const letter of obj.key) {
            let timeout;
            let char;
            if (letter === "\n") {
                char = "<br>"
            } else if (letter === "\t") {
                char = "&nbsp;&nbsp;&nbsp;";
            } else {
                char = letter;
            }
            
            timeout = Math.random() < 0.8 ? Math.random() / 5 * 700 + 50 : 400;

            await logChar(timeout, char, obj.color);
        }

    }
    await logChar(2000, "", "blue");
    text.innerHTML = "";

    await logStuff();
}

// Start the animation on the home page
logStuff();

// Reveal (animate) step divs on home page
function reveal() {
    let reveals = document.querySelectorAll(".step-div");

    for (let i = 0; i < reveals.length; i++) {
        let windowHeight = window.innerHeight;
        let elementTop = reveals[i].getBoundingClientRect().top;
        let elementVisible = 15;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);
