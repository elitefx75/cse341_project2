const express = require('express');
const router = express.Router();
const passport = require('passport');

router.use('/', require('./swagger'));
router.use('/items', require('./items'));
router.use('/users', require('./users'));

router.get('/auth/status', (req, res) => {
    res.json({ loggedIn: !!(req.session && req.session.user) });
});

router.get('/login', passport.authenticate('github', {
    scope: ['user:email']
}), (req, res) => { });

router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;