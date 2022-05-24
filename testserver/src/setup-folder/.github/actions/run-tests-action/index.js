const core = require('@actions/core');
const jest = require('jest');

const options = { 
    root: [__dirname]
};

// Run tests with Jest and output results
jest.runCLI(options, options.root)
.then(results => {
    core.setOutput('results', results);
})
.catch(failure => {
    console.log(failure);
})
