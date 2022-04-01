async function submitTests() {
    const submitData = { files: [] };
    const numOfFiles = document.querySelector("#numberOfFiles").textContent;
    let numOfTc = document.querySelector(`#func-0-0`).dataset.numOfTc;
    
    
    for (let i = 0; i < numOfFiles; i++) {
        const filePath = document.querySelector(`.filepath-${i}`).textContent;
        const fileObject = { path: filePath, functions: [] };
        const numOfFunc = document.querySelector("#numberOfFunctions").textContent;
        for (let j = 0; j < numOfFunc; j++) {
            const func = document.querySelector(`#func-${i}-${j}`);
            
            fileObject.functions.push({
                name: func.dataset.funcName,
                params: func.dataset.funcParams,
                async: func.dataset.funcAsync,
                status: func.dataset.funcStatus,
                functionString: func.dataset.funcString,
                testCases: []
            });
    
            numOfTc = func.dataset.numOfTc;
    
            for (let k = 0; k < numOfTc; k++) {
                const currentTc = document.querySelector(`#tc-${i}-${j}-${k}`);
                const tcObject = {
                    description: document.querySelector(`#description-${i}-${j}-${k}`).value,
                    arguments: [], 
                    matcher: document.querySelector(`#chooseMatcher-${i}-${j}-${k}`).value, 
                    expected: document.querySelector(`#output-${i}-${j}-${k}`).value, 
                    status: currentTc.dataset.tcStatus 
                };
                for (let l = 0; l < currentTc.dataset.numOfArgs; l++) {
                    tcObject.arguments.push(document.querySelector(`#input-${i}-${j}-${k}-${l}`).value);
                }
                fileObject.functions[j].testCases.push(tcObject);
            }
            submitData.files.push(fileObject);
        }
    }
    console.log(submitData);

    await fetch(window.location.href, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(submitData)
    })
}