const { route } = require('./campgrounds');

var express = require('express'),
    router = express.Router({ mergeParams: true }),
    Campground = require('../models/campground'),
    middleware = require('../middleware'),
    Comment = require('../models/comment');
// ===========================
//    COMMENTS ROUTE
// ===========================

// NEW -> Show form to add a new Comment
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err && foundCampground == null) {
            req.flash("error", "Campground Not Found");
            return res.redirect('/campgrounds');
        } else {
            res.render('comments/new', { campground: foundCampground });
        }
    });
});
// CREATE -> create new Comment to Database and Associate with Campground Model
router.post('/', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err && foundCampground == null) {
            req.flash("error", "Campground Not Found");
            return res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, (err, savedComment) => {
                if (err) {
                    res.redirect('/campgrounds');
                } else {
                    req.flash("success", "Successfully added new Comment");
                    // Add username AND id to this Comment
                    savedComment.author.id = req.user._id;
                    savedComment.author.username = req.user.username;
                    savedComment.save();
                    // Save Comments
                    foundCampground.comments.push(savedComment);
                    foundCampground.save();
                    res.redirect('/campgrounds/' + req.params.id);
                }
            });

        }
    });
});


// ================================================================================
// comment Edit Route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err && foundCampground == null) {
            req.flash("error", "Campground Not Found");
            return res.redirect('/campgrounds');
        } else {
            Comment.findById(req.params.comment_id, (err, foundComment) => {
                if (err && foundComment == null) {
                    req.flash("error", "Comment Not Found");
                    return res.redirect('/campgrounds/' + req.params.id);
                } else {
                    res.render('comments/edit', { campground: foundCampground, comment: foundComment });
                }
            });
        }
    });
});
// Update Comment Route Logic
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comments, (err, updatedComment) => {
        if (err && foundComment == null) {
            req.flash("error", "Comment Not Found");
            return res.redirect('/campgrounds' + req.params.id);
        } else {
            req.flash("success", "Successfully Updated the Comment");
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});
// Destroy Comment Routes Logic
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err && foundComment == null) {
            req.flash("error", "Comment Not Found");
            return res.redirect('/campgrounds' + req.params.id);
        } else {
            req.flash("success", "Successfully Deleted the Comment");
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});
module.exports = router;