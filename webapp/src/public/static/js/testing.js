window.onbeforeunload = function () {
    return "";
}

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
                comment: funcDiv.querySelector('.comment')?.value || "",
                params: funcDiv.dataset.funcParams,
                async: funcDiv.dataset.funcAsync,
                status: funcDiv.dataset.funcStatus,
                functionString: funcDiv.dataset.funcString,
                testCases: []
            });
    
            const tcDivs = funcDiv.querySelectorAll(".tc-div");
            for (const tcDiv of tcDivs) {

                const tcObject = {
                    description: tcDiv.querySelector(".description").value + ` <${funcDiv.dataset.funcName}>`,
                    arguments: [],
                    matcher: tcDiv.querySelector(".selected-matcher").value, 
                    expected: tcDiv.querySelector(".output").value, 
                    passed: tcDiv.querySelector(".tc-pass").textContent === "true"
                };

                const args = tcDiv.querySelectorAll(".arg");
                for (const arg of args) {
                    if (arg.value !== "") {
                        tcObject.arguments.push(arg.value);
                    }
                }
                
                const params = funcDiv.dataset.funcParams;
                const numOfArgs = params === "" ? 0 : params.split(",").length;
                if (tcObject.description !== "" && tcObject.matcher !== "" && tcObject.expected !== ""  && tcObject.arguments.length === numOfArgs) {                
                    fileObject.functions[i].testCases.push(tcObject);
                }
            }
        }
        submitData.files.push(fileObject);
    }
    
    document.body.classList.add("loading-animation");

    await fetch(window.location.href, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(submitData)
    });
    
    window.onbeforeunload = null;
    window.location.href = "/repos";
}