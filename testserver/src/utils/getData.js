const fetch = require('node-fetch');


// Return an array containing only the objects with a path having the '.js' extension (not including '.test.js')
function filterData(data) {
    // let filteredData = [];
    // for (let file of data.tree) {
    //     if (file.path.slice(-3) === '.js' && file.path.slice(-7) !== '.test.js') {
    //         filteredData.push(file);
    //     }
    // }
    // return filteredData;

    return data.tree.filter(file => file.path.slice(-3) === '.js' && file.path.slice(-7) !== '.test.js');
}

async function getFileData(filteredData, url) {
    let fileData = [];
    for (let file of filteredData) {

        let response = await fetch(file.url);
        let data = await response.json();

        let fileString = data.content.toString('base64');

        fileData.push({
            path: file.path,
            fileString: fileString
        })


    }

    return fileData;
}










module.exports = { filterData, getFileData };




// Search the strings to extract the functions defined with the function keyword


// Update the ??? file


// Generate test cases to all the functions

























// `
// test('${}', () => {
//     expect(multiply(${}, ${})).${}(${});
// })
// `