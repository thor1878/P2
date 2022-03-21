const fs = require('fs');

function generateTests(){
    let data = fs.readFileSync("../../../structure-test.json");
    let generatedTests = [];
    let files = JSON.parse(data).files;

    for (const file of files) {
        for (const func of file.functions) {
            for (const tc of func.testCases) {
                let functionString = `test(${tc.description}, async () => {
                    const result = await ${func.name}(${JSON.stringify([...tc.arguments])});
                    expect(result).${tc.matcher}(${tc.expected});
                })`
                console.log(functionString);
            }
        }
    }
}


generateTests();







