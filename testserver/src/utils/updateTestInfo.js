// Updates the test info file based on the filtered '.js' files data in the pull request (branch)
function updateTestInfo(testInfo, filesData) {
    const updatedTestInfo = { files: [] };

    for (const file of filesData) {
        const newFile = {
            path: file.path,
            functions: []
        }

        // If file is in testInfo (file exist with same path) - overwrite the params, async and functionstring.
        let existingFile;
        if (existingFile = testInfo.files.find(f => f.path === file.path)) {

            for (const func of file.functionStrings) {

                let existingFunction;
                if (existingFunction = existingFile.functions.find(f => f.name === func.name)) {

                    existingFunction.params = func.params;
                    existingFunction.async = func.async;
                    existingFunction.functionString = func.functionString;

                    newFile.functions.push(existingFunction);

                } else {  // If there is a new function in the file, push the update into newFile
                    newFile.functions.push({
                        name: func.name,
                        params: func.params,
                        async: func.async,
                        status: "0",
                        functionString: func.functionString,
                        testCases: []
                    })
                }
            }
        }
        // If file is NOT in testInfo - push all functions in the filesData into the updated test info.
        else {
            for (const func of file.functionStrings) {
                newFile.functions.push({
                    name: func.name,
                    params: func.params,
                    async: func.async,
                    status: "0",
                    functionString: func.functionString,
                    testCases: []
                })
            }
        }
        updatedTestInfo.files.push(newFile);
    }

    return updatedTestInfo;
}

module.exports = { updateTestInfo };
