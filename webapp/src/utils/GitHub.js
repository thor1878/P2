const fetch = require('node-fetch');

async function getGitHub(url, token) {
    const response = await fetch(url, {
        method: 'GET', 
        // cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token ' + token
        }
    });
    return response.json();
}

module.exports = { getGitHub };