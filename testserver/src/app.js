const express = require('express');

const app = express();

const PORT = 3000;


app.use(express.json())

app.post("/", (req, res) => {
    console.log(req.body);
    res.send(200);
})


//hey















app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





