async function submitTests() {
    const submitData = { files: [] };
    const numOfFunc = document.querySelector("#numberOfFunctions").textContent;
    let numOfTc = document.querySelector(`#func-0`).dataset.numOfTc;
    const filePath = document.querySelector(`#selected-file`).textContent;
    
    const fileObject = { path: filePath, functions: [] };

    for (let i = 0; i < numOfFunc; i++) {
        const func = document.querySelector(`#func-${i}`);
        
        fileObject.functions.push({
            name: func.dataset.funcName,
            params: func.dataset.funcParams,
            async: func.dataset.funcAsync,
            status: func.dataset.funcStatus,
            functionString: func.dataset.funcString,
            testCases: []
        });

        numOfTc = func.dataset.numOfTc;

        for (let j = 0; j < numOfTc; j++) {
            const currentTc = document.querySelector(`#tc-${i}-${j}`);
            const testObject = {
                description: document.querySelector(`#description-${i}-${j}`).value,
                arguments: [], 
                matcher: document.querySelector(`#chooseMatcher-${i}-${j}`).value, 
                expected: document.querySelector(`#output-${i}-${j}`).value, 
                status: currentTc.dataset.tcStatus 
            };
            for (let k = 0; k < currentTc.dataset.numOfArgs; k++) {
                testObject.arguments.push(document.querySelector(`#input-${i}-${j}-${k}`).value);
            }
            fileObject.functions[i].testCases.push(testObject);
            submitData.files.push(fileObject);
        }
    }
    console.log(submitData);

    const submitResponse = await fetch("http://localhost:3000/testing", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(submitData)
    })

    // const submitResponse = await fetch("https://f8e2-130-225-198-165.ngrok.io/generate-tests", {
    //     headers: {
    //         "Accept": "application/json",
    //         "Content-Type": "application/json"
    //     },
    //     method: "POST",
    //     body: JSON.stringify(submitData)
    // })

    console.log(submitResponse.json());
}