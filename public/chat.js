const $nowTyping = document.getElementById("nowTyping");
const $messages = document.getElementById("messages");
const $senderName = document.getElementById("senderName");
const $senderImg = document.getElementById("senderImg");
const $sendBox = document.getElementById("sendBox");
const $messageStation = document.getElementById("messageStation");
const $messageSender = document.getElementById("messageSender");
const $chat = document.getElementById("chat");
const $chatStation = document.getElementById("chatStation");
const $innerChat = document.getElementById("innerChat");

let $thisUserName = "";

function getThisUserName() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      $thisUserName = xhttp.responseText;
    }
  };
  xhttp.open("GET", "/getUserName", true);
  xhttp.send();
}