const express = require('express');
const { contactTS } = require('../utils/TestServer');

const router = express.Router();

// Endpoint for logs page
router.get('/:repoOwner/:repoName/:branch/logs', async (req, res) => {
    const repoOwner = req.params.repoOwner;
    const repoName = req.params.repoName;
    const branch = req.params.branch;

    // Contact test generation server to GET the test info file (without updating it).
    const testInfo = await contactTS('/test-info', 'GET', {
        repository: repoOwner + "/" + repoName,
        branch: branch,
        token: req.user.token,
        update: false
    });

    res.render('logs', {
        testInfo: JSON.parse(JSON.stringify(testInfo).replace(/(\"description\"\:[^\r\n]*?)[ ]\<.*?\>/g, '$1')),
        user: repoOwner, 
        repo: repoName, 
        branch: branch
    });
})

module.exports = router;