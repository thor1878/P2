const fs = require('fs');
const { getLatestCommitSHA, getBaseTreeSHA, createTree, commitTree, updateRef } = require('../utils/github-push');

// Inject content of setup-folder to users repository on main branch
async function initSetup(repository, gh_token) {
    const branch = 'main';

    // Generate the setup tree from the setup-folder
    const setupTree = await generateSetupTree();

    // Get SHA of latest commit on branch
    const latestCommitSHA = await getLatestCommitSHA(repository, branch, gh_token);
    
    // Get SHA of the base tree (root)
    const baseTreeSHA = await getBaseTreeSHA(repository, latestCommitSHA, gh_token);
    
    // Create new tree based on userTestInfo
    const newTreeSHA = await createTree(repository, baseTreeSHA, setupTree, gh_token);

    // Commit tree
    const newCommitSHA = await commitTree(repository, latestCommitSHA, newTreeSHA, gh_token);

    // Update branch ref
    const response = await updateRef(repository, newCommitSHA, branch, gh_token);

    console.log(response);
}

async function generateSetupTree() {
    const files = [
        '.github/actions/run-tests-action/index.js',
        '.github/actions/run-tests-action/action.yaml',
        '.github/actions/update-test-info-action/index.js',
        '.github/actions/update-test-info-action/action.yaml',
        '.github/actions/wait-for-response-action/index.js',
        '.github/actions/wait-for-response-action/action.yaml',
        '.github/workflows/main.yml',
        '.github/config.json',
        '.test/test-info.json'
    ];

    const setupTree = [];

    for (const file of files) {
        const content = await fs.promises.readFile('src/setup-folder/' + file, {
            encoding: 'utf-8'
        });

        setupTree.push({
            path: file,
            mode: '100644',
            type: 'blob',
            content: content
        })
    }

    return setupTree;
}

module.exports = { initSetup };