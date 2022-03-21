const express = require('express');
const { getRepoData, filterData, getFileData } = require('./utils/getData');
const { runTests } = require('./utils/runTests');

const app = express();

const PORT = 3000;

// Enable the request object to handle json
app.use(express.json())

// Endpoint to handle post request from GitHub Actions when workflow is triggered
app.post('/', async (req, res) => {

    // Run existing tests


    // Get data from GitHub repository
    let data = await getRepoData(req.body.repository, req.body.branch);

    // Filter data to only include '.js' files (not '.test.js')
    let filteredData = filterData(data);

    // Get data for each file (path, function strings, etc...)
    let fileData = await getFileData(filteredData);


    //Send fileData to Webapp
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ data: fileData }),
        //...
    });

    //Handle response
    const responseJSON = await response.json();
    //... Error handle


    // (Log data)
    console.log(JSON.stringify(fileData, null, 4));


    // Generate new test cases

    // Run new tests

    // Update functionInfo.json

    // Send response back to GitHub Actions
    res.sendStatus(200);
})



// Endpoint to run tests. Should run existing or modified tests depending if the request is send from the test-server og the web-app




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));