require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const dummyData = require('./dummy/testInfo.json');
const repos = require('./routes/repos.js');
const config = require('../config.json');
const { getGitHub } = require('./utils/GitHub');
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

//haha - made new stuff  ;P
// app.get('/testing', async (req, res) => {
//     let url = "https://f8e2-130-225-198-165.ngrok.io/test-info?repository=thor1878%2FGithub-Actions-test&branch=main"
//     const response = await fetch(url, {
//         method: "GET"
//     })
//     const data = JSON.parse(await response.json());
//     res.render('testing', {functions: data.files[0].functions, files: data.files, matcherOptions: matchers});
// })

app.get('/:repoOwner/:repoName/:pullrequest/testing', async (req, res) => {
    const content = await getGitHub(config.repo + req.params.repoOwner + "/" + req.params.repoName + config.repoPulls + "/" + req.params.pullrequest);
    if (content.message === "Not Found") {
        res.send("404 - Not Found");
    }
    else {
        // const response = await fetch('testServerUrl/test-info', {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         repoName: req.params.repoOwner + "/" + req.params.repoName,
        //         pullRequest: req.params.pullrequest
        //     })
        // });
        // const data = JSON.parse( await response.json());
        // res.render('testing', {files: data.files, matcherOptions: matchers});
        res.render('testing', {files: dummyData.files, matcherOptions: matchers});
    }
})

app.get('/testing', (req, res) => {
    res.redirect('/thor1878/GitHub-Actions-Test/5/testing');
})

app.post('/testing', (req, res) => {
    console.log(req.body);
    res.send({message: "Done"});
})

app.get('/logs', (req, res) => {
    res.render('logs');
})

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});