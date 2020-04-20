var express = require('express'),
    router = express.Router(),
    middleware = require('../middleware'),
    Campground = require('../models/campground');
// ===================================
//   RESTFUL  RAOUTES  "CAMPGROUNDS"
// ===================================


// INDEX -> Show all campgrounds
router.get('/', (req, res) => {
    // get data From The Database
    Campground.find({}, (err, allCampgrounds) => {
        if (err && allCampgrounds == null) {
            req.flash("error", "Campgrounds Not Found");
            return res.redirect('/');
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
        }
    });
});

// CREATE -> create new Campground to Database
router.post('/', middleware.isLoggedIn, (req, res) => {
    // get Data
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user.id,
        username: req.user.username
    };
    var newCampground = { name: name, image: image, description: desc, author: author };
    Campground.create(newCampground, (err, campground) => {
        if (err && campground == null) {
            req.flash("error", "Campground Not Created");
            return res.redirect('/campgrounds');
        } else {
            req.flash("success", "Campground successfully created");
            return res.redirect('/campgrounds');
        }
    });
});

// NEW -> Show form to create a new Campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// SHOW -> Shows more info About a single Campground !!
router.get("/:id", (req, res) => {
    // Find the campground with Provided ID
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err && foundCampground == null) {
            req.flash("error", "Campground Not Found");
            return res.redirect('/campgrounds');
        } else {
            // render "show" template with that Campground!
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });

});
// =======================
// Edit Campground Route
// =======================
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err && foundCampground == null) {
            req.flash("error", "Campground Not Found");
            return res.redirect('/campgrounds');
        } else {
            res.render('campgrounds/edit', { campground: foundCampground });
        }
    });
});
// =======================
// Update Campground Route
// =======================
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    // find and Update the Correct Campground
    // Redirect t SHOW(INDEX) Page
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, foundCampground) => {
        if (err && foundCampground == null) {
            req.flash("error", "Campground Not Found");
            return res.redirect('/campgrounds');
        } else {
            req.flash("success", "Successfully edited New Campground");
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});
// ==========================
//  Campground Destroy Route
// ==========================
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err && foundCampground == null) {
            req.flash("error", "Campground Not Found");
            return res.redirect('/campgrounds');
        } else {
            req.flash("success", "Campground Deleted Succesfully");
            res.redirect('/campgrounds');
        }
    });
});
module.exports = router;