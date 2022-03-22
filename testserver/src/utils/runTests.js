const fetch = require("node-fetch");
const fs = require('fs');

const { filterData } = require("./getData");

function runTests() {
    // If tests fail
    // Generate test report and store it in test folder in GitHub repository
    // Update functionInfo.json
    // Close pull request
    // Send response back to GitHub Actions 

    // If tests pass
    // Open pull request
}

async function createTestFolder(repository, branch, actor) {
    const url = `http://api.github.com/repos/${repository}/git/trees/${branch}?recursive=1`;
    const response = await fetch(url);
    const data = await response.json();

    const filteredData = filterData(data, ".test.js");

    for (let file of filteredData) {
        const response = await fetch(file.url);
        const data = await response.json();

        const fileString = new Buffer.from(data.content, 'base64').toString('utf-8');

        console.log(fileString);

        fs.mkdirSync(`src/test-folders/${file.path.replace(/\/[^\/]*?$/, '')}`, { recursive: true }, err => {
            console.log(err);
        })

        fs.appendFileSync(`src/test-folders/${file.path}`, fileString, err => {
            console.log(err);
        })
    }
}


module.exports = { runTests, createTestFolder };