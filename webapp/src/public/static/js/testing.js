async function submitTests(event) {
    event.preventDefault();
    const submitData = { files: [] };
    const fileDivs = document.querySelectorAll(".file-div");

    for (const fileDiv of fileDivs) {
        const filePath = fileDiv.querySelector(".file-path").textContent;
        const fileObject = { path: filePath, functions: [] };

        const funcDivs = fileDiv.querySelectorAll(".func-div");
        for (const [i, funcDiv] of funcDivs.entries()) {
            fileObject.functions.push({
                name: funcDiv.dataset.funcName,
                params: funcDiv.dataset.funcParams,
                async: funcDiv.dataset.funcAsync,
                status: funcDiv.dataset.funcStatus,
                functionString: funcDiv.dataset.funcString,
                testCases: []
            });
    
            const tcDivs = funcDiv.querySelectorAll(".tc-div");
            for (const tcDiv of tcDivs) {
                const tcObject = {
                    description: tcDiv.querySelector(".description").value,
                    arguments: [],
                    matcher: tcDiv.querySelector(".selected-matcher").value, 
                    expected: tcDiv.querySelector(".output").value, 
                    passed: tcDiv.dataset.tcPassed === "true"
                };

                const args = tcDiv.querySelectorAll(".arg");
                for (const arg of args) {
                    tcObject.arguments.push(arg.value);
                }
                fileObject.functions[i].testCases.push(tcObject);
            }
        }
        submitData.files.push(fileObject);
    }
    console.log(submitData);

    await fetch(window.location.href, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(submitData)
    });
}