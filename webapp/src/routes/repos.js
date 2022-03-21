const fetch = require('node-fetch');
const express = require('express');

const router = express.Router();

async function getRepos(url = 'https://api.github.com/users/thor1878/repos?type=all', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
   
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

router.get('/repos', async (req, res) => {
  const content = await getRepos();
  const repoNames = [];

  for (const item of content) {
    
    if (item.language === "JavaScript") {
    
      repoNames.push(item.name);
      
    }
  }
  res.render('repos', {repoNamesYeet: repoNames});
})

module.exports = router;


