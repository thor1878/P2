const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

const { getRepoData, filterRepoData, getFilesData, getTestInfo } = require('./utils/getData');
const { getLatestCommitSHA, getBaseTreeSHA, createTree, commitTree, updateRef, generateTestTree } = require('./utils/github-push');
const { updateTestInfo } = require('./utils/updateTestInfo');
const { initSetup } = require('./utils/initial-setup');

const app = express();

const PORT = 3001;

// Setup environment variables from .env folder
require('dotenv').config();

// Enable the request object to handle json
app.use(bodyParser.json())

app.use(cors());

// Web app requests an updated test info object.
// The server responds with the updated test info matching {user}/{repository} and {branch} from the request
app.get('/test-info', async (req, res) => {
    const repository = req.query.repository;
    const branch = req.query.branch;
    const gh_token = req.query.token;

    // Get data from GitHub repository branch
    const repoData = await getRepoData(repository, branch, gh_token);

    // Filter data to only include '.js' files (not '.test.js')
    const filteredData = filterRepoData(repoData);

    // Get data for each file (path, function strings, etc...)
    const filesData = await getFilesData(filteredData, gh_token);

    // Get test info file from branch
    const testInfo = await getTestInfo(repoData, gh_token);

    // Update test info (add all functions that are not in test info. Nothing else should be necessary yet)
    const updatedTestInfo = updateTestInfo(testInfo, filesData);

    // Send updated test info back to webapp
    res.send(JSON.stringify(updatedTestInfo));
})

// Web app posts updated test info that contains the most recent modified test cases.
// This test info is used to generate the actual test cases, which are then tested.
app.post('/generate-tests', async (req, res) => {

    const userTestInfo = req.body.userTestInfo;
    const repository = req.body.repository;
    const branch = req.body.branch; 
    const gh_token = req.body.token;

    // Generate tree of test files
    const testTree = generateTestTree(userTestInfo);

    // Get SHA of latest commit on branch
    const latestCommitSHA = await getLatestCommitSHA(repository, branch, gh_token);

    // Get SHA of the base tree (root)
    const baseTreeSHA = await getBaseTreeSHA(repository, latestCommitSHA, gh_token);

    // Create new tree based on userTestInfo
    const newTreeSHA = await createTree(repository, baseTreeSHA, testTree, gh_token);

    // Commit tree
    const newCommitSHA = await commitTree(repository, latestCommitSHA, newTreeSHA, gh_token);

    // Update branch ref
    const response = await updateRef(repository, newCommitSHA, branch, gh_token);

    console.log(response);

    // send req to /check-status
    const resp = await fetch('/check-status', {
        method: "POST",
        body: JSON.stringify({
            userTestInfo: userTestInfo,
            origin: "TS",
            repo: req.body.repo,
            branch: req.body.branch
        })
    })

    const data = await resp.json();

    res.sendStatus(200);
})

const activeActions = [];

app.post('/check-status', (req, res) => {
    const origin = req.body.origin;
    const repo = req.body.repo;
    const branch = req.body.branch;
    const id = `${repo}-${branch}`

    let obj;

    if (origin === "TS") {
        const action = activeActions.find(o => o.id === id);
        action.ready = true;
        action.userTestInfo = req.body.userTestInfo;

        res.sendStatus(200);
    } else if (obj = activeActions.find(o => o.id === id)) {

        if (obj.ready) {
            // Send userTestInfo to GA ...
            res.send(obj.userTestInfo);
            activeActions.splice(activeActions.indexOf(obj), 1);
        } else {
            res.sendStatus(404);
        }
    } else {
        activeActions.push({
            id: id,
            ready: false
        })
        res.sendStatus(404);
    }

    console.log(activeActions);

});

app.post('/setup-repository', (req, res) => {

    const repository = req.body.repository;
    const gh_token = req.body.token;

    console.log(req.body);

    try {
        initSetup(repository, gh_token);
        res.status(200).send({ message: 'Initial setup succesfull' });
    } catch (err) {
        res.status(500).send({ message: err });
    }

})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));