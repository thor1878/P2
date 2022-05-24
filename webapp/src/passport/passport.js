const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user, done) => {
    done(null, user);
})

// Use the GitHub Strategy for Passport
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'https://testtube69.herokuapp.com/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
    return done(null, {profile: profile, token: accessToken});
}))