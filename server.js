var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var mongojs=require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");

var databaseUrl = "scraper";
var collections = ["articles"];
var ObjectId = require('mongodb').ObjectId; 

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main"
    })
  );
  app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.nytimes.com").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    // console.log(response.data)
    var $ = cheerio.load(response.data);
// console.log($("div .esl82me1"))
    // Now, we grab every h2 within an article tag, and do the following:
    $("div .esl82me1").each(function(i, element) {
    //   // Save an empty result object
      var title = $(element).children("h2").text();
      var link = $(element).parent("a").attr("href");
        console.log(title);
        console.log("title");
      // Create a new Article using the `result` object built from scraping
    // if(title&&link){
        db.articles.insert({
            "title":title,
            "link":link
        },function(err,inserted){
            if(err){
                console.log(err)
            }else{
                console.log(inserted);
                console.log("it's here")
            }
        })
    // }
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/all", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.articles.find({},function (err,result) {

        res.render("display", {
            article:result
        });
    
    
  });
});

app.get("/all/:id", function(req, res) {
    db.articles.find(ObjectId(req.params.id)
    , function (err, result) {
            res.json(result);
        });
 
  });

// app.post("/all/:id", function(req, res) {
//     db.articles.find(ObjectId(req.params.id),
//         {$push:{"comment":req.body.comment}}
//         ,function(result) {
//       res.json(result);

//     });
//   });

// Route for grabbing a specific Article by id, populate it with it's note
// app.post("/api/:id", function(req, res) {
//     db.articles.updateOne({
//         "_id": req.params.id},
//         {$set:{comment:" "}}
//         ).then(function(result) {
//       res.json(result);

//     });
//   });


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
