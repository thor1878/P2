const fetch = require('node-fetch');
const config = require('../../config.json')

async function contactTS(endpoint, method, params) {
    let fetchURL;
    let fetchOptions;

    if (method === 'GET') {
        fetchURL = config.tsURL + endpoint + '?repository=' + params.repository + '&branch=' + params.branch + '&token=' + params.token + '&update=' + params.update;

        fetchOptions = {
            method: method,
            headers: {
                "Content-Type": "application/json"
            }
        }
        const response = await fetch(fetchURL, fetchOptions);
        return await response.json();
    } else {
        fetchURL = config.tsURL + endpoint;
        fetchOptions = {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(params)
        }
        const response = await fetch(fetchURL, fetchOptions);
        return response.status;
    }
}

module.exports = {contactTS}