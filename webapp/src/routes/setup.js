const express = require('express');
const { contactTS } = require('../utils/TestServer');

const router = express.Router();

// Endpoint for initial setup
router.get('/:repoOwner/:repoName/setup', async (req, res) => {
    const status = await contactTS('/setup-repository', 'POST', {
        repository: req.params.repoOwner + "/" + req.params.repoName,
        token: req.user.token
    })
    
    res.redirect('/repos');
})

module.exports = router;