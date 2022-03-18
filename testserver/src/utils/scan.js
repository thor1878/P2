//filter in file structure
function filter(data) {
    let filtArray = [];
    for (let file of data.tree) {
        if (file.path.slice(-3) == ".js") {
            filtArray.push(file);
        }
    }
    return filtArray;
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