const core = require('@actions/core');
const jest = require('jest');

const options = { 
    root: ['../../../.test/'],
    collectCoverage: true,
    collectCoverageFrom:['**/*.js', '!**/.test/**']
};

jest.runCLI(options, options.root)
.then(results => {
    core.setOutput('results', results);
})
.catch(failure => {
    console.log(failure)
})
