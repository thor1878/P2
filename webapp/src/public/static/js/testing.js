async function submitTests() {
    const submitData = { files: [] };
    const numOfFiles = document.querySelector("#number-of-files").textContent;    
    
    for (let i = 0; i < numOfFiles; i++) {
        const filePath = document.querySelector(`.file-path-${i}`).textContent;
        const fileObject = { path: filePath, functions: [] };
        const numOfFunc = document.querySelector(`#num-of-func-${i}`).textContent;
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
    
            const numOfTc = func.querySelectorAll('.tc-div').length;
    
            for (let k = 0; k < numOfTc; k++) {
                const currentTc = document.querySelector(`#tc-${i}-${j}-${k}`);
                const tcObject = {
                    description: document.querySelector(`#description-${i}-${j}-${k}`).textContent,
                    arguments: [], 
                    matcher: document.querySelector(`#choose-matcher-${i}-${j}-${k}`).value, 
                    expected: document.querySelector(`#output-${i}-${j}-${k}`).textContent, 
                    status: currentTc.dataset.tcStatus 
                };
                for (let l = 0; l < currentTc.dataset.numOfArgs; l++) {
                    tcObject.arguments.push(document.querySelector(`#input-${i}-${j}-${k}-${l}`).textContent);
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