var express = require('express'),
    User = require('../models/user'),
    passport = require('passport'),
    router = express.Router();
// =======================
//Root  ROUTES
// =======================
router.get('/', (req, res) => {
    res.render('home');
});
// =====================================
//          Authentication
// =====================================
// Show-> Register Form
router.get('/register', (req, res) => {
    res.render('register');
});
// Handle-> Sign Up Login
router.post('/register', (req, res) => {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, createdUser) => {
        if (err) {
            req.flash("error", err.message); //Falsh Message 
            return res.redirect('register');
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to YelpCamp " + createdUser.username); // Flash Message
            res.redirect('/campgrounds');
        });
    });
});
// Show -> Login Form
router.get('/login', (req, res) => {
    res.render('login');
});
// Flash Message setup for Login:
passport.authenticate('local', { failureFlash: 'Invalid username or password.' });
// Handle -> Login Logic
router.post('/login', passport.authenticate("local", {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {});
// Log  Out Route
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash("success", "Logged you Out"); // Flash message
    res.redirect('/Campgrounds');
});
module.exports = router;