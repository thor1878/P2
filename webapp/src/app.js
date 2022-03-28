const matchers = ["toBe", "toEqual"];

const express = require('express');
const fetch = require('node-fetch');
const dummyData = require('./dummy/test.json');
const repos = require('./routes/repos.js');
const PORT = 3000;

const app = express();


app.set('view engine', 'pug');
app.set('views', 'src/public/views');
app.use(express.json());
app.use('/static', express.static('src/public/static'));
app.use(repos);

app.get('/', (req, res) => {
    res.render('index', {functions: dummyData.functions});
})


//haha - made new stuff  ;P
app.get('/submit', async (req, res) => {
    let url = "https://f8e2-130-225-198-165.ngrok.io/test-info?repository=thor1878%2FGithub-Actions-test&branch=main"
    const response = await fetch(url, {
        method: "GET"
    })
    const data = JSON.parse(await response.json());
    res.render('submit', {functions: data.files[0].functions, files: data.files, matcherOptions: matchers});
})


// app.get('/submit', (req, res) => {
//     res.render('submit', {functions: dummyData.files[0].functions, files: dummyData.files, matcherOptions: matchers});
// })

app.get('/submit/:fileName', (req, res) => {
    const file = dummyData.files.find(element => element.path === req.params.fileName);
    if(file === undefined) {
        console.log("File Not Found")
        //res.render('fileNotFound');
        res.render('submit', {path: dummyData.files[0].path, functions: dummyData.files[0].functions, files: dummyData.files, matcherOptions: matchers});
    }
    else {
        res.render('submit', {path: file.path, functions: file.functions, files: dummyData.files, matcherOptions: matchers})
    }
})

app.post('/submit', (req, res) => {
    console.log(req.body);
    res.send({message: "Done"});
})


app.get('/testing', (req, res) => {
    res.render('testing');
})

app.get('/logs', (req, res) => {
    res.render('logs');
})

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});