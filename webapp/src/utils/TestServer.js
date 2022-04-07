const fetch = require('node-fetch');
const config = require('../../config.json')

async function contactTS(endpoint, method, params) {
    let fetchURL;
    let fetchOptions;

    if (method === 'GET') {
        fetchURL = config.tsURL + endpoint + '?repository=' + params.repository + '&branch=' + params.branch;
        fetchOptions = {
            method: method,
            headers: {
                "Content-Type": "application/json"
            }
        }
    } else {
        fetchURL = config.tsURL + endpoint;
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