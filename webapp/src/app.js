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
const { default: fetch } = require('node-fetch');

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
    const repoOwner = req.params.repoOwner;
    const repoName = req.params.repoName;
    const pullrequest = req.params.pullrequest;
    const content = await getGitHub(config.repo + repoOwner + "/" + repoName + config.repoPulls + "/" + pullrequest, req.user.token);
    if (content.message === "Not Found" || content.head.ref !== req.params.branch || content.state === "closed") {
        res.send("404 - Not Found");
    }
    // if (content.message === "Not Found" || content.head.ref !== req.params.branch) {
    //     res.send("404 - Not Found");
    // }
    else {
        const status = await getCollaborators(repoOwner + "/" + repoName + "/collaborators/" + req.user.profile.username, req.user.token);
        
        if (status === 204) {
            const data = await contactTS('/test-info', "GET", {
                repository: repoOwner + "/" + repoName,
                branch: req.params.branch,
                token: req.user.token,
                update: true
            })
            res.render('testing', {
                user: repoOwner, 
                repo: repoName, 
                pr: `https://github.com/${repoOwner}/${repoName}/pull/${pullrequest}`, 
                branch: content.head.ref,
                files: data.files, 
                matcherOptions: matchers
            });
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

app.get('/:repoOwner/:repoName/setup', async (req, res) => {
    const status = await contactTS('/setup-repository', 'POST', {
        repository: req.params.repoOwner + "/" + req.params.repoName,
        token: req.user.token
    })

    res.redirect('/repos');
})

app.get('/:repoOwner/:repoName/:branch/logs', async (req, res) => {
    const testInfo = await contactTS('/test-info', 'GET', {
        repository: req.params.repoOwner + "/" + req.params.repoName,
        branch: req.params.branch,
        token: req.user.token,
        update: false
    })
    res.render('logs', {
    testInfo: JSON.parse(JSON.stringify(testInfo).replaceAll(/(\"description\"\:[^\r\n]*?)[ ]\<.*?\>/g, '$1'))
    });
})

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});