var mongoose = require("mongoose");
var Comment = require("./models/comment");
var Campground = require("./models/campground");



var data = [
    {
        name: "Cloud's Rest", 
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1050&q=80",
        description: "Ipsum"
    },
    {
        name: "Desert Mesa", 
        image: "https://images.unsplash.com/19/nomad.JPG?auto=format&fit=crop&w=988&q=80",
        description: "Lorem Ipsum "
    },
    {
        name: "Canyon Floor", 
        image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?auto=format&fit=crop&w=1350&q=80",
        description: "blah"
    },
    ]

function seedDB(){
    //Remove all campgrounds
    Campground.remove({},function(err){
        if(err){
            console.log(err);
        } else{
            console.log("removed campgrounds!");
            //add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                  if(err){
                      console.log(err);
                  } else {
                      console.log("Added campground");
                    //   Create a comment
                        // Comment.create(
                        //   {
                        //       text:"this place is great but I wish there was internet",
                        //       author: "Homer"
                        //   }, function(err, comment){
                        //       if(err){
                        //           console.log(err);
                        //       } else {
                        //         //   campground.comments.push(comment);
                        //         //   campground.save(function(err, data){
                        //         //       if(err){
                        //         //           console.log(err);
                        //         //       } else {
                        //         //           console.log(data);
                        //         //       }
                        //         //   });
                        //       }
                        //   });
                  }
                });
            });
        }
    }); 
}

module.exports = seedDB;