const fetch = require('node-fetch');
const express = require('express');

const router = express.Router();

async function getRepos(url = 'https://api.github.com/users/thor1878/repos?type=all', data = {}) {
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

router.get('/repos', async (req, res) => {
    const content = await getRepos();
    const repos = [];
    
    for (const item of content) {
        if (item.language === "JavaScript") {
            repos.push(item.name);
        }
    }
    res.render('repos', {repoNames: repos});
})

module.exports = router;


