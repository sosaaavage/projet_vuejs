const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

// Connexion database

var mongoose = require('mongoose');
var Resto = require("../models/resto");
mongoose.connect('mongodb://localhost:27017/restosdb');
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
  console.log("Succès de connexion");
});

// CREATE
app.post('/addRestos', (req, res) => {
  var db = req.db;
  var borough = req.body.borough;
  var cuisine = req.body.cuisine;
  var new_resto = new Resto({
    borough: borough,
    cuisine: cuisine
  })

  new_resto.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Resto ajouté avec succès'
    })
  })
})

// READ
// Affiche tous les restos
app.get('/restos', (req, res) => {
  Resto.find({}, 'borough cuisine', function (error, restos) {
    if (error) { console.error(error); }
    res.send({
      restos: restos
    })
  }).sort({_id:-1})
})

app.listen(8081)