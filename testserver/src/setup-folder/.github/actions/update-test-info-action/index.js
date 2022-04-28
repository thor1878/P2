const core = require('@actions/core');
const fs = require('fs');

const functionStatuses = require('../../config.json').functionStatuses;

const testResults = JSON.parse(core.getInput('test-results'));
const userTestInfo = JSON.parse(core.getInput('user-test-info'));
const githubWorkspace = core.getInput('github-workspace')

// Variable that stores the overall status of all tests.
// Is set to true, if one or more tests fail.
let hasFailed = 'false';

// Loop through all files in userTestInfo
for (const file of userTestInfo.files) {
    
    // Test results for the current file
    const fileTestObj = testResults.results.testResults.find(obj => obj.testFilePath.replace(githubWorkspace + '/.test/', '') === file.path.replace(/\.js$/, '.test.js'));

    // Object to categorize all test cases in file by function
    const tcsInFile = {};

    // Loop through all functions in the file to determine wich functions have passed (code 2) or failed (code -1)
    for (const func of file.functions) {

        // If the user has excluded the function from testing
        if (func.status === functionStatuses.assessed) continue;

        // Loop through all test cases in function
        for (const tc of func.testCases) {

            // Find the test results for the current test case
            const tcTestObj = fileTestObj.testResults.find(obj => obj.title === tc.description);

            // If these results exist (they should), update the function's number of passed and failed tests
            if (tcTestObj) {
                tc.passed = tcTestObj.status === 'passed' ? true : false;

                // Set the overall status of all tests to 'failed'
                if (!tc.passed) {
                    hasFailed = 'true';
                }

                const tcFuncName = tcTestObj.title.match(/\<(.*?)\>$/)[1];

                if (!tcsInFile[tcFuncName]) {
                    tcsInFile[tcFuncName] = { numPassed: 0, numFailed: 0 };
                }
                tcsInFile[tcFuncName].numPassed += tc.passed ? 1 : 0;
                tcsInFile[tcFuncName].numFailed += tc.passed ? 0 : 1;
            }
        }
    }
    // Loop through all the functions and their corresponding test cases
    for (const [funcName, funcStatus] of Object.entries(tcsInFile)) {
        const func = file.functions.find(obj => obj.name === funcName);
        if (func.status !== functionStatuses.assessed) {
            func.status = funcStatus.numFailed > 0 ? functionStatuses.failed : functionStatuses.passed;
        }
    }
}

try {
    fs.unlinkSync('./.test/test-info.json')
} catch {
    console.log('Cannot delete non-existing file');
}

fs.writeFileSync('./.test/test-info.json', JSON.stringify(userTestInfo, null, 2));

core.setOutput("hasFailed", hasFailed);