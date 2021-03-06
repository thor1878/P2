const fetch = require('node-fetch');

async function resetTestFolder(repository, branch, gh_token) {
    const testFolderTree = [{
        path: ".test/test-info.json",
        mode: "100644",
        type: "blob",
        content: "{\n\t\"files\": []\n}"
    }]

    // Get SHA of the latest commit
    const latestCommitSHA = await getLatestCommitSHA(repository, branch, gh_token);
    
    // Get SHA of the base tree (root)
    const baseTreeSHA = await getBaseTreeSHA(repository, latestCommitSHA, gh_token);
    
    // Create new tree based on userTestInfo
    const newTreeSHA = await createTree(repository, baseTreeSHA, testFolderTree, gh_token);

    // Commit tree
    const newCommitSHA = await commitTree(repository, latestCommitSHA, newTreeSHA, gh_token);

    // Update branch reference
    await updateRef(repository, newCommitSHA, branch, gh_token);
}

async function getLatestCommitSHA(repository, branch, gh_token) {
    const response = await fetch(`https://api.github.com/repos/${repository}/git/refs/heads/${branch}`, {
        method: 'GET',
        headers: {
            'Authorization': `token ${gh_token}`,
            'Accept': 'application/vnd.github.v3+json',
        }
    })
    const data = await response.json();

    return data.object.sha;
}

async function getBaseTreeSHA(repository, latestCommitSHA, gh_token) {
    const response = await fetch(`https://api.github.com/repos/${repository}/git/commits/${latestCommitSHA}`, {
        method: 'GET',
        headers: {
            'Authorization': `token ${gh_token}`,
            'Accept': 'application/vnd.github.v3+json',
        }
    })
    const data = await response.json();

    return data.tree.sha;
}

async function createTree(repository, baseTreeSHA, fileTree, gh_token) {
    const response = await fetch(`https://api.github.com/repos/${repository}/git/trees`, {
        method: 'POST',
        headers: {
            'Authorization': `token ${gh_token}`,
            'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
            tree: fileTree,
            base_tree: baseTreeSHA
        })
    })
    const data = await response.json();

    return data.sha;
}

async function commitTree(repository, latestCommitSHA, newTreeSHA, gh_token) {
    const response = await fetch(`https://api.github.com/repos/${repository}/git/commits`, {
        method: 'POST',
        headers: {
            'Authorization': `token ${gh_token}`,
            'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
            message: 'Commit by TestTube',
            parents: [
                latestCommitSHA
            ],
            tree: newTreeSHA,
        })
    })
    const data = await response.json();

    return data.sha
}

async function updateRef(repository, newCommitSHA, branch, gh_token) {
    const response = await fetch(`https://api.github.com/repos/${repository}/git/refs/heads/${branch}`, {
        method: 'POST',
        headers: {
            'Authorization': `token ${gh_token}`,
            'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
            sha: newCommitSHA
        })
    })
    const data = await response.json();

    return data;
}

// Generate the tree of test files to be pushed to GitHub
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

            testString += `const { ${func.name} } = require('${filePath}');\n\n`
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
            path: '.test/' + file.path.replace(/\.js$/, '.test.js'),
            mode: '100644',
            type: 'blob',
            content: testString
        })
    }

    return tree;
}

module.exports = { resetTestFolder, getLatestCommitSHA, getBaseTreeSHA, createTree, commitTree, updateRef, generateTestTree };