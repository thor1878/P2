const { getFunctionStrings } = require("../../../src/utils/getData");

const simpleFileString = 
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

const simpleFunctionString1 = 
`function multiply(a, b) {
    if (a < b) {
        return a * b;
    }
    else {
        return a / b;
    }
}`

const simpleFunctionString2 = 
`function sum(a, b) {
    return a+b;    
}`


const quoteFileString =
`function generateString1(input) {
    const string1 = a;
    const string2 = 'test1';
    const string3 = "test2";

    const finalString = string1 + string2 + string3;
    
    return finalString;
}

function generateString2(input) {
    return a;
}

function generateString3(input) {
    return input + "1";
}`

const quoteFunctionString1 = 
`function generateString1(input) {
    const string1 = a;
    const string2 = 'test1';
    const string3 = "test2";

    const finalString = string1 + string2 + string3;
    
    return finalString;
}`

const quoteFunctionString2 = 
`function generateString2(input) {
    return a;
}`

const quoteFunctionString3 = 
`function generateString3(input) {
    return input + "1";
}`


const anoNamesFilesString = 
`
function (a) {
    return a;
}

function run ({NUM1: "A", NUM2: "b"}) {
    console.log('function');
    return "ano function";
}

let sum = (a, b) => a + b;`

const anoNamesFunctionString1 = 
`function run (a, b) {
    console.log('function');
    return "ano function";
}`


test("Test of simple file with multiply and divide", () => {
    expect(getFunctionStrings(simpleFileString)).toStrictEqual( 
    [
        {
            functionString: simpleFunctionString1,
            params: [`a`, `b`],
            name: `multiply`,
            async: false
        },
        {
            functionString: simpleFunctionString2,
            params: [`a`, `b`],
            name: `sum`,
            async: false
        }
    ]);
})

test("Test of file with anonymous functions", () => {
    expect(getFunctionStrings(quoteFileString)).toStrictEqual( 
    [
        {
            functionString: quoteFunctionString1,
            params: [`input`],
            name: `generateString1`,
            async: false
        },
        {
            functionString: quoteFunctionString2,
            params: [`input`],
            name: `generateString2`,
            async: false
        },
        {
            functionString: quoteFunctionString3,
            params: [`input`],
            name: `generateString3`,
            async: false
        }

    ]);
})



test("Test of file with functions that includes quotes of different kinds", () => {
    expect(getFunctionStrings(anoNamesFilesString)).toStrictEqual( 
    [
        {
            functionString: anoNamesFunctionString1,
            params: ["[a,b]"],
            name: `run`,
            async: false
        },
        // {
        //     functionString: anoNamesFunctionString1,
        //     params: ["a","b"],
        //     name: `sum`,
        //     async: false
        // }
    ]);
})


