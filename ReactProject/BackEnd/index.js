// index.js
// This is our main server file

// include express
const express = require("express");
// create object to interface with express
const app = express();
const fetch = require("cross-fetch");
const bodyParser = require('body-parser');

app.use(express.json());
// make all the files in 'public' available 
app.use(bodyParser.json());

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log("recieve", req.method,req.url);
  next();
})


app.post("/query/getWaterData", (req, res) => {
  console.log("getting water data",req.body);
  let data = req.body;
  console.log(data,"us");
  // we will return an array of results
  lookupWaterData(data.year, data.month)
    .then(function(result) {
      res.json(result);  
    })
    .catch (function(err) {
      return res.send(err);
    })
  
  //return res.send("Post Done"); 
});

// No static server or /public because this server
// is only for AJAX requests

// respond to all AJAX querires with this message
app.use(function (request, response) {
  response.status(404);
  response.send("Backend cannot answer");
})

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});

async function lookupWaterData(year, month) {
  const api_url =  `https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=SHA,ORO,CLE,NML,SNL,DNP,BER&SensorNums=15&dur_code=M&Start=${year}-${month}-01&End=${year}-${month}-28`;
  // send it off
  let fetchResponse = await fetch(api_url);
  let data = await fetchResponse.json()
  return data;
}
