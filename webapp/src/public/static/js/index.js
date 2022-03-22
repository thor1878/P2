async function submitTests() {
    const submitData = { files: [] };
    const numOfFunc = document.querySelector("#numberOfFunctions").textContent;
    let numOfTc = document.querySelector(`#func-0`).dataset.numoftc;
    const filePath = document.querySelector(`#selectedFile`).textContent;
    
    const fileObject = { path: filePath, functions: [] };

    for (let i = 0; i < numOfFunc; i++) {
        const func = document.querySelector(`#func-${i}`);
        
        fileObject.functions.push({
            name: func.dataset.funcname,
            params: func.dataset.funcparams,
            async: func.dataset.funcasync,
            status: func.dataset.funcstatus,
            functionString: func.dataset.funcstring,
            testCases: []
        });

        numOfTc = func.dataset.numoftc;

        for (let j = 0; j < numOfTc; j++) {
            const currentTc = document.querySelector(`#tc-${i}-${j}`);
            const testObject = {
                description: document.querySelector(`#description-${i}-${j}`).value,
                arguments: [], 
                matcher: document.querySelector(`#chooseMatcher-${i}-${j}`).value, 
                expected: document.querySelector(`#output-${i}-${j}`).value, 
                status: currentTc.dataset.tcstatus 
            };
            for (let k = 0; k < currentTc.dataset.numofargs; k++) {
                testObject.arguments.push(document.querySelector(`#input-${i}-${j}-${k}`).value);
            }
            fileObject.functions[i].testCases.push(testObject);
            submitData.files.push(fileObject);
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