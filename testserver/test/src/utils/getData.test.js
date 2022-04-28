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

function sum(a, b) {
    return a+b;    
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
`function sum(a, b) {
    return a+b;    
}`

test("Test of simple file with multiply and divide", () => {
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
            name: `sum`,
            async: false
        }
    ]);
})