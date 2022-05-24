// ----- Functions for the 'Testing' page -----

// Adds a new (empty) test case to a given function
function addNewTestCase(functionName, funcDiv, newTcindex, matchers) {
    // Initial setup - Select elements and calculate index for the new test case and the number of args
    const btnAdd = funcDiv.querySelector(".btn-add");
    const newTcNumber = Number(newTcindex) + 1;
    const params = funcDiv.dataset.funcParams; 
    const numOfArgs = params === "" ? 0 : params.split(",").length;
    
    // Create a div for the new test case, add id, dataset and so on.
    const newTcDiv = document.createElement("div");
    newTcDiv.classList.add("tc-div");
    newTcDiv.dataset.tcIndex = newTcindex;

    // Add content to the new test case div
    newTcDiv.innerHTML = `
        <h4>Test case ${newTcNumber} (${functionName})</h4>
        <p>Passed: <a class="tc-pass">false</a></p>

        <section class="tc-description">
            <div class="input-fields">
                <label>Description</label>
                <input type="text" class="description" placeholder="Description for test case" required>
            </div>
        </section>
    `;

    // Section for arguments
    newTcDiv.innerHTML += `
    <section class="tc-arguments"></section>`;

    // Section for matchers and output
    newTcDiv.innerHTML += `
    <section class="tc-matcher">
        <div class="input-fields">
            <label>Choose matcher</label>
            <select class="selected-matcher" required>
                <option value="" selected>Choose a matcher</option>
            </select>
        </div>
    </section>

    <section class="tc-output">
        <div class="input-fields">
            <label>Expected output</label>
            <input type="text" class="output" placeholder="Enter expected output" required>
        </div>
    </section>

    <button type="button" class="btn-del" onclick="removeTestCase(this.parentElement)">Delete test case ${newTcNumber}</button>
    `;
    
    // For-loop to append an <option> tag for each matcher
    const matcherSelect = newTcDiv.querySelector(".selected-matcher");
    for (const matcher of matchers.split(",")) {
        matcherSelect.innerHTML += `<option value="${matcher}">${matcher}</option>`;         
    }

    // For-loop to generate input fields for the arguments
    const tcArgSection = newTcDiv.querySelector(".tc-arguments");
    for (let i = 0; i < numOfArgs; i++) {
        tcArgSection.innerHTML += `    
        <div class="input-fields">
            <label>Argument ${i + 1}</label>
            <input type="text" class="input arg" placeholder="Enter value" required>
        </div>
        `;
    }
    
    // Insert before the 'add new test case' button.
    funcDiv.insertBefore(newTcDiv, btnAdd);

    // If btnAdd exists, update the onclick attribute with the new number of test cases.
    btnAdd?.setAttribute("onclick", `addNewTestCase('${functionName}', this.parentElement, ${newTcNumber}, '${matchers}')`);
}

// Filter out the <functionName> in the description
function addDescription(description, tcDescription) {
    const newDescription = description.split(' <')[0];
    tcDescription.innerHTML += `
    <input type="text" class="description" value="${newDescription}" required>
    `
}

// Remove test case after an animation of 600ms
function removeTestCase(tcDiv) {
    const numTestCases = tcDiv.parentElement.querySelectorAll(".tc-div").length;

    // Logic to make sure users don't delete the last test case.
    if (numTestCases === 1) {
        alert("The last test case to a function cannot be deleted");
    } else {
        tcDiv.classList.add("closed");
        setTimeout( () => {
            tcDiv.remove();
        }, 600);
    }
}

// Toggle between including and excluding a function
function toggleFunction(funcName, funcDiv, matchers) {
    const btn = funcDiv.querySelector(".btn-include") ||  funcDiv.querySelector(".btn-exclude");
    const funcStatusField = funcDiv.querySelector(".func-status");
    let statusExplainer = funcStatusField.parentElement.nextElementSibling;
    const commentDiv = funcDiv.querySelector(".input-fields");
    const tcDivs = funcDiv.querySelectorAll(".tc-div");
    const inputFields = funcDiv.querySelectorAll("input");
    const selectFields = funcDiv.querySelectorAll("select")
    const btnAdd = funcDiv.querySelector(".btn-add");

    // Pressing the 'Exclude' button - add comment field, change status, change button to 'Include', hide all tcDivs and the button to add new test cases.
    if (btn.classList.contains("btn-exclude")) {
        const commentLabel = document.createElement("label");
        const commentField = document.createElement("input");
        
        btn.textContent = `Include ${funcName}`;
        btn.classList.remove("btn-exclude");
        btn.classList.add("btn-include");
        
        funcDiv.dataset.prevFuncStatus = funcDiv.dataset.funcStatus;
        funcDiv.dataset.funcStatus = 1;
        funcStatusField.textContent = funcDiv.dataset.funcStatus;
        statusExplainer.textContent = `Assessed: ${funcName} will NOT be tested.`;

        commentLabel.textContent = "Comment";
        commentDiv.append(commentLabel);
        commentField.classList.add("comment");
        commentField.placeholder = "Write comment here";
        commentField.setAttribute("required", "");
        commentDiv.append(commentField);
        
        for (const tcDiv of tcDivs) {
            tcDiv.setAttribute("hidden","");
        }
        
        for (const inputField of inputFields) {
            inputField.removeAttribute("required");
        }

        for (const selectField of selectFields) {
            selectField.removeAttribute("required");
        }

        btnAdd.setAttribute("hidden", "");
    }
    // Pressing the 'Include' button - remove comment field, change status, change button to 'Exclude', show all tcDivs and the button to add new test cases.
    else {
        btn.textContent = `Exclude ${funcName}`;
        btn.classList.remove("btn-include");
        btn.classList.add("btn-exclude");

        // If there were none previous test cases, change status to 0 and add an empty test case
        if (funcDiv.dataset.prevFuncStatus === undefined && funcDiv.dataset.numTc === "0") {
            funcDiv.dataset.funcStatus = 0;
            addNewTestCase(funcName, funcDiv, 0, matchers);
        } 
        // If there were previous test cases - change status to 0, test cases might need an update.
        else if (funcDiv.dataset.prevFuncStatus === undefined && funcDiv.dataset.numTc !== "0") {
            funcDiv.dataset.funcStatus = 0;
        }
        // If a previousFuncStatus has been stored (user has pressed the include/exclude button at least once)
        else {
            funcDiv.dataset.funcStatus = funcDiv.dataset.prevFuncStatus;

            for (const tcDiv of tcDivs) {
                tcDiv.removeAttribute("hidden");
            }
    
            for (const inputField of inputFields) {
                inputField.setAttribute("required", "");
            }
    
            for (const selectField of selectFields) {
                selectField.setAttribute("required", "");
            }
        }
        funcStatusField.textContent = funcDiv.dataset.funcStatus;
        funcDiv.dataset.prevFuncStatus = 1;
        
        switch (Number(funcDiv.dataset.funcStatus)) {
            case -1:
                statusExplainer.textContent = `At least one test case failed.`;
                break;
            case 0:
                statusExplainer.textContent = `Not assessed: Choose to either include or exclude ${funcName} from test`;
                break;
            case 2:
                statusExplainer.textContent = `All tests passed: 100% code-coverage of ${funcName}.`;
                break;
            default:
                break;
        }
        funcDiv.querySelector(".comment").previousElementSibling.remove();
        funcDiv.querySelector(".comment").remove();
        
        btnAdd.removeAttribute("hidden");
    }   
}
