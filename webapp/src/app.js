require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const dummyData = require('./dummy/filesData.json');
const repos = require('./routes/repos.js');
const config = require('../config.json');
const urls = require('../../config.json');
const { getGitHub } = require('./utils/GitHub');
const {contactTS} = require('./utils/TestServer');
const PORT = 3000;

const app = express();

// Array of matchers
const matchers = ["toBe", "toEqual"];

app.set('view engine', 'pug');
app.set('views', 'src/public/views');
app.use(express.json());
app.use('/static', express.static('src/public/static'));
app.use(repos);

app.get('/', (req, res) => {
    res.render('index', {functions: dummyData.functions});
})

app.get('/:repoOwner/:repoName/:branch/:pullrequest/testing', async (req, res) => {
    const content = await getGitHub(config.repo + req.params.repoOwner + "/" + req.params.repoName + config.repoPulls + "/" + req.params.pullrequest);
    if (content.message === "Not Found" || content.head.ref !== req.params.branch) {
        res.send("404 - Not Found");
    }
    else {
        // const data = await contactTS(urls['test-server-url'], "GET", {
        //     repoName: req.params.repoOwner + "/" + req.params.repoName,
        //     pullRequest: req.params.pullrequest
        // })
        // res.render('testing', {files: data.files, matcherOptions: matchers});
        res.render('testing', {files: dummyData.files, matcherOptions: matchers});
    }
})

app.get('/testing', (req, res) => {
    res.redirect('/thor1878/GitHub-Actions-Test/Test2/5/testing');
})

app.post('/:repoOwner/:repoName/:branch/:pullrequest/testing', async (req, res) => {
    const data = await contactTS(urls['test-server-url'], 'POST', {
        repo: req.params.repoOwner + "/" + req.params.repoName,
        branch: req.params.branch,
        userTestInfo: req.body
    })

    res.send(data);
})

app.get('/logs', (req, res) => {
    res.render('logs');
})

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});