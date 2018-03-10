var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments new
router.get("/new", middleware.isLoggedIn,function(req, res){
    //find cg by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//Comments create
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
    req.body.comment.text = req.sanitize(req.body.comment.text);
    Comment.create(req.body.comment, function(err, comment){
       if(err){
            req.flash("error", "Something went wrong");
           console.log(err);
       } else {
            comment.author.id = req.user._id
            comment.author.username = req.user.username
            comment.save();
            Campground.findById(req.params.id, function(err, foundCampground){
               if(err){
                   console.log(err);
               } else{
                    foundCampground.comments.push(comment._id);
                    foundCampground.save(function(err, data){
                      if(err){
                            console.log(err);
                      } else{
                            req.flash("success", "succesfully added comment")
                            res.redirect("/campgrounds/" + foundCampground._id);
                      }
                  });
               }
           });
       }
   });
});

//Edit comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground) {
            req.flash("error", "campground not found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });  
    });
});

//Update comments
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    req.body.comment.text = req.sanitize(req.body.comment.text);
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
//Destroy comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
 

module.exports = router;