const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const mongodb = require('./data/database');
const app = express();
const GithubStrategy = require('passport-github2').Strategy;

const port = process.env.PORT || 3000;
const githubCallbackUrl = process.env.GITHUB_CALLBACK_URL || process.env.CALLBACK_URL || 'http://localhost:3000/auth/github/callback';

app.use(bodyparser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'origin, x-requested-with, content-type, accept, z-key, authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    );
    next();
})
app.use(cors({ methods: ['GET', 'POST', 'PUT', 'UPDATE', 'DELETE'] }))
app.use(cors({ origin: '*' }))
app.use('/', require('./routes/index.js'));

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: githubCallbackUrl
    },
        function (accessToken, refreshToken, profile, done) {
            return done(null, profile);
        }
    ));
} else {
    console.warn('GitHub OAuth env vars are missing. Set GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and GITHUB_CALLBACK_URL to enable login.');
}

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/', (req, res) => {
    if (!req.session.user) {
        return res.send('logged out');
    }

    res.redirect('/hello');
});

app.get('/hello', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }

    res.send('Hello world');
});

app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', session: false
}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/hello');
});

app.get('/github/callback', (req, res, next) => {
    passport.authenticate('github', {
        failureRedirect: '/api-docs', session: false
    })(req, res, next);
});

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destroy error:', err);
            }
            res.redirect('/');
        });
    });
});

mongodb.initDb((err) => {
    if (err) {
        console.error('Database init error:', err);
    } else {
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    }
});
