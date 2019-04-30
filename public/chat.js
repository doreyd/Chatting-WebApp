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

getThisUserName();

function addNewMessage(msgType, msgContent, sender) {
  let mesg = document.createElement("div");
  let mesgImg = document.createElement("img");
  let mesgCore = document.createElement("div");

  mesg.className = msgType;
  mesgImg.className = msgType + "Img";
  mesgCore.className = msgType + "Message";

  if (msgContent.length > 15) {
    mesgCore.style.wordWrap = "break-word";
    mesgCore.style.width = "150px";
  } else {
    mesgCore.style.width = (msgContent.length * 140) / 17 + "px";
  }

  mesgCore.innerText = msgContent;
  mesgImg.src = `/files/${sender}.jpg`;

  mesg.appendChild(mesgImg);
  mesg.appendChild(mesgCore);
  $messages.appendChild(mesg);

  mesg.style.height = mesgCore.offsetHeight + 5 + "px";
  $messages.scrollTo(0, $messages.scrollHeight);
}

function loadMessages(sender, receiver) {
  $senderName.innerText = sender;
  $senderImg.src = "/images/" + sender + ".jpg";
  $messages.innerHTML = "";
  let senderMessages = allMessage[sender];
  for (let i = 0; i < senderMessages.length; i++) {
    let msgOrigin = senderMessages[i][0] === "sender" ? sender : receiver;
    addNewMessage(senderMessages[i][0], senderMessages[i][1], msgOrigin);
  }
}

$messages.scrollTo(0, $messages.scrollHeight);

const socket = io("http://localhost:3000");

socket.on("otherNowTyping", function(data) {
  if ($communicateWith === data["messageOrigin"]) {
    $nowTyping.style.display = "block";
  }
});

socket.on("otherStoppedTyping", function(data) {
  if ($communicateWith === data["messageOrigin"]) {
    $nowTyping.style.display = "none";
  }
});
