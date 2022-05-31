// index.js
// This is our main server file
'use strict'

// A static server using Node and Express
const express = require("express");
// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');
const fetch = require("cross-fetch");
// create object to interface with express
const app = express();
// Code in this section sets up an express pipeline
const db = require('./sqlWrap');

// print info about incoming HTTP request 
// for debugging

app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})

app.use(express.json());
// make all the files in 'public' available 
app.use(bodyParser.json());
app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/tiktokpet.html");
});

app.post("/videoData", (req, res) =>{
  console.log("sending Response")
  let data = req.body;
  console.log(data);
  //addDatabase(data);
  insertAndCount(data)
    .then (function(result) {
      return res.send("Post Done"); 
    })
    .catch(function(err) {
      return res.send(err); 
    });
  //return res.send("Post Done"); 
});

app.post("/deleteVideo", (req, res) =>{
  console.log("sending Response")
  let data = req.body;
  let dataInt = parseInt(data.row);
  console.log(dataInt);
  deleteDatabase(dataInt);
  return res.send('Delete done'); 
});

app.get("/fullOrNot", function (req,res) {
  console.log("Get table size");
  dumpTable()
    .then (function(response)
    {
      let number = response.length;
      let reply = {};
      if (number >= 8) {
        reply.ans = "Full";
      } else {
        reply.ans = "Less";
      }
      return res.send(reply);
    }) 
    .catch (function(err) {
       console.log("GET request error",err);
    });
})

app.get("/getMostRecent", 
  function (req,res) {
    console.log("Get recent cmd recieve")
    getVideo()
    .then (function(val) {
      let re = JSON.stringify(val);
      return res.send(re);
    })
    .catch (function(err) {
       console.log("GET request error",err);
    });
  })

app.get("/getList", 
  function (req,res) {
    console.log("Get list cmd recieve")
    getTheList()
    .then (function(val) {
      let re = JSON.stringify(val);
      console.log(typeof re);
      return res.send(re);
    })
    .catch (function(err) {
       console.log("GET request error",err);
    });
  })

// Need to add response if page not found!
app.use(function(req, res){
  res.status(404); res.type('txt'); 
  res.send('404 - File '+req.url+' not found'); 
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});

/*
function addDatabase(vidObj) {  
  console.log("Add input into database");
  async function insertAndCount(vidObj) {
    const tableContents = await dumpTable();
      if (tableContents.length >= 8) {
        let error = "Database full";
        throw error;
      } else {
        await changeFlag();
        await insertVideo(vidObj);
    }
  }

  insertAndCount(vidObj)
    .catch(function(err) {
      console.log(err);
    });
}
*/

// ******************************************** //
// Define async functions to perform the database 
// operations we need

// An async function to insert a video into the database
async function insertAndCount(vidObj) {
    const tableContents = await dumpTable();
      if (tableContents.length >= 8) {
        let error = "Database full";
        throw error;
      } else {
        await changeFlag();
        await insertVideo(vidObj);
      }
    console.log("Number: ", tableContents.length);
  }


async function insertVideo(v) {
  const sql = "insert into VideoTable (userid,url,nickname,flag) values (?,?,?,1)";

  await db.run(sql,[v.userid, v.videoURL, v.nickname]);
  console.log("Insert succeed");
}

// an async function to get a video's database row by its nickname
async function getVideo() {

  // warning! You can only use ? to replace table data, not table name or column name.
  const sql = 'select url from VideoTable where flag = 1';
  let result = await db.get(sql);
  console.log(result);
  return result;
}

// an async function to get the whole contents of the database 
async function dumpTable() {
  const sql = "select * from VideoTable";
  
  let result = await db.all(sql);
  return result;
}

async function changeFlag() {
  const cmd = "update VideoTable set flag = 0 where flag = 1";
  await db.run(cmd);
  console.log("Change flag succeed");
}

async function getTheList() {
  const cmd = "select rowid,nickname from VideoTable";
  let result = await db.all(cmd);
  return result
}

async function deleteDatabase(data) {
  const cmd = "delete from VideoTable where rowid = ?";
  await db.run(cmd, [data]);
  const vac = "vacuum";
  await db.run(vac);
  console.log("delete successfully");
}


