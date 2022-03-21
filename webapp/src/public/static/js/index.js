//Main file
async function submitTests() {
    const submitData = [];
    const numOfFunc = document.querySelector("#numberOfFunctions").textContent;
    
    for (let i = 0; i < numOfFunc; i++) {
        const currentFunc = document.querySelector(`#func-${i}`);
        const testObject = { 
            name: currentFunc.dataset.funcname, 
            args: [], 
            matcher: document.querySelector(`#matcher${i}`).value, 
            output: document.querySelector(`#output${i}`).value, 
            status: currentFunc.dataset.funcstatus 
        };
        for (let j = 0; j < currentFunc.dataset.numofargs; j++) {
            testObject.args.push(document.querySelector(`#input${i}-${j}`).value);
        }
        submitData.push(testObject);
    }
    console.log(submitData);
}