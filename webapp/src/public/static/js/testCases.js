// const testInfo = require("..\..\..\src\dummy\filesData.json");
// console.log(testInfo);

function addNewTestCase(functionName, filedex, funcdex) {
    // const stdTcStatus = false;

    // Initial setup - Select elements and calculate index for the new test case and the number of args
    const btnAdd = document.querySelector(`#btn-add-${filedex}-${funcdex}`);
    const funcDiv = document.querySelector(`#func-${filedex}-${funcdex}`);
    const currentTestCases = funcDiv.querySelectorAll(".tc-div");
    const newTcIndex = Number(currentTestCases[currentTestCases.length - 1].dataset.tcIndex) + 1;
    const numOfArgs = currentTestCases[currentTestCases.length - 1].querySelectorAll(".arg").length;
    
    // Create a a div for the new test case and add id, dataset and so on.
    const newTestCaseDiv = document.createElement("div");
    newTestCaseDiv.classList.add("tc-div");
    newTestCaseDiv.id = `tc-${filedex}-${funcdex}-${newTcIndex}`;
    newTestCaseDiv.dataset.tcIndex = newTcIndex;
    newTestCaseDiv.dataset.numOfArgs = numOfArgs;
    // newTestCaseDiv.dataset.tcStatus = stdTcStatus;

    // Add content to the new test case div
    newTestCaseDiv.innerHTML = `
        <h4>Test case ${newTcIndex + 1} (${functionName})</h4>
        <section class="tc-description">
            <div class="input-fields">
                <label for="description-${filedex}-${funcdex}-${newTcIndex}">Description</label>
                <input type="text" class="description" id="description-${filedex}-${funcdex}-${newTcIndex}" placeholder="Description for test case">
            </div>
        </section>
    `;
    newTestCaseDiv.innerHTML += `
        <section class="tc-arguments">`;
    // For-loop to generate input fields for the arguments
    for (let i = 0; i < numOfArgs; i++) {
        newTestCaseDiv.innerHTML += `    
            <div class="input-fields">
                <label for="input-${filedex}-${funcdex}-${newTcIndex}-${i}">Argument ${i + 1}</label>
                <input type="text" class="input" id="input-${filedex}-${funcdex}-${newTcIndex}-${i}" value="Enter value">
            </div>
        `;
    }

    // PROBLEM (PROBABLY SOME ASYNC SHIT)
    newTestCaseDiv.innerHTML += `
        </section>`;
    
    newTestCaseDiv.innerHTML += `
        <section class="tc-matcher">
            <div class="input-fields">
                <label for="chooseMatcher-${filedex}-${funcdex}-${newTcIndex}">Choose matcher</label>
                <select id="chooseMatcher-${filedex}-${funcdex}-${newTcIndex}">
                    <option value="toBe">toBe</option>
                    <option value="toEqual">toEqual</option>
                    <option value="toBeCloseTo">toBeCloseTo</option>
                    <option value="toContain">toContain</option>
                </select>
            </div>
        </section>

        <section class="tc-output">
            <div class="input-fields">
                <label for="output-${filedex}-${funcdex}-${newTcIndex}">Expected output</label>
                <input type="text" class="output" id="output-${filedex}-${funcdex}-${newTcIndex}" placeholder="Enter expected output">
            </div>
        </section>
        
        <button id="btn-del-${filedex}-${funcdex}-${newTcIndex}" class="btn-del" onclick="removeTestCase(${filedex}, ${funcdex}, ${newTcIndex})">Delete test case ${newTcIndex + 1}</button>
    `;
    // funcDiv.append(newTestCaseDiv);

    funcDiv.insertBefore(newTestCaseDiv, btnAdd);
}

function removeTestCase(filedex, funcdex, tcdex) {
    const testCaseDiv = document.querySelector(`#tc-${filedex}-${funcdex}-${tcdex}`);
    testCaseDiv.classList.add("closed");
    setTimeout( () => {
        testCaseDiv.remove();
    }, 200);
}
