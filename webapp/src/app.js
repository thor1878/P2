const express = require('express');
const PORT = 3000;

const app = express();

app.set('view engine', 'pug');
app.set('views', 'webapp/src/public/views');
app.use('/static', express.static('webapp/src/public/static'));

app.get('/', (req, res) => {
    res.render('index');
})

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});