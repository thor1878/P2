const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

const { getRepoData, filterRepoData, getFilesData, getTestInfo } = require('./utils/getData');
const { getLatestCommitSHA, getBaseTreeSHA, createTree, commitTree, updateRef } = require('./utils/updateTests');
const { updateTestInfo } = require('./utils/updateTestInfo')

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
    console.log(req.query);

    // Get data from GitHub repository branch
    const repoData = await getRepoData(req.query.repository, req.query.branch);

    // Filter data to only include '.js' files (not '.test.js')
    const filteredData = filterRepoData(repoData);

    // Get data for each file (path, function strings, etc...)
    const filesData = await getFilesData(filteredData);

    // Get test info file from branch
    const testInfo = await getTestInfo(repoData);

    // console.log('\nNormal:');
    // console.log(JSON.stringify(testInfo, null, 4));

    // Update test info (add all functions that are not in test info. Nothing else should be necessary yet)
    const updatedTestInfo = updateTestInfo(testInfo, filesData);

    // console.log('\nUpdated:');
    // console.log(JSON.stringify(updatedTestInfo, null, 4));

    // Send updated test info back to webapp
    res.send(JSON.stringify(updatedTestInfo));
})

// Web app posts updated test info that contains the most recent modified test cases.
// This test info is used to generate the actual test cases, which are then tested.
app.post('/generate-tests', async (req, res) => {

    const branch = 'main';
    const userTestInfo = req.body;

    // Get SHA of latest commit on branch
    const latestCommitSHA = await getLatestCommitSHA(branch);

    // Get SHA of the base tree (root)
    const baseTreeSHA = await getBaseTreeSHA(latestCommitSHA);

    // Create new tree based on userTestInfo
    const newTreeSHA = await createTree(baseTreeSHA, userTestInfo);

    // Commit tree
    const newCommitSHA = await commitTree(latestCommitSHA, newTreeSHA);

    // Update branch ref
    const response = await updateRef(newCommitSHA, branch);

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
        const action = activeActions.find(obj => obj.id === id);
        action.ready = true;
        action.userTestInfo = req.body.userTestInfo;

        res.sendStatus(200);
    }
    else if (obj = activeActions.find(obj => obj.id === id)) {

        if (obj.ready) {
            // Send userTestInfo to GA ...
            res.send(obj.userTestInfo);
            activeActions.splice(activeActions.indexOf(obj), 1);

        } else {
            res.sendStatus(404);
        }
    }
    else {
        activeActions.push({
            id: id,
            ready: false

        })
        res.sendStatus(404);
    }

    console.log(activeActions);

});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));