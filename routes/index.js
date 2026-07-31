const express = require('express');
const router = express.Router();
const passport = require('passport');

const githubLoginEnabled = Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);

router.use('/', require('./swagger'));
router.use('/items', require('./items'));
router.use('/users', require('./users'));

router.get('/auth/status', (req, res) => {
    res.json({ loggedIn: !!(req.session && req.session.user) });
});

router.get('/login', (req, res, next) => {
    if (!githubLoginEnabled) {
        return res.status(503).json({
            error: 'GitHub login is not configured on this server. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.'
        });
    }

    if (req.session) {
        return req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            return next();
        });
    }
    return next();
}, passport.authenticate('github', {
    scope: ['user:email']
}), (req, res) => { });

router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;