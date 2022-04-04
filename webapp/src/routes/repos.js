const fetch = require('node-fetch');
const express = require('express');
const config = require('../../config.json');
const { getGitHub } = require('../utils/GitHub');

const router = express.Router();

router.get('/repos', async (req, res) => {
    const content = await getGitHub(config.user + "thor1878" + config.userOptions);
    const repos = [];
    
    for (const item of content) {
        const pullsObject = [];
        const pulls = await getGitHub(config.repo + item.full_name + config.repoPulls + config.repoState);
        for (const pullRequest of pulls) {
            pullsObject.push({
                url: pullRequest.url,
                number: pullRequest.number,
                title: pullRequest.title,
                branch: pullRequest.head.ref
            });
        }

        repos.push({
            full_name: item.full_name,
            language: config.languages[item.language] ? config.languages[item.language] : "not supported",
            pullRequests: pullsObject, 
        });
        
    }

    res.render('repos', {repos: repos});
})

module.exports = router;


