const fetch = require('node-fetch');

async function getRepoData(repository, branch) {
    let url = `http://api.github.com/repos/${repository}/git/trees/${branch}?recursive=1`;

    let response = await fetch(url, {
        headers: {
            'Authorization': 'token ' + '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'
        }
    });
    let data = await response.json();

    return data;
}


// Return an array containing only the objects with a path having the '.js' extension (not including '.test.js')
function filterData(data) {
    // let filteredData = [];
    // for (let file of data.tree) {
    //     if (file.path.slice(-3) === '.js' && file.path.slice(-7) !== '.test.js') {
    //         filteredData.push(file);
    //     }
    // }
    // return filteredData;

    return data.tree.filter(file => file.path.slice(-3) === '.js' && file.path.slice(-7) !== '.test.js');
}

async function getFileData(filteredData) {
    let fileData = [];
    for (let file of filteredData) {

        let response = await fetch(file.url, {
            headers: {
                'Authorization': 'token ' + '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'
            }
        });
        let data = await response.json();

        let fileString = new Buffer.from(data.content, 'base64').toString('utf-8');

        let functionStrings = getFunctionStrings(fileString);

        fileData.push({
            path: file.path,
            functionStrings: functionStrings
        })
    }

    return fileData;
}

// Return the function strings from a file string - including additional info about each file string
function getFunctionStrings(fileString) {
    let functionStrings = [];
    let functionDefinitions = fileString.match(/([^\r\n]*?\=\s*)?(async\s*)?function\s*\w*\s*\(.*?\)\s*\{/g);

    if (!functionDefinitions) return '';

    // Loop through all function definitions to find their corresponding body
    for (let func of functionDefinitions) {
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
        let params = functionString.match(/function\s*\w*\s*\((.*?)\)/)[1].split(/\s*,\s*/);
        let name = ( func.match(/[^\r\n]*?\s+(\w+)\s*\=\s*(async\s*)?function/) || func.match(/function\s*(\w*)\s*\(.*?\)/) )[1];
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



module.exports = { getRepoData, filterData, getFileData };