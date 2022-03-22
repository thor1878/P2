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

    console.log(data);
}


module.exports = { runTests, createTestFolder };