const { generateSetupTree } = require('../../../src/utils/initial-setup');

const files = [
    '.github/actions/run-tests-action/index.js',
    '.github/actions/run-tests-action/action.yaml',
    '.github/actions/update-test-info-action/index.js',
    '.github/actions/update-test-info-action/action.yaml',
    '.github/actions/wait-for-response-action/index.js',
    '.github/actions/wait-for-response-action/action.yaml',
    '.github/workflows/main.yml',
    '.github/config.json',
    '.test/test-info.json'
];

test('Check content of setup tree', async () => {
    const setupTree = await generateSetupTree();
    const setupTreeFiles = setupTree.map(file => file.path);
    expect(setupTreeFiles).toEqual(files);
})