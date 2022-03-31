const fetch = require('node-fetch');
const express = require('express');
const config = require('../../config.json');

const router = express.Router();

async function getGitHub(url) {
    const response = await fetch(url, {
        method: 'GET', 
        // cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `token ${process.env.GITHUB_TOKEN}`
        }
    });
    return response.json();
}

router.post('/repos', async (req, res) => {
    const content = await getGitHub(config.repo + req.body.repo + config.repoOption);
    const pullRequests = [];

    for (const pullRequest of content) {
        pullRequests.push({
            url: pullRequest.url,
            number: pullRequest.number,
            title: pullRequest.title
        });
    }
});

router.get('/repos', async (req, res) => {
    const content = await getGitHub(config.user + "thor1878" + config.userOptions);
    const pullsObject = [];
    const repos = [];
    
    for (const item of content) {
        const pulls = await getGitHub(config.repo + item.full_name + config.repoOption);
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


