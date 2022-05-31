const submitButton = document.getElementById("continue");
submitButton.addEventListener('click', buttonAction);

async function sendPostRequest(url,data) {
  console.log("about to send post request");
  let response = await fetch(url, {
    method: 'POST', 
    headers: {'Content-Type': 'text/plain'},
    body: data });
  if (response.ok) {
    let data = await response.text();
    console.log(data);
    return data;
  } else {
    throw Error(response.status);
  }
}

function buttonAction() {
  let x = document.getElementById("username").value;
  let y = document.getElementById("url").value;
  let z = document.getElementById("nickname").value;
  let res = x + " " + y + " " + z;
  console.log("Sending ", res);
  sendPostRequest('/videoData', res)
    .then(function(data) {
      sessionStorage.setItem("nick",z);
      window.location = "/acknowledge.html";  })
    .catch(function(error) {
    console.log("Error occurred:", error)
  });
}
