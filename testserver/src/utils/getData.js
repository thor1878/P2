const fetch = require('node-fetch');

async function getRepoData(repository, branch, gh_token) {
    const url = `http://api.github.com/repos/${repository}/git/trees/${branch}?recursive=1`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `token ${gh_token}`
        }
    });
    const data = await response.json();

    return data;
}

// Return an array containing only the objects with a path having the '.js' extension (not including '.test.js')
// and exclude the .js files in the .github folder
function filterRepoData(repoData) {
    // Match anything not starting with '.github/'
    // Then match anything ending with '.js' if '.test' has not preceded it
    return repoData.tree.filter(file => file.path.match(/^(?!\.github\/).*?(?<!\.test)(\.js)$/));
}

async function getFilesData(filteredData, gh_token) {
    let filesData = [];
    for (let file of filteredData) {

        let response = await fetch(file.url, {
            headers: {
                'Authorization': `token ${gh_token}`
            }
        });
        let data = await response.json();

        let fileString = new Buffer.from(data.content, 'base64').toString('utf-8');

        let functionStrings = getFunctionStrings(fileString);

        filesData.push({
            path: file.path,
            functionStrings: functionStrings
        })
    }

    return filesData;
}

// Return the function strings from a file string - including additional info about each file string
function getFunctionStrings(fileString) {
    let functionStrings = [];
    let functionSignatures = fileString.match(/([^\r\n]*?\=[ ]*)?(async[ ]*)?function[ ]*\w*[ ]*\(.*?\)\s*\{/g);

    if (!functionSignatures) return '';

    // Loop through all function definitions to find their corresponding body
    for (let func of functionSignatures) {
        // Don't register anonymous functions (functions without a name)
        let name = (func.match(/[^\r\n]*?\s+(\w+)\s*\=\s*(async\s*)?function/) || func.match(/function\s*(\w*)\s*\(.*?\)/))[1];
        if (!name) continue;

        let start = fileString.indexOf(func);
        let fileIndex = start + func.length;

        let numUnclosedBrackets = 1;

        // Increase the fileIndex until the first bracket is closed
        while (numUnclosedBrackets > 0) {
            let char = fileString[fileIndex];

            if (char === '{') {
                numUnclosedBrackets++;
            } else if (char === '}') {
                numUnclosedBrackets--;
            }

            fileIndex++;
        }

        let end = fileIndex;

        // Extract info about the current function string
        let functionString = fileString.slice(start, end);

        let params = functionString.match(/function\s*\w*\s*\((.*?)\)/)[1].split(/\s*\,\s*/);
        
        let async = func.match(/async\s*function/) ? true : false;

        functionStrings.push({
            functionString: functionString,
            params: params,
            name: name,
            async: async
        });
    }

    return functionStrings;
}

async function getTestInfo(repoData, gh_token) {

    const testInfoFile = repoData.tree.find(file => file.path === '.test/test-info.json');

    const response = await fetch(testInfoFile.url, {
        method: 'GET',
        headers: {
            'Authorization': `token ${gh_token}`,
            'Accept': 'application/vnd.github.v3+json',
        },
    });
    
    const data = await response.json();

    const testInfo = new Buffer.from(data.content, 'base64').toString('utf-8');

    return JSON.parse(testInfo);
}

module.exports = { getRepoData, filterRepoData, getFilesData, getFunctionStrings, getTestInfo };
