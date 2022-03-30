const express = require('express');
const cors = require('cors');

const { getRepoData, filterRepoData, getFileData, getTestInfo } = require('./utils/getData');
const { getLatestCommitSHA, getBaseTreeSHA, createTree, commitTree, updateRef } = require('./utils/updateTests');

const app = express();

const PORT = 3000;

// Setup environment variables from .env folder
require('dotenv').config();

// Enable the request object to handle json
app.use(express.json())

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
    const fileData = await getFileData(filteredData);

    // Get test info file from branch
    const testInfo = await getTestInfo(repoData);



    // Update test info (add all functions that are not in test info. Nothing else should be necessary yet)


    // Send updated test info back to webapp
    res.send(JSON.stringify(testInfo));
})

// Web app posts updated test info that contains the most recent modified test cases.
// This test info is used to generate the actual test cases, which are then tested.
app.post('/generate-tests', async (req, res) => {

    console.log(JSON.stringify(req.body, null, 4));

    const branch = 'main';
    const testInfo = req.body;

    // Get SHA of latest commit on branch
    const latestCommitSHA = await getLatestCommitSHA(branch);

    // Get SHA of the base tree (root)
    const baseTreeSHA = await getBaseTreeSHA(latestCommitSHA);

    // Create new tree based on testInfo file
    const newTreeSHA = await createTree(baseTreeSHA, testInfo);

    // Commit tree
    const newCommitSHA = await commitTree(latestCommitSHA, newTreeSHA);

    // Update branch ref
    const response = await updateRef(newCommitSHA, branch);

    console.log(response);


    res.send('test');
})



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));