async function submitTests() {
    const submitData = [];
    const numOfFunc = document.querySelector("#numberOfFunctions").textContent;
    
    for (let i = 0; i < numOfFunc; i++) {
        const currentFunc = document.querySelector(`#func-${i}`);
        const testObject = { 
            name: currentFunc.dataset.funcname,
            description: document.querySelector(`#description-${i}`).value,
            args: [], 
            matcher: document.querySelector(`#chooseMatcher-${i}`).value, 
            output: document.querySelector(`#output-${i}`).value, 
            status: currentFunc.dataset.funcstatus 
        };
        for (let j = 0; j < currentFunc.dataset.numofargs; j++) {
            testObject.args.push(document.querySelector(`#input-${i}-${j}`).value);
        }
        submitData.push(testObject);
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