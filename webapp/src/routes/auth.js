const express = require('express');
const passport = require('passport');
require('../passport/passport');

const router = express.Router();

// Endpoint for login (when pressing the login button) - redirects to GitHub authentication (uses the Strategy defined in passport.js)
router.get('/login', passport.authenticate('github', { scope: ['read:org', 'repo', 'workflow'] }));

// When a user has signed in on GitHub - redirect to the 'Home' page
router.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/'
}));

// When a user presses lougout - redirect to GitHubs logout page
router.get('/logout', async (req, res) => {
    req.logout();
    res.redirect('https://github.com/logout');
});

// Check if the user is logged in or on the homepage. If not, redirect to the login page.
router.use((req, res, next) => {
    res.locals.user = req.user || null;
    if (req.user || req.path === '/') {
        next();
    } else {
        res.redirect('/login');
    }
});

module.exports = router;