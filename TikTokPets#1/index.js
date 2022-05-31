// index.js
// This is our main server file

// include express
const express = require("express");
// create object to interface with express
const app = express();
const bodyParser = require('body-parser');

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
});

// make all the files in 'public' available 
app.use(express.static("public"));
app.use(bodyParser.text());
// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/tiktokpets.html");
});

app.post('/videoData', function(req, res, next) {
  let text = req.body;
  console.log("It contained this string:",text);
  res.send(text);
  console.log(text);
});

// Need to add response if page not found!

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!

//404
app.use(function(req, res){ 
  res.status(404); 
  res.type('txt'); 
  res.send('404 - File '+req.url+' not found'); 
});

const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});
