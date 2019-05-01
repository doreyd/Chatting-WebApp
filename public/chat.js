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

let userDetails = {
  kayla: ["kayla.jpg"],
  dawn: ["dawn.jpg"],
  scarlett: ["scarlett.jpg"],
  natalie: ["natalie.jpg"],
  jolie: ["jolie.jpg"],
  miley: ["miley.jpg"],
  jessica: ["jessica.jpg"]
};

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
  $senderImg.src = "/files/" + sender + ".jpg";
  $messages.innerHTML = "";
  let senderMessages = allMessage[sender];
  for (let i = 0; i < senderMessages.length; i++) {
    let msgOrigin = senderMessages[i][0] === "sender" ? sender : receiver;
    addNewMessage(senderMessages[i][0], senderMessages[i][1], msgOrigin);
  }
}

$messages.scrollTo(0, $messages.scrollHeight);

const socket = io("http://localhost:5000");

socket.on("otherNowTyping", function(data) {
  if ($communicateWith === data["sender"]) {
    $nowTyping.style.display = "block";
  }
});

socket.on("otherStoppedTyping", function(data) {
  if ($communicateWith === data["sender"]) {
    $nowTyping.style.display = "none";
  }
});

socket.on("msgBack", function(data) {
  if ($communicateWith === data["sender"]) {
    $nowTyping.style.display = "none";
    addNewMessage("sender", data["message"], data["sender"]);
    $messageSender.style.background = "#d0fbcc";
    $messageSender.style.backgroundImage = "linear-gradient(#e4fde2, #b7feb0)";
  } else {
    addTempMessage("sender", data["message"], data["sender"]);
    let sendCont = document.getElementById(data["sender"]);
    if (sendCont !== null) {
      sendCont.style.backgroundImage = "linear-gradient(#e4fde2, #b7feb0)";
      $tempMsg.style.right = "330px";
      setTimeout(() => {
        $tempMsg.style.right = "-300px";
      }, 3000);
      allMessage[data["sender"]].push(["sender", data["message"]]);
    } else {
      loadMessageFromDB();
      $tempMsg.style.right = "330px";
      setTimeout(() => {
        $tempMsg.style.right = "-300px";
      }, 3000);
      allMessage[data["sender"]].push(["sender", data["message"]]);
    }
  }
});

function nowIsTyping(receiver, sender) {
  console.log(receiver, sender);
  let objBeingSent = {
    receiver: receiver,
    sender: sender
  };
  socket.emit("nowTyping", objBeingSent);
}

function stopTyping(receiver, sender) {
  let objBeingSent = {
    receiver: receiver,
    sender: sender
  };
  socket.emit("stopTyping", objBeingSent);
}
function sendMessageForm(receiver, message, sender) {
  let objBeingSent = {
    receiver: receiver,
    message: message,
    sender: sender
  };
  socket.emit("sendMessage", objBeingSent);
}

function initializeSendBox(thisUser) {
  $sendBox.addEventListener("keyup", event => {
    let senderName = $senderName.innerText;
    nowIsTyping(senderName, thisUser);
    $sendBox.onblur = () => {
      stopTyping(senderName, thisUser);
    };

    if (event.key === "Enter") {
      if ($sendBox.value !== "") {
        if (senderName.includes("@")) {
          addNewMessage("receiver", "XXX", thisUser);
        } else {
          addNewMessage("receiver", $sendBox.value, thisUser);
          sendMessageForm(senderName, $sendBox.value, thisUser);
          allMessage[senderName].push(["receiver", $sendBox.value]);
        }

        $sendBox.value = "";
        $messages.scrollTo(0, $messages.scrollHeight);
      }
    }
  });
}

function openMessagingBox(sender, receiver) {
  initializeSendBox(receiver);
  loadMessages(sender, receiver);
}

$messageSender.onclick = () => {
  let posY = parseInt(window.getComputedStyle($messageStation).bottom);
  if (posY === 0) {
    $messageStation.style.bottom = "-306px";
    $sendBox.style.bottom = "-350px";
  } else {
    $messageStation.style.bottom = "0px";
    $sendBox.style.bottom = "0px";
  }
};

$chat.onclick = () => {
  let display = $chatStation.style.display;
  if (display !== "block") {
    $chatStation.style.display = "block";
  } else {
    $chatStation.style.display = "none";
  }
};

$communicateWith = "";

function addSenderToChatStation(senderNameTemp, senderImgTemp, topPos) {
  let senderCont = document.createElement("div");
  let senderImg = document.createElement("img");
  let senderName = document.createElement("div");
  senderCont.className = "messageSender2";

  senderImg.src = "/files/" + senderImgTemp;
  senderImg.className = "senderImg";

  senderName.innerText = senderNameTemp;
  senderName.className = "senderName2";
  senderCont.onclick = () => {
    $messageStation.style.display = "block";
    $communicateWith = senderNameTemp;
    openMessagingBox(senderNameTemp, $thisUserName);
  };
  senderCont.appendChild(senderImg);
  senderCont.appendChild(senderName);
  $innerChat.appendChild(senderCont);
}

function mesgInserting(sender, receiver) {
  let senderFreshMessages = freshMsg[sender];
  for (let i = 0; i < senderFreshMessages.length; i++) {
    let msgOrigin = senderFreshMessages[i][0] === "sender" ? sender : receiver;
    addNewMessage(
      senderFreshMessages[i][0],
      senderFreshMessages[i][1],
      msgOrigin
    );
  }
}

function loadMessageFromDB() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      allMessage = JSON.parse(xhttp.responseText);
      console.log(allMessage);
      loadChatStation(allMessage);
    }
  };
  xhttp.open("GET", "/getMessages", true);
  xhttp.send();
}

function loadChatStation(allMessage) {
  let i = 0;
  for (sender in allMessage) {
    addSenderToChatStation(sender, userDetails[sender][0], i * 40);
    i++;
  }
}

loadMessageFromDB();

$messageStation.style.display = "none";
