const fetch = require('node-fetch');

async function contactTS(url, method, body) {
    const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const data = JSON.parse( await response.json());
    return data;
}

module.exports = {contactTS}