const { getFunctionStrings } = require("../../../src/utils/getData");

const fileString = 
`function multiply(a, b) {
    if (a < b) {
        return a * b;
    }
    else {
        return a / b;
    }
}

function divide(a, b) {
    return a/b;    
}`

const functionString1 = 
`function multiply(a, b) {
    if (a < b) {
        return a * b;
    }
    else {
        return a / b;
    }
}`

const functionString2 = 
`function divide(a, b) {
    return a/b;    
}`



test("Test of simple function", () => {
    expect(getFunctionStrings(fileString)).toStrictEqual( 
    [
        {
            functionString: functionString1,
            params: [`a`, `b`],
            name: `multiply`,
            async: false
        },
        {
            functionString: functionString2,
            params: [`a`, `b`],
            name: `divide`,
            async: false
        }
    ]);
})
