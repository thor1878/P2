const express = require('express');
const passport = require('passport');
require('../passport/passport')


const router = new express.Router();


router.get('/login', passport.authenticate('github', { scope: ['user:email', 'read:org', 'repo', 'workflow'] }))

router.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
})

router.get('/logout', async (req, res) => {
    req.logout();
    res.redirect('https://github.com/logout');
})

router.use((req, res, next) => {
    res.locals.user = req.user || null;
    if (req.user || req.path === '/') {
        next();
    } else {
        res.redirect('/login');
    }
})

module.exports = router;