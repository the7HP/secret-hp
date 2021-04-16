//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});

const userSchema = new mongoose.Schema( {
  email: String,
  password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRETKEY, encryptedFields: ["password"]});//password ni bajuma , (aulp viram) kri new field add kri shakay

const User = new mongoose.model("user", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
const newUser = new User({
  email: req.body.username,
  password: req.body.password
});
newUser.save(function(err){
  if(err){
    console.log(err)
  }else{
    res.render("secrets");
    }
  });
});

app.post("/login", function(req, res){

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, founUser){
    if(err){
      console.log(err);
    } else{
      if(founUser){
        if(founUser.password === password){
          res.render("secrets");
        }
      }
    }
  });
});

app.listen(3000, function() {
  console.log("port number 3000 is running");
});
