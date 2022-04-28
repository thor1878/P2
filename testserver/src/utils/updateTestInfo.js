function updateTestInfo(testInfo, filesData) {
    const updatedTestInfo = { files: [] };

    for (const file of filesData) {

        const newFile = {
            path: file.path,
            functions: []
        }

        // If file is in testInfo (file exist with same path)
        let existingFile;
        if (existingFile = testInfo.files.find(f => f.path === file.path)) {

            for (const func of file.functionStrings) {

                let existingFunction;
                if (existingFunction = existingFile.functions.find(f => f.name === func.name)) {

                    existingFunction.params = func.params;
                    existingFunction.async = func.async;
                    existingFunction.functionString = func.functionString;

                    newFile.functions.push(existingFunction);

                } else {  //if new function in file, push update into newfile
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
        // If file is NOT in testInfo, (New file)...push/update all func
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
