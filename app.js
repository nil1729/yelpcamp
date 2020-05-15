var express = require('express'),
    app = express(),
    flash = require('connect-flash'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    methodOverride = require('method-override'),
    commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index'),
    db = require('./config/keys'),
    connectDB = require('./config/db');
// ==================================
//  Database Connection 
// ==================================
connectDB(db);
// =============================
//  App Configuration
// ==============================
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// ====================================
//  Passport Configuration / Authorization
// ====================================
app.use(require('express-session')({
    secret: "My First Backend Projrct",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
//====================== 
// Routes 
// =================== // 
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
// ===================== 
// Server Connection 
// ====================//
const PORT = process.env.PORT || 3000;
app.listen(PORT, process.env.IP, () => {
    console.log(`YelpCamp Server Started on port ${PORT}`);
});