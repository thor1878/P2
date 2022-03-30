const fetch = require('node-fetch');

async function getLatestCommitSHA(branch) {
    const response = await fetch('https://api.github.com/repos/thor1878/GitHub-Actions-test/git/refs/heads/' + branch, {
        method: 'GET',
        headers: {
            'Authorization': 'token ' + process.env.GITHUB_TOKEN,
            'Accept': 'application/vnd.github.v3+json',
        }
    })
    const data = await response.json();

    return data.object.sha;
}

async function getBaseTreeSHA(latestCommitSHA) {
    const response = await fetch('https://api.github.com/repos/thor1878/GitHub-Actions-test/git/commits/' + latestCommitSHA, {
        method: 'GET',
        headers: {
            'Authorization': 'token ' + process.env.GITHUB_TOKEN,
            'Accept': 'application/vnd.github.v3+json',
        }
    })
    const data = await response.json();

    return data.tree.sha;
}

async function createTree(baseTreeSHA, userTestInfo) {
    const response = await fetch('https://api.github.com/repos/thor1878/GitHub-Actions-test/git/trees', {
        method: 'POST',
        headers: {
            'Authorization': 'token ' + process.env.GITHUB_TOKEN,
            'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
            tree: generateTestTree(userTestInfo),
            base_tree: baseTreeSHA
        })
    })
    const data = await response.json();

    return data.sha;
}

async function commitTree(latestCommitSHA, newTreeSHA) {
    const response = await fetch('https://api.github.com/repos/thor1878/GitHub-Actions-test/git/commits', {
        method: 'POST',
        headers: {
            'Authorization': 'token ' + process.env.GITHUB_TOKEN,
            'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
            message: 'testing commit',
            parents: [
                latestCommitSHA
            ],
            tree: newTreeSHA,
        })
    })
    const data = await response.json();

    return data.sha
}

async function updateRef(newCommitSHA, branch) {
    const response = await fetch('https://api.github.com/repos/thor1878/GitHub-Actions-test/git/refs/heads/' + branch, {
        method: 'POST',
        headers: {
            'Authorization': 'token ' + process.env.GITHUB_TOKEN,
            'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
            sha: newCommitSHA
        })
    })
    const data = await response.json();

    return data;
}

function generateTestTree(userTestInfo) {

    
    const files = userTestInfo.files;

    let tree = [];

    for (const file of files) {
        let testString = '';

        for (const func of file.functions) {

            let filePathDepth = (file.path.match(/\//g) || []).length;
            let filePath = '';

            for (let i = 0; i <= filePathDepth; i++) {
                filePath += '../';
            }

            filePath += file.path;


            testString += `const ${func.name} = require('${filePath}');\n\n`
        }


        for (const func of file.functions) {
            for (const tc of func.testCases) {

                testString += 

`test('${tc.description}', async () => {
    const result = await ${func.name}(${tc.arguments});
    expect(result).${tc.matcher}(${tc.expected});
})
`
                
            }
        }

        tree.push({
            path: 'test/' + file.path.replace(/\.js$/, '.test.js'),
            mode: '100644',
            type: 'blob',
            content: testString
        })
    }

    return tree;
}


module.exports = { getLatestCommitSHA, getBaseTreeSHA, createTree, commitTree, updateRef };