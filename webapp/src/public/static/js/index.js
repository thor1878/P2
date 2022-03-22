async function submitTests() {
    const submitData = [];
    const numOfFunc = document.querySelector("#numberOfFunctions").textContent;
    let numOfTc = document.querySelector(`#func-0`).dataset.numoftc;
    
    for (let i = 0; i < numOfFunc; i++) {
        numOfTc = document.querySelector(`#func-${i}`).dataset.numoftc;
        for (let j = 0; j < numOfTc; j++) {
            const currentTc = document.querySelector(`#tc-${i}-${j}`);
            const testObject = { 
                name: currentTc.dataset.funcname,
                description: document.querySelector(`#description-${i}-${j}`).value,
                args: [], 
                matcher: document.querySelector(`#chooseMatcher-${i}-${j}`).value, 
                output: document.querySelector(`#output-${i}-${j}`).value, 
                status: currentTc.dataset.funcstatus 
            };
            for (let k = 0; k < currentTc.dataset.numofargs; k++) {
                testObject.args.push(document.querySelector(`#input-${i}-${j}-${k}`).value);
            }
            submitData.push(testObject);
        }
    }
    console.log(submitData);

    const submitResponse = await fetch("http://localhost:3000/submit", {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(submitData)
    })

    console.log(submitResponse.json());
}