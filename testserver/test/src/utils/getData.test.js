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
`function generateString1(input1) {
    const string1 = input1;
    const string2 = 'test1';
    const string3 = "test2";

    const finalString = string1 + string2 + string3;
    
    return finalString;
}

const string4 = "test3"
console.log(string4);

function generateString2(input1, input2) {
    return input2;
}

function generateString3(input1, input2, input3) {
    return input1 + "1";
}`

const quoteFunctionString1 = 
`function generateString1(input1) {
    const string1 = input1;
    const string2 = 'test1';
    const string3 = "test2";

    const finalString = string1 + string2 + string3;
    
    return finalString;
}`

const quoteFunctionString2 = 
`function generateString2(input1, input2) {
    return input2;
}`

const quoteFunctionString3 = 
`function generateString3(input1, input2, input3) {
    return input1 + "1";
}`


const anoNamesFilesString = 
`
function (a) {
    return a;
}

function run (input1, input2, input3) {
    console.log('function');
    return "ano function";
}

let sum = (a, b) => a + b;`

const anoNamesFunctionString1 = 
`function run (input1, input2, input3) {
    console.log('function');
    return "ano function";
}`


const bracketFileString =
`function generateString1(input1) {
    const bracketString1 = "some string including '{' a bracket" - input1;
}

bracketString2 = "another string including }}} some brackets";

function generateString2(input2) {
    const bracketString3 = "some string including '}' a bracket pointing the other way";
}

function generateString3(input3) {
    const bracketString4 = "some string including '}' two brackets {";
}

function generateString4(input4) {
    const bracketString5 = "some string including{ '}' two brackets pointing the other way";
}

function generateString5(input5) {
    const bracketString6 = "some string including{ '{ { { } } }' } many brackets";
}

`

const bracketFunctionString1 =
`function generateString1(input1) {
    const bracketString1 = "some string including '{' a bracket" - input1;
}`

const bracketFunctionString2 =
`function generateString2(input2) {
    const bracketString3 = "some string including '}' a bracket pointing the other way";
}`

const bracketFunctionString3 =
`function generateString3(input3) {
    const bracketString4 = "some string including '}' two brackets {";
}`

const bracketFunctionString4 =
`function generateString4(input4) {
    const bracketString5 = "some string including{ '}' two brackets pointing the other way";
}`

const bracketFunctionString5 =
`function generateString5(input5) {
    const bracketString6 = "some string including{ '{ { { } } }' } many brackets";
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

test("Test of file with functions that includes quotes of different kinds", () => {
    expect(getFunctionStrings(quoteFileString)).toStrictEqual( 
    [
        {
            functionString: quoteFunctionString1,
            params: ['input1'],
            name: `generateString1`,
            async: false
        },
        {
            functionString: quoteFunctionString2,
            params: ['input1', 'input2'],
            name: `generateString2`,
            async: false
        },
        {
            functionString: quoteFunctionString3,
            params: ['input1', 'input2', 'input3'],
            name: `generateString3`,
            async: false
        }

    ]);
})

test("Test of file with anonymous functions", () => {
    expect(getFunctionStrings(anoNamesFilesString)).toStrictEqual( 
    [
        {
            functionString: anoNamesFunctionString1,
            params: ["input1", "input2", "input3"],
            name: `run`,
            async: false
        },
    ]);
})


test("Test of file with functions that has brackets in a string", () => {
    expect(getFunctionStrings(bracketFileString)).toStrictEqual( 
    [
        {
            functionString: bracketFunctionString1,
            params: ["input1"],
            name: `generateString1`,
            async: false
        },
        {
            functionString: bracketFunctionString2,
            params: ["input2"],
            name: `generateString2`,
            async: false
        },
        {
            functionString: bracketFunctionString3,
            params: ["input3"],
            name: `generateString3`,
            async: false
        },
        {
            functionString: bracketFunctionString4,
            params: ["input4"],
            name: `generateString4`,
            async: false
        },
        {
            functionString: bracketFunctionString5,
            params: ["input5"],
            name: `generateString5`,
            async: false
        }
    ]);
})
