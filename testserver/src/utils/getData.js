//filter in file structure
function filterData(data) {
    let filteredData = [];
    for (let file of data.tree) {
        if (file.path.slice(-3) == ".js") {
            filteredData.push(file);
        }
    }
    return filteredData;
}

async function getFileData(filtredData, url) {
    let fileData = [];
    for (let file of filteredData) {
        let functionString = {}
        functionString.path = file.path
        functionString.functions = []

        let response = await fetch(file.url);
        let data = await response.json();

        let decodedFile = atob(data.content);

        getFunctionStrings(decodedFile)


    }
}

function getFunctionStrings(decodedFile) {
    let functionStrings = [];

    decodedFile.


    return functionarray
}

module.exports = filter;








// Search the strings to extract the functions defined with the function keyword


// Update the ??? file


// Generate test cases to all the functions

























// `
// test('${}', () => {
//     expect(multiply(${}, ${})).${}(${});
// })
// `