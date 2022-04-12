const fetch = require('node-fetch');
const express = require('express');
const config = require('../../config.json');
const { getGitHub } = require('../utils/GitHub');

const router = express.Router();

router.get('/repos', async (req, res) => {
    const userRepos = await getGitHub(config.user, req.user.token);
    const repos = [];
    
    for (const repo of userRepos) {
        const pullsObject = [];

        const pulls = await getGitHub(config.repo + repo.full_name + config.repoPulls + config.repoState, req.user.token);
        const runningActions = await getGitHub(`https://api.github.com/repos/${repo.full_name}/actions/runs`, req.user.token);
        const setup = await getGitHub(config.repo + repo.full_name + "/contents/.test", req.user.token);

        
        for (const pullRequest of pulls) {
            const workflow = runningActions.workflow_runs.find(wr => wr.head_branch === pullRequest.head.ref && wr.status === 'in_progress');
            let pullStatus;

            if (workflow) {
                const jobs = await getGitHub(workflow.jobs_url, req.user.token);

                // If job 'wait_for_response' is in progress
                if (jobs.jobs[0].status === 'in_progress') {
                    pullStatus = 'waiting'
                }
                else {
                    pullStatus = 'testing'
                }
            } else {
                pullStatus = 'not_active'                
            }

            pullsObject.push({
                url: pullRequest.url,
                number: pullRequest.number,
                title: pullRequest.title,
                branch: pullRequest.head.ref,
                status: pullStatus
            });
        }
        // console.log(pullsObject);

        repos.push({
            fullName: repo.full_name,
            language: config.languages[repo.language] ? config.languages[repo.language] : "not supported",
            pullRequests: pullsObject, 
            setup: setup.message === "Not Found" ? false : true
        });
    }

    res.render('repos', {repos: repos});
})

module.exports = router;


