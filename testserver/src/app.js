const express = require('express');

const app = express();

const PORT = 3000;

app.post("/", (req, res) => {
    console.log(req.body);
})


















app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





