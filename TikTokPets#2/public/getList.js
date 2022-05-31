let button = document.querySelectorAll("button.x");

getNicknames();
getTableSize();

for (i of button) {
  (function(i) {
    i.addEventListener("click", function() {
      let num = i.id.substring(1);
      //let nickname = document.getElementById("URL"+num).value;
      let data = {
        row: num
      };
      
      if (isEmpty(num)) {
        console.log("Useless");
      } else {
        sendPostRequest("/deleteVideo", data)
        .then( function (response) {
          console.log("Response recieved", response);
          let xSym = document.getElementById("URL"+num);
          xSym.style.cssText = "border: dashed 4px";
          document.getElementById("x"+num).innerHTML = "";
          location.reload();
        })
        .catch( function(err) {
          console.log("POST request error",err);
        });
      }
    });
  })(i);
}

async function sendPostRequest(url,data) {
  params = {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  };
  console.log("about to send post request");
  
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

function getTableSize() {
  GetListRequest("/fullOrNot")
  .then (function(response) {
    console.log("Response recieved", response);
    let obj = JSON.parse(response);
    if (obj.ans == "Full") {
      adButton = document.getElementById("addNew");
      adButton.style.cssText = "opacity: 0.5; pointer-events:none; background-color: grey;"
    } else {
      pgButton = document.getElementById("PlayGame");
      pgButton.style.cssText = "opacity: 0.5; pointer-events:none;background-color: grey;"
    }
  })
  .catch( function(err) {
    console.log("GET request error",err);
  });
}


function getNicknames() {
  GetListRequest("/getList")
  .then( function (response) {
    console.log("Response recieved", response);
    let obj = JSON.parse(response);
    for (let i = 1; i <= 8; i++) {
      if (isEmpty(obj[i-1])) {
        break;
      }
      document.getElementById("URL"+i).innerHTML = obj[i-1].nickname;
      let box = document.getElementById("URL"+i);
      box.style.cssText = "font-family: 'Inter', sans-serif; font-size: 23px; align-items: center; border: solid";
      document.getElementById("x"+i).innerHTML = "X";
    }
    console.log(obj[0].nickname);
  })
  .catch( function(err) {
    console.log("GET request error",err);
  });
}

async function GetListRequest(url) {
  params = {
    method: 'GET', 
    headers: {'Content-Type': 'application/json'},
   };
  console.log("about to send get request");
  
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}



function isEmpty(v) {
    switch (typeof v) {
    case 'undefined':
        return true;
    case 'string':
        if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
        break;
    case 'boolean':
        if (!v) return true;
        break;
    case 'number':
        if (0 === v || isNaN(v)) return true;
        break;
    case 'object':
        if (null === v || v.length === 0) return true;
        for (var i in v) {
            return false;
        }
        return true;
    }
    return false;
}

