var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");
var ObjectId = require('mongodb').ObjectId;

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);
mongoose.connect("mongodb://localhost/userdb", { useNewUrlParser: true });

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));
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


mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });




app.get("/", function (req, res) {
  axios.get("https://www.nytimes.com").then(function (response) {
    var $ = cheerio.load(response.data);
    $("div .esl82me1").each(function (i, element) {
      var result = {};

      result.title = $(element).children("h2").text();
      result.link = $(element).parent("a").attr("href");

      db.Article.create(result)
        .then(function (dbArticle) {

          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
    });
    res.send("<a href='https://morning-beach-15286.herokuapp.com/articles'>See articles</a>");
  });
});

app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (result) {
      res.render("display", {
        article: result
      });
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/articles/:id", function (req, res) {
  // db.Article.find({ })
  // console.log(req.params.id)
  db.Article.find({ "_id": ObjectId(req.params.id) })
    .populate("note")
    .then(function (result) {
      res.render("individual", result[0]);
      // res.json(result)
      console.log(result)
    })
    .catch(function (err) {
      res.json(err);
    });
});
app.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: ObjectId(req.params.id) }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.put("/articles/:id", function (req, res) {
  db.Note.update(
    { _id: ObjectId(req.params.id) }, { $set: { note: req.body.note } }, function (data) {
      res.json(data)
    }).catch(function (err) {
      res.json(err);
    });
});

app.delete("/articles/:id", function (req, res) {
  db.Note.deletOne(
    { _id: ObjectId(req.params.id) }, function (data) {
      res.json(data)
    }).catch(function (err) {
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
