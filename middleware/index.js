var middlewareObj = {},
    Comment = require('../models/comment'),
    Campground = require('../models/campground');
middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    // Check Campground OwnerShip?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                req.flash("error", "Campground Not Found");
                res.redirect('/campgrounds');
            } else {
                // Does Currently Logged in User Own the Campground
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash("error", "You need to be Logged In first to do that");
        res.redirect('/login');
    }
}
middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                req.flash("error", "Comment Not Found")
                res.redirect('back');
            } else {
                // Does Currently Logged in User Own the Comment
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash("error", "You need to be Logged In first to do that");
        res.redirect('/login');
    }
}

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be Logged In first to do that");
    res.redirect('/login');
}

module.exports = middlewareObj;