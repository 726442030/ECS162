'use strict'
// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");

// local modules
const db = require("./sqlWrap");
const win = require("./pickWinner");
const fetch = require("cross-fetch");


// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');


/* might be a useful function when picking random videos */
function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  // console.log(n);
  return n;
}


/* start of code run on start-up */
// create object to interface with express
const app = express();

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})
// make all the files in 'public' available 
app.use(express.json());
// make all the files in 'public' available 
app.use(bodyParser.json());
app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/compare.html");
});

// Get JSON out of HTTP request body, JSON.parse, and put 


app.get("/getWinner", async function(req, res) {
  console.log("getting winner");
  try {
  // change parameter to "true" to get it to computer real winner based on PrefTable 
  // with parameter="false", it uses fake preferences data and gets a random result.
  // winner should contain the rowId of the winning video.
  let winner = await win.computeWinner(8,true);
  getWinner(winner) 
    .then (function(val) {
      let re = JSON.stringify(val);
      console.log(typeof re);
      return res.send(re);
    })
  
  // you'll need to send back a more meaningful response here.
  //res.json({});
  } catch(err) {
    res.status(500).send(err);
  }
});

app.post("/insertPref", (req, res) =>{
  console.log("sending Response")
  let data = req.body;
  console.log(data);
  //addDatabase(data);
  insertAndCount(data)
    .then (function(result) {
      return res.send("continue"); 
    })
    .catch(function(err) {
      console.log("err is", err);
      return res.send(err); 
    });
});

app.get("/getTwoVideo", 
  function (req,res) {
    console.log("Get 2 videos recieve")
    checkAllId()
    .then(function(response) {
      let ids = new Array();
      for (let i = 0; i < 8; i++) {
        ids[i] = response[i].rowIdNum;
      }
      //console.log(ids);
      let rid1 = getRandomInt(8);
      let rid2 = getRandomInt(8);
      while (rid1 == rid2) {
        rid1 = getRandomInt(8);
      }
      //console.log("rid", rid1, rid2);
      let url1 = ids[rid1];
      let url2 = ids[rid2];
      //console.log(url1, url2);
      getTVideo(url1, url2)
      .then (function(val) {
        let re = JSON.stringify(val);
        console.log(typeof re);
        return res.send(re);
      })
      .catch (function(err) {
        console.log("GET request error",err);
      });
    })
    .catch (function(err) {
       console.log("GET request error",err);
    });
    
  })


// Page not found
app.use(function(req, res){
  res.status(404); 
  res.type('txt'); 
  res.send('404 - File '+req.url+' not found'); 
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});

async function getTVideo(url1, url2) {
  const sql = 'select * from VideoTable where rowIdNum = ? or rowIdNum = ?';

  let result = await db.all(sql, [url1, url2]);
  //console.log(result);
  /**
  const cmd = 'select * from VideoTable';
  let xiba = await db.all(cmd);
  console.log(xiba);
  **/
  return result;
}

async function checkAllId() {
  const sql = 'select rowIdNum from VideoTable';
  let result = await db.all(sql);
  //console.log(result);
  return result;
}

async function insertAndCount(vidObj) {
  const tableContents = await dumpPTable();
  if (tableContents.length <= 14) {
    await insertVideo(vidObj);
  }
  console.log("Number: ", tableContents.length);
  if (tableContents.length >= 15) {
    let error = "pick winner";
    throw error;
  }
}


async function insertVideo(v) {
  const sql = "insert into PrefTable (better, worse) values (?, ?)";

  await db.run(sql,[v.better, v.worse]);
  console.log("Insert succeed");
}

async function dumpPTable() {
  const sql = "select * from PrefTable";
  
  let result = await db.all(sql);
  console.log(result);
  return result;
}

async function getWinner(id) {
  const cmd = "select * from VideoTable where rowIdNum = ?";
  let result = await db.get(cmd, [id]);
  //console.log(result);
  return result;
}
