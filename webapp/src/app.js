const matchers = ["toBe", "toEqual"];

const express = require('express');
const dummyData = require('./dummy/test.json');
const PORT = 3000;

const app = express();

app.set('view engine', 'pug');
app.set('views', 'src/public/views');
app.use(express.json());
app.use('/static', express.static('src/public/static'));

app.get('/', (req, res) => {
    res.render('index', {functions: dummyData.functions});
})

app.get('/submit', (req, res) => {
    res.render('submit', {functions: dummyData.functions, matcherOptions: matchers});
})

app.post('/submit', (req, res) => {
    console.log(req.body);
    res.send({message: "Done"});
})


app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});