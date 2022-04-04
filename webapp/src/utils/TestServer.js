const fetch = require('node-fetch');

async function contactTS(url, method, params) {
    let fetchURL;
    let fetchOptions;

    if (method === 'GET') {
        fetchURL = url + '?repository=' + params.repository + '&branch=' + params.branch;
        fetchOptions = {
            method: method,
            headers: {
                "Content-Type": "application/json"
            }
        }
    } else {
        fetchURL = url;
        fetchOptions = {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(params)
        }
    }
    const response = await fetch(fetchURL, fetchOptions);
    const data = await response.json();
    return data;
}

module.exports = {contactTS}