const core = require('@actions/core');
const fetch = require('node-fetch');
const config = require('../../config.json');

const repo = core.getInput('repo');
const branch = core.getInput('branch');
const pollInterval = 5000;

const url = config.tsURL;

// Start polling test server (with a 5 second interval) until receiving a 200
poll();

async function poll() {
    ready = false;

    while(!ready) {
        ready = await getStatus();
        await wait(pollInterval);
    }
}

async function wait(timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, timeout);
    })
}

// Request test generation server to check if the tests has been submitted by the user
async function getStatus() {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            origin: "GA",
            repository: repo,
            branch: branch
        })
    })

    const status = response.status;
    
    if (status === 200) {
        const data = await response.json();
        core.setOutput("user-test-info", data);
        return true;
    } else {
        return false;
    }
}
