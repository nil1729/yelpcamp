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
    indexRoutes = require('./routes/index');
// ==================================
//  Database Connection 
// ==================================

// LocalHost===========================================
mongoose.connect("mongodb://localhost/yelp_camp", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("connected To DataBase..."))
    .catch(err => console.log("Refuse to Connect...", err));
// MongoLab (Mongo Atlas DB)======================================
// mongoose.connect("mongodb+srv://yelpcamp:nilanjan@yelpcamp-t9dj6.mongodb.net/test?retryWrites=true&w=majority", {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     })
//     .then(() => console.log("connected To DataBase..."))
//     .catch(err => console.log("Refuse to Connect...", err));
// // =============================
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
// for Localhost Server==============================
app.listen(3000, () => {
    console.log(`YelpCamp Server Started !!!`);
});
// For Heroku Server=================================
// app.listen(process.env.PORT, process.env.IP, () => {
//     console.log(`YelpCamp Server Started !!!`);
// });