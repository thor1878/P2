require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const dummyData = require('./dummy/filesData.json');
const repos = require('./routes/repos.js');
const auth = require('./routes/auth');
const config = require('../config.json');
const { getGitHub, getCollaborators } = require('./utils/GitHub');
const { contactTS } = require('./utils/TestServer');

const app = express();
const PORT = 3000;

// Array of matchers
const matchers = ["toBe", "toEqual", "toBeCloseTo", "toContain"];

app.set('view engine', 'pug');
app.set('views', 'src/public/views');

// Session middleware
app.use(session({
    secret: 'asdfatsi6tFTASDfgfKJAaGasdKfAS',
    resave: false,
    saveUninitialized: false,
}));
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use('/static', express.static('src/public/static'));

app.use(auth);
app.use(repos);

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/:repoOwner/:repoName/:branch/:pullrequest/testing', async (req, res) => {
    const content = await getGitHub(config.repo + req.params.repoOwner + "/" + req.params.repoName + config.repoPulls + "/" + req.params.pullrequest, req.user.token);
    if (content.message === "Not Found" || content.head.ref !== req.params.branch || content.state === "closed") {
        res.send("404 - Not Found");
    }
    // if (content.message === "Not Found" || content.head.ref !== req.params.branch) {
    //     res.send("404 - Not Found");
    // }
    else {
        const status = await getCollaborators(req.params.repoOwner + "/" + req.params.repoName + "/collaborators/" + req.user.profile.username, req.user.token);
        
        if (status === 204) {
            const data = await contactTS('/test-info', "GET", {
                repository: req.params.repoOwner + "/" + req.params.repoName,
                branch: req.params.branch,
                token: req.user.token
            })
            res.render('testing', {files: data.files, matcherOptions: matchers});
            // res.render('testing', {files: dummyData.files, matcherOptions: matchers});
        }
        else {
            res.send("404 - Not Found");
        }
    }
})

// app.get('/testing', (req, res) => {
//     res.redirect('/thor1878/GitHub-Actions-Test/Test2/5/testing');
// })

app.post('/:repoOwner/:repoName/:branch/:pullrequest/testing', async (req, res) => {
    const status = await contactTS('/generate-tests', 'POST', {
        repository: req.params.repoOwner + "/" + req.params.repoName,
        branch: req.params.branch,
        userTestInfo: req.body,
        token: req.user.token
    })

    res.sendStatus(status);
})

app.get('/logs', (req, res) => {
    res.render('logs');
})

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});