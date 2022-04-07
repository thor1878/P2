const fetch = require('node-fetch');
const config = require('../../config.json');

async function getGitHub(url, token) {
    const response = await fetch(url, {
        method: 'GET', 
        // cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `token ${token}`
        }
    });
    return response.json();
}

async function getCollaborators(endpoint, token) {
    const response = await fetch(config.repo + endpoint, {
        method: 'GET', 
        // cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `token ${token}`
        }
    });

    return response;
}

module.exports = { getGitHub, getCollaborators };