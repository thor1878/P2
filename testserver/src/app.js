const express = require('express');
const fetch = require('node-fetch');
const filter = require('./utils/scan')

const app = express();

const PORT = 3000;


app.use(express.json())

app.post("/", async (req, res) => {
    let repository = req.body.repository;
    let branch = req.body.branch;

    let url = `http://api.github.com/repos/${repository}/git/trees/${branch}?recursive=1`;

    let response = await fetch(url);
    let data = await response.json();

    let filterData = filter(data);

    console.log(filterData);

    res.sendStatus(200);

})

















app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





