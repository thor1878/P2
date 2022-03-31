const fetch = require('node-fetch');
const express = require('express');
const config = require('../../config.json');
const { getGitHub } = require('../utils/GitHub');

const router = express.Router();

router.get('/repos', async (req, res) => {
    const content = await getGitHub(config.user + "thor1878" + config.userOptions);
    const pullsObject = [];
    const repos = [];
    
    for (const item of content) {
        const pulls = await getGitHub(config.repo + item.full_name + config.repoPulls + config.repoState);
        for (const pullRequest of pulls) {
            pullsObject.push({
                url: pullRequest.url,
                number: pullRequest.number,
                title: pullRequest.title
            });
        }

        repos.push({
            full_name: item.full_name,
            pullRequests: pulls, 
        });
    }
    res.render('repos', {repos: repos});
})

module.exports = router;


