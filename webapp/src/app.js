require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');

// Routes
const auth = require('./routes/auth');
const home = require('./routes/home');
const repos = require('./routes/repos');
const testing = require('./routes/testing');
const setup = require('./routes/setup');
const logs = require('./routes/logs');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', 'src/public/views');

// Use session middleware (for Passport)
app.use(session({
    secret: 'asdfatsi6tFTASDfgfKJAaGasdKfAS',
    resave: false,
    saveUninitialized: false,
}));

// Use Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Format the body of all requests to JSON
app.use(express.json());

// Endpoint for all static files (css, images and client-side js)
app.use('/static', express.static('src/public/static'));

// Use routes
app.use(auth);
app.use(home);
app.use(repos);
app.use(testing);
app.use(setup);
app.use(logs);

// Start server (web application)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
