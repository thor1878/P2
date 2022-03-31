const fetch = require('node-fetch');

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

module.exports = { getGitHub };