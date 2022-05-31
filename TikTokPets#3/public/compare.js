let obj = {};
let preference = -1;
let videoElmts = document.getElementsByClassName("tiktokDiv");

let reloadButtons = document.getElementsByClassName("reload");

let enable = document.getElementById("enabledButton");
enable.addEventListener("click", function() {
  if (preference == -1) {
    alert("choose what you like!");
  } else {
    //send post request
    let chosenObj = new Object();
    if (preference == 1) {
      chosenObj.better = obj[1].rowIdNum;
      chosenObj.worse = obj[0].rowIdNum;
    } else {
      chosenObj.better = obj[0].rowIdNum;
      chosenObj.worse = obj[1].rowIdNum;
    }
    sendPostRequest("/insertPref", chosenObj)
      .then( function (response) {
        console.log("Response recieved", response);
        if (response == "continue") {
          location.reload();
        } else if (response == "pick winner") {
          window.location.href = "winner.html"; 
        } else {
          console.log("error occur");
        }
        /**
        sendGetRequest("/fullOrNot")
          .then(function (result) {
            if (response == "continue") {
              location.reload();
            }
          })
          .catch( function(err) {
            if (err == "pick winner") {
              window.location("winner.html"); 
            } else {
              console.log("POST request error",err);
            }
          });
**/
        
      })
      .catch( function(err) {
        console.log("error get", err);
        if (err == "pick winner") {
           window.location.href("winner.html"); 
        } else {
          console.log("POST request error",err);
        }
      });
  }
  
    
});

let heartButtons = document.querySelectorAll("div.heart");
for (let i=0; i<2; i++) {
  let reload = reloadButtons[i]; 
  reload.addEventListener("click",function() { reloadVideo(videoElmts[i]) });
} // for loop

for (let j=0; j<4; j++) {
  if (j == 1 || j == 3) {
    heartButtons[j].style.display = "none";
  } else {
    heartButtons[j].classList.add("unloved");
  }
  heartButtons[j].addEventListener('click', function() {
    if (j == 0 || j == 2) {
      heartButtons[j].style.display = "none";
      heartButtons[j+1].style.display = "inline";
      if (j == 0) {
        heartButtons[j+3].style.display = "none";
        heartButtons[j+2].style.display = "inline";
        preference = 0;
      } else {
        heartButtons[j-1].style.display = "none";
        heartButtons[j-2].style.display = "inline";
        preference = 1;
      }
    }
  })
}

// hard-code videos for now
// You will need to get pairs of videos from the server to play the game.
sendGetRequest("/getTwoVideo")
  .then(function(response) {
    console.log("Two videos recieve", typeof response);
    //let obj = JSON.parse(response);
    obj = response;
    console.log(obj);
    for (let i=0; i<2; i++) {
      addVideo(obj[i].url,videoElmts[i]);
    }
    // load the videos after the names are pasted in! 
    loadTheVideos();
    let sub1 = document.getElementById("video1");
    let sub2 = document.getElementById("video2");
    sub1.textContent = obj[0].nickname;
    sub2.textContent = obj[1].nickname;
  })



/**
const urls = ["https://www.tiktok.com/@berdievgabinii/video/7040757252332047662",
"https://www.tiktok.com/@catcatbiubiubiu/video/6990180291545468166"];
**/




    