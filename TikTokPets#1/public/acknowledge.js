const report = document.getElementById("report");

let nickn = sessionStorage.getItem("nick");

let msg = report.textContent;
msg = msg.replace("nickname", nickn);
console.log(msg);
report.textContent = msg;

function backToFront() {
  window.location.href = "tiktokpets.html";
}