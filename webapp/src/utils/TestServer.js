const fetch = require('node-fetch');
const config = require('../../../config.json')

async function contactTS(endpoint, method, params) {
    let fetchURL;
    let fetchOptions;

    if (method === 'GET') {
        fetchURL = config["test-server-url"] + endpoint + '?repository=' + params.repository + '&branch=' + params.branch + '&token=' + params.token;
        fetchOptions = {
            method: method,
            headers: {
                "Content-Type": "application/json"
            }
        }
    } else {
        fetchURL = config["test-server-url"] + endpoint;
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