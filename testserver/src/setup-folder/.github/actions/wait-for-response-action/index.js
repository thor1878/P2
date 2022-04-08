const core = require('@actions/core');
const fetch = require('node-fetch');
const config = require('../../config.json');

const repo = core.getInput('repo');
const branch = core.getInput('branch');
const pollInterval = 5000;

console.log(repo);
console.log(branch);

const url = config.tsURL;

// Keep polling test server until receiving a 200
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
