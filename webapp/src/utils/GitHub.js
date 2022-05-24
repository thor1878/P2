const fetch = require('node-fetch');
const config = require('../../config.json');

// Contact GitHub's API with specified url and the user's GitHub-token
async function getGitHub(url, token) {
    const response = await fetch(url, {
        method: 'GET', 
        // cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `token ${token}`
        }
    });
    return await response.json();
}

// Contact GitHub's API to determine whether a user is a collaborator on a repository or not
async function getCollaborators(endpoint, token) {
    const response = await fetch(config.repo + endpoint, {
        method: 'GET', 
        // cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `token ${token}`
        }
    });

    return response.status;
}

module.exports = { getGitHub, getCollaborators };