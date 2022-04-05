function addNewTestCase(functionName, funcDiv) {
    // Initial setup - Select elements and calculate index for the new test case and the number of args
    const btnAdd = funcDiv.querySelector(".btn-add");
    const tcDivs = funcDiv.querySelectorAll(".tc-div");
    const newTcNumber = Number(tcDivs[tcDivs.length - 1].dataset.tcIndex) + 2;
    const numOfArgs = tcDivs[tcDivs.length - 1].querySelectorAll(".arg").length;
    
    // Create a a div for the new test case and add id, dataset and so on.
    const newTcDiv = document.createElement("div");
    newTcDiv.classList.add("tc-div");
    newTcDiv.dataset.tcIndex = newTcNumber - 1;
    newTcDiv.dataset.tcPassed = false;

    // Add content to the new test case div
    newTcDiv.innerHTML = `
        <h4>Test case ${newTcNumber} (${functionName})</h4>
        <p>Passed: ${newTcDiv.dataset.tcPassed}</p>

        <section class="tc-description">
            <div class="input-fields">
                <label>Description</label>
                <input type="text" class="description" placeholder="Description for test case" required>
            </div>
        </section>
    `;

    newTcDiv.innerHTML += `
    <section class="tc-arguments"></section>`;

    newTcDiv.innerHTML += `
    <section class="tc-matcher">
        <div class="input-fields">
            <label>Choose matcher</label>
            <select class="selected-matcher" required>
                <option value="">Choose a matcher</option>
                <option value="toBe">toBe</option>
                <option value="toEqual">toEqual</option>
                <option value="toBeCloseTo">toBeCloseTo</option>
                <option value="toContain">toContain</option>
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
}

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
