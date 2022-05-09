const { filterRepoData } = require("../../../src/utils/getData");

const dummyRepoDataPaths = {
    tree: [
        {path: '.github'},
        {path: '.github/actions'},
        {path: '.github/actions/run-tests-action'},
        {path: '.github/actions/run-tests-action/action.yaml'},
        {path: '.github/actions/run-tests-action/index.js'},
        {path: '.github/actions/update-test-info-action'},
        {path: '.github/actions/update-test-info-action/action.yaml'},
        {path: '.github/actions/update-test-info-action/index.js'},
        {path: '.github/actions/wait-for-response-action'},
        {path: '.github/actions/wait-for-response-action/action.yaml'},
        {path: '.github/actions/wait-for-response-action/index.js'},
        {path: '.github/workflows'},
        {path: '.github/workflows/main.yml'},
        {path: '.gitignore'},
        {path: '.test'},
        {path: '.test/src'},
        {path: '.test/src/app.test.js'},
        {path: '.test/src/lib'},
        {path: '.test/src/lib/sum.test.js'},
        {path: '.test/src/multiply.test.js'},
        {path: '.test/src/square.test.js'},
        {path: '.test/test-info.json'},
        {path: 'README.md'},
        {path: 'package-lock.json'},
        {path: 'package.json'},
        {path: 'src'},
        {path: 'src/app.js'},
        {path: 'src/lib'},
        {path: 'src/lib/sum.js'},
        {path: 'src/multiply.js'},
        {path: 'src/square.js'}
    ]
}

const testFiles = [
    {path: '.test/src/app.test.js'},
    {path: '.test/src/lib/sum.test.js'},
    {path: '.test/src/multiply.test.js'},
    {path: '.test/src/square.test.js'}
];

const githubFiles = [
    {path: '.github'},
    {path: '.github/actions'},
    {path: '.github/actions/run-tests-action'},
    {path: '.github/actions/run-tests-action/action.yaml'},
    {path: '.github/actions/run-tests-action/index.js'},
    {path: '.github/actions/update-test-info-action'},
    {path: '.github/actions/update-test-info-action/action.yaml'},
    {path: '.github/actions/update-test-info-action/index.js'},
    {path: '.github/actions/wait-for-response-action'},
    {path: '.github/actions/wait-for-response-action/action.yaml'},
    {path: '.github/actions/wait-for-response-action/index.js'},
    {path: '.github/workflows'},
    {path: '.github/workflows/main.yml'}
];

test("Filter all .js files in array", () => {
    expect(filterRepoData(dummyRepoDataPaths)).toStrictEqual(
        [
            {path: 'src/app.js'},
            {path: 'src/lib/sum.js'},
            {path: 'src/multiply.js'},
            {path: 'src/square.js'}
        ]
    );
})

test.each(testFiles)("Filter out all .test.js files", () => {
    expect(filterRepoData(dummyRepoDataPaths)).not.toContain(testFiles);
}, 0);

test.each(githubFiles)("Filter out all files in .github folder", () => {
    expect(filterRepoData(dummyRepoDataPaths)).not.toContain(githubFiles);
}, 0);

