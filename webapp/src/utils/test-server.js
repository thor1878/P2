function formatFunctionStrings(dummyData) {
    for (const file of dummyData.files) {
        for (const func of file.functions) {
            const decoded = new Buffer.from(func.functionString, 'base64').toString('utf-8')
            const formatted = "| " + decoded.replace(/(\r\n|\n|\r)/gm, "\n| ");
            func.functionString = formatted;
        }
    }

    return dummyData;
}

module.exports = { formatFunctionStrings };