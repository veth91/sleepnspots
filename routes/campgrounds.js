var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware")

//INDEX
router.get("/", function(req, res){
    //get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err)
        } else{
           res.render("campgrounds/index", {campgrounds: allCampgrounds}); 
        }
    });
});

//Create route
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to camgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    console
    //create a new campground and save to database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            console.log(newlyCreated);
           res.redirect("/campgrounds"); 
        }
    });
});

//New campground form
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new")    
});

//Show more info about one campground
router.get("/:id", function(req,res){
    //find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "campground not found");
            res.redirect("back");
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})

//Edit campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    //is user logged in at all
        Campground.findById(req.params.id,function(err, foundCampground){
                res.render("campgrounds/edit", {campground: foundCampground});
        });
});


//Update campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
   //find and update correct campground
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds")
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

//Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});



module.exports = router;