const express = require('express');
const { getGitHub, getCollaborators } = require('../utils/GitHub');
const { contactTS } = require('../utils/TestServer');
const config = require('../../config.json');

const router = express.Router();

// Array of matchers from config file
const matchers = config.matchers;

// Endpoint for testing page
router.get('/:repoOwner/:repoName/:branch/:pullrequest/testing', async (req, res) => {
    const repoOwner = req.params.repoOwner;
    const repoName = req.params.repoName;
    const pullrequest = req.params.pullrequest;
    const content = await getGitHub(config.repo + repoOwner + "/" + repoName + config.repoPulls + "/" + pullrequest, req.user.token);
    // Check if the pull request (in URL) exists, is in the correct branch, or if it is closed
    if (content.message === "Not Found" || content.head.ref !== req.params.branch || content.state === "closed") {
        res.send("404 - Not Found");
    }
    // If it is a valid pull request
    else {
        // Check if the user is a collaborator
        const status = await getCollaborators(repoOwner + "/" + repoName + "/collaborators/" + req.user.profile.username, req.user.token);
        
        // Render the testing page (with updated test info) if the user is a collaborator
        if (status === 204) {
            const testInfo = await contactTS('/test-info', "GET", {
                repository: repoOwner + "/" + repoName,
                branch: req.params.branch,
                token: req.user.token,
                update: true
            });
            res.render('testing', {
                user: repoOwner, 
                repo: repoName, 
                pr: `https://github.com/${repoOwner}/${repoName}/pull/${pullrequest}`, 
                branch: content.head.ref,
                files: testInfo.files, 
                matcherOptions: matchers
            });
        }
        else {
            res.send("404 - Not Found"); //Not a collaborator
        }
    }
})

// Endpoint for submitting tests
router.post('/:repoOwner/:repoName/:branch/:pullrequest/testing', async (req, res) => {
    const status = await contactTS('/generate-tests', 'POST', {
        repository: req.params.repoOwner + "/" + req.params.repoName,
        branch: req.params.branch,
        userTestInfo: req.body,
        token: req.user.token
    })

    res.sendStatus(status);
})

module.exports = router;