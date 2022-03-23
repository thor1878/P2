const fetch = require("node-fetch");
const jest = require('jest');
const fs = require('fs');

const { filterData } = require("./getData");

async function runTests(testFolder) {
    console.log(testFolder);

    const options = { root: [testFolder] }

    const testResults = await jest.runCLI(options, options.root);

    return testResults;
}

async function createTestFolder(repository, branch, actor) {
    const url = `http://api.github.com/repos/${repository}/git/trees/${branch}?recursive=1`;
    const response = await fetch(url);
    const data = await response.json();

    const filteredData = filterData(data, ".test.js");

    const testFolder = `src/test-folders/${actor}-${branch}`;

    for (let file of filteredData) {
        const response = await fetch(file.url);
        const data = await response.json();

        const fileString = new Buffer.from(data.content, 'base64').toString('utf-8');

        fs.mkdirSync(`${testFolder}/${file.path.replace(/\/[^\/]*?$/, '')}`, { recursive: true }, err => {
            console.log(err);
        })

        fs.appendFileSync(`${testFolder}/${file.path}`, fileString, err => {
            console.log(err);
        })
    }

    // Return path to test folder
    return testFolder;
}


module.exports = { runTests, createTestFolder };