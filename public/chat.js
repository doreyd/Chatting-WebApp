const $nowTyping = document.getElementById("nowTyping");
const $messages = document.getElementById("messages");
const $senderName = document.getElementById("senderName");
const $senderImg = document.getElementById("senderImg");
const $sendBox = document.getElementById("sendBox");
const $messageStation = document.getElementById("messageStation");
const $messageSender = document.getElementById("messageSender");
const $chat = document.getElementById("chat");
const $chatContainer = document.getElementById("chatContainer");
const $chatStation = document.getElementById("chatStation");
const $innerChat = document.getElementById("innerChat");

const $mesg = document.getElementById("mesg");
const $mesgImg = document.getElementById("mesgImg");
const $mesgCore = document.getElementById("mesgCore");
const $tempMsg = document.getElementById("tempMsg");

const $leftAnchor = document.getElementById("leftAnchor");

let $thisUserName = "";

// Changing the state of messages from read (state=true) to unread (state=false) and vice versa
const stateChange = (messages, type, state) => {
  return messages.map(x => (x = x[0] === type ? [x[0], x[1], state] : x));
};

function getThisUserName() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      $thisUserName = xhttp.responseText;

      $chat.src = `images/${$thisUserName}.jpg`;
      chatContainer.innerText = `Welcome ${$thisUserName} !`;
    }
  };
  xhttp.open("GET", "/getUserName", true);
  xhttp.send();
}

getThisUserName();

function addTempMessage(msgType, msgCOntent, sender) {
  mesg.className = msgType;
  mesgImg.className = msgType + "Img";
  mesgCore.className = msgType + "Message";

  if (msgCOntent.length > 15) {
    mesgCore.style.wordWrap = "break-word";
    mesgCore.style.width = "150px";
  } else {
    mesgCore.style.width = (msgCOntent.length * 140) / 17 + "px";
  }

  mesgCore.innerText = msgCOntent;

  let sender2 = "";
  if (sender.includes("@")) {
    sender2 = "default";
  } else {
    sender2 = sender;
  }

  mesgImg.src = `/images/${sender2}.jpg`;
  mesg.style.height = mesgCore.offsetHeight + 5 + "px";
}

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
  mesgImg.src = `/images/${sender}.jpg`;

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

const socket = io("http://localhost:5000");

socket.on("otherNowTyping", function(data) {
  let other = document.getElementById(`typing${data["sender"]}`);
  other.setAttribute("class", "innerCircle");

  let other3 = document.getElementById(`outer${data["sender"]}`);
  other3.setAttribute("class", "");

  // let other2 = document.getElementById(`outer${data["sender"]}`);
  // other2.setAttribute("class", "");
  // other.setAttribute("class", "neMsg");

  if ($communicateWith === data["sender"]) {
    $nowTyping.style.display = "block";
  }
});

socket.on("otherStoppedTyping", function(data) {
  let other = document.getElementById(`typing${data["sender"]}`);
  other.setAttribute("class", "");
  if ($communicateWith === data["sender"]) {
    $nowTyping.style.display = "none";
  }
});

socket.on("msgBack", function(data) {
  let other = document.getElementById(`outer${data["sender"]}`);
  other.setAttribute("class", "neMsg");

  let text = document.getElementById(`text${data["sender"]}`);
  let text2 = document.getElementById(`text2${data["sender"]}`);
  let count = parseInt(text2.textContent);
  text2.textContent = count + 1;
  text.setAttribute("class", "show");
  text2.setAttribute("class", "show");
  // console.log(count);

  if ($communicateWith === data["sender"]) {
    $nowTyping.style.display = "none";
    addNewMessage("sender", data["message"], data["sender"]);
    $messageSender.style.background = "#d0fbcc";
    $messageSender.style.backgroundImage = "linear-gradient(#e4fde2, #b7feb0)";
  } else {
    allMessage[data["sender"]].push(["sender", data["message"], false]);
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
  // socket.emit("stopTyping", objBeingSent);
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

$messageStation.onclick = () => {
  let text = document.getElementById(`text${$communicateWith}`);
  let text2 = document.getElementById(`text2${$communicateWith}`);
  text.setAttribute("class", "hide");
  text2.setAttribute("class", "hide");
  text2.textContent = 0;
  console.log(allMessage[$communicateWith]);
  allMessage[$communicateWith] = stateChange(
    allMessage[$communicateWith],
    "sender",
    true
  );
};

$messageSender.onclick = () => {
  let posY = parseInt(window.getComputedStyle($messageStation).bottom);
  if (posY === 0) {
    $messageStation.style.bottom = "-306px";
    $sendBox.style.bottom = "-350px";
  } else {
    $messageStation.style.bottom = "0px";
    $sendBox.style.bottom = "0px";
    // let text = document.getElementById(`text${$communicateWith}`);
    // let text2 = document.getElementById(`text2${$communicateWith}`);
    // text.setAttribute("class", "hide");
    // text2.setAttribute("class", "hide");
    // text2.textContent = 0;
    // console.log(allMessage[$communicateWith]);
    // allMessage[$communicateWith] = stateChange(
    //   allMessage[$communicateWith],
    //   "sender",
    //   true
    // );
    console.log("--------------------------");
    console.log(allMessage[$communicateWith]);
  }
};

$chat.onclick = () =>
  ($chatStation.style.display =
    $chatStation.style.display === "none" ? "block" : "none");

$communicateWith = "";

function addSenderToChatStation(senderNameTemp, senderImgTemp, topPos) {
  let senderCont = document.createElement("div");
  let senderImg = document.createElement("img");
  let senderName = document.createElement("div");
  senderCont.className = "messageSender2";

  senderImg.src = "/images/" + senderImgTemp + ".jpg";
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

let msgData;

changeMesgs = d => {
  msgData = { ...d };
};

let yy = 0;

function loadMessageFromDB() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      allMessage = JSON.parse(xhttp.responseText);

      loadChatStation(allMessage);
      console.log(allMessage);
      msgData2 = formatMessages(allMessage);
      www(msgData2);
    }
  };
  xhttp.open("GET", "/getMessages", true);
  xhttp.send();
}

function loadChatStation(allMessage) {
  let i = 0;
  $innerChat.innerHTML = "";
  for (sender in allMessage) {
    addSenderToChatStation(sender, sender, i * 40);
    i++;
  }
}

// loadMessageFromDB();

// $messageStation.style.display = "none";

const formatMessages = messages => {
  console.log(messages);
  // Counting how many messages correspond to a certain type and a certain state
  const stateCount = (messages, type, state) => {
    console.log(messages);
    return messages.reduce((sum, x) => {
      return (sum = x[0] === type && x[2] === state ? ++sum : sum);
    }, 0);
  };

  // console.log(stateCount(messages["kayla"], "receiver", false));
  // Check if messages are more of a "sender" or "receiver" type
  const msgType = (msgs, type = "sender") =>
    msgs.reduce((sum, x) => (sum = x[0] === type ? ++sum : --sum), 0);

  // // Changing the state of messages from read (state=true) to unread (state=false) and vice versa
  // const stateChange = (messages, type, state) => {
  //   return messages.map(x => (x = x[0] === type ? [x[0], x[1], state] : x));
  // };
  // console.log(msgType(messages["dawn"], "receiver"));
  let keyList = Object.keys(messages);
  // console.log(keyList);
  let msgData = {
    nodes: keyList,
    msgType: keyList.map(x => msgType(messages[x])),
    msgNew: keyList.map(x => stateCount(messages[x], "sender", false)),
    msgUnread: keyList.map(x => stateCount(messages[x], "receiver", false))
  };

  console.log(msgData.nodes);
  return msgData;
};

function www(msgData) {
  const dragSVGgroup = (elemGroupId, linkStart = [], linkEnd = []) => {
    // console.log(linkStart, linkEnd);
    let stElem = linkStart.map(x => document.getElementById(x));
    let enElem = linkEnd.map(x => document.getElementById(x));
    let elemGroup = elemGroupId.map(x => document.getElementById(x));
    elemGroup.forEach(x => dragSVG(x, elemGroup, stElem, enElem));
  };

  // This is a module for drag and drop SVG elements
  const dragSVG = (elem, elemGroup, stElem, enElem) => {
    let delta = [];
    let deltaSt = [];
    let deltaEn = [];

    let elemDragged;

    const coord = (e, elem) => {
      let cursX = e.pageX;
      let cursY = e.pageY;

      let elemX = elem.x ? elem.getAttribute("x") : elem.getAttribute("cx");
      let elemY = elem.y ? elem.getAttribute("y") : elem.getAttribute("cy");

      return [cursX, cursY, elemX, elemY];
    };

    const getDelta = (e, elem, i) => {
      let d2 = coord(e, elem);
      if (elem.cx) {
        elem.setAttribute("cx", d2[0] - delta[i][0]);
        elem.setAttribute("cy", d2[1] - delta[i][1]);
      } else if (elem.x) {
        elem.setAttribute("x", d2[0] - delta[i][0]);
        elem.setAttribute("y", d2[1] - delta[i][1]);
      }
      deltaSt.forEach(arr => {
        arr[0].setAttribute("x1", d2[0] - arr[1]);
        arr[0].setAttribute("y1", d2[1] - arr[2]);
      });
      deltaEn.forEach(arr => {
        arr[0].setAttribute("x2", d2[0] - arr[1]);
        arr[0].setAttribute("y2", d2[1] - arr[2]);
      });
    };

    const newPos = e => {
      elemGroup.forEach((x, i) => {
        getDelta(e, x, i);
      });
    };

    const setDelta = (e, elem) => {
      let d = coord(e, elem);
      // console.log(d);
      delta.push([
        // parseInt(d[0]) - parseInt(d[2]),
        // parseInt(d[1]) - parseInt(d[3])
        d[0] - d[2],
        d[1] - d[3]
      ]);
      deltaSt = stElem.map(elem => [
        elem,
        d[0] - elem.x1.animVal.value,
        d[1] - elem.y1.animVal.value
      ]);

      deltaEn = enElem.map(elem => [
        elem,
        d[0] - elem.x2.animVal.value,
        d[1] - elem.y2.animVal.value
      ]);
      // console.log(delta);
    };

    elem.onmousedown = e => {
      elemDragged = e.target;
      elemGroup.forEach(x => {
        setDelta(e, x);
      });
      svg.onmousemove = e => newPos(e);
    };

    elem.onmouseup = e => {
      delta = [];
      deltaSt = [];
      deltaEn = [];
      elemDragged = "";
      svg.onmousemove = e => {};
    };
  };

  // *****************************************************
  // *****************************************************

  !(function(center, graphType) {
    // Dom selection
    let svg = document.getElementById("svg");

    const setSVGelem = (type, style = {}, appendTo) => {
      let elem = document.createElementNS("http://www.w3.org/2000/svg", type);
      for (let prop in style) elem.setAttribute(prop, style[prop]);
      appendTo.append(elem);
      return elem;
    };

    // Function to create and set up SVG elements
    const nodeGenerator = (
      props = {},
      outer,
      imgProps,
      newMsg,
      newMsg2,
      unreadMsg,
      unreadMsg2,
      x
    ) => {
      let clipPath = setSVGelem("clipPath", { id: `clipPath${x[0]}` }, svg);
      let newElem = setSVGelem(
        "circle",
        { id: `node${x[4]}`, ...props },
        clipPath
      );
      setSVGelem("circle", outer, svg);
      setSVGelem("circle", { ...outer, class: "", id: `typing${x[4]}` }, svg);
      // console.log(x);

      let txtCircle = setSVGelem("circle", newMsg, svg);
      let text2 = setSVGelem("text", newMsg2, svg);
      text2.textContent = center[3].msgNew[x[0]];
      if (center[3].msgNew[x[0]] > 0) {
        txtCircle.setAttribute("class", "show");
        text2.setAttribute("class", "show");
      } else {
        txtCircle.setAttribute("class", "hide");
        text2.setAttribute("class", "hide");
      }
      let idList = [
        `node${x[4]}`,
        `img${x[4]}`,
        `outer${x[4]}`,
        `typing${x[4]}`,
        `text${x[4]}`,
        `text2${x[4]}`
      ];

      // if (center[3].msgNew[x[0]] > 0) {
      //   setSVGelem("circle", newMsg, svg);
      //   let text2 = setSVGelem("text", newMsg2, svg);
      //   text2.textContent = center[3].msgNew[x[0]];
      //   idList = [...idList, `text${x[4]}`, `text2${x[4]}`];
      // }

      let img = setSVGelem("image", imgProps, svg);
      if (x[4] !== $thisUserName) {
        img.onclick = () => {
          $messageStation.style.display = "block";
          $communicateWith = x[4];
          openMessagingBox(x[4], $thisUserName);
        };
      }

      dragSVGgroup([...idList], x[5], x[6]);
      return newElem;
    };

    // ****************************************************************
    // ****** This section allows for random generation of node********
    // ****************************************************************

    // Function generating random numbers between 0 and the picked base
    const ran = base => Math.round(20 + Math.random() * base);

    // Function to generate a random nodes list
    const nodeslistGen = qty => {
      let nodes = [];
      for (let i = 0; i < qty; i++)
        nodes.push([i, ran(800), ran(1300), ran(30), [], []]);
      return nodes;
    };

    // let nodeList = nodeslistGen(30);

    // ****************************************************************
    // ****************************************************************
    // ****************************************************************

    let nodeRaw = [];
    let links = [];

    const sinCos = a => [Math.sin(a), Math.cos(a)];

    const netShape = (cx, cy, r, sin, cos, i, shape) => {
      let x, y;
      if (shape === "circle") {
        x = parseInt(cx + r * cos);
        y = parseInt(cy + r * sin);
      } else if (shape === "star") {
        x = parseInt(cx + r * cos * (1 + (i % 2) / 2));
        y = parseInt(cy + r * sin * (1 + (i % 2) / 2));
      }
      return [x, y];
    };

    let r0 = 30;

    const graphGen = (cx, cy, r, msgs) => {
      console.log(msgs);
      let qty = msgs.nodes.length;
      for (let i = 0; i < qty; i++) {
        let alpha = Math.PI / 6 + (i * (Math.PI * 2)) / qty;
        let [sin, cos] = sinCos(alpha);
        let [x, y] = netShape(cx, cy, r, sin, cos, i, graphType);
        nodeRaw.push([x, y, r0, msgs.nodes[i]]);
        links.push([qty, i]);
      }
      nodeRaw.push([cx, cy, r0, $thisUserName]);
    };

    graphGen(...center);

    // Formatting the node list
    nodeList = nodeRaw.map((x, i) => [i, x[0], x[1], x[2], x[3], [], []]);

    // Formatting the links
    links = links.map((x, i) => ({ id: i, start: x[0], end: x[1] }));
    // Common node style
    let nodeStyle = { fill: "white", "stroke-width": 3, stroke: "white" };

    // Function to generate the SVG nodes
    const nodesGen = nodesList => {
      nodesList.forEach(x => {
        nodeGenerator(
          {
            cy: x[1],
            cx: x[2],
            r: x[3]
          },
          {
            cy: x[1],
            cx: x[2],
            r: x[3] + 6,
            id: `outer${x[4]}`,
            ...nodeStyle,
            fill: "#006ab4",
            "stroke-width": 2
          },
          {
            y: x[1] - x[3],
            x: x[2] - x[3],
            height: x[3] * 2,
            width: x[3] * 2,
            id: `img${x[4]}`,
            href: `images/${x[4]}.jpg`,
            "clip-path": `url(#clipPath${x[0]})`
          },
          {
            cy: x[1] - x[3],
            cx: x[2] + x[3],
            r: 10,
            id: `text${x[4]}`,
            fill: "white"
          },
          {
            y: x[1] - x[3] + 5,
            x: x[2] + x[3] - 4,
            id: `text2${x[4]}`,
            fill: "steelblue"
          },
          {
            y: x[1] + x[3],
            x: x[2] - x[3],
            id: `unread${x[4]}`,
            fill: "white"
          },
          {
            y: x[1] + x[3] + 5,
            x: x[2] - x[3] - 4,
            id: `unread2${x[4]}`,
            fill: "steelblue"
          },
          x
        );
      });
    };

    const createLink = id => {
      let newLink = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      //   for (prop in linkProps) newLink.setAttribute(prop, linkProps[prop]);
      newLink.setAttribute("id", id);
      newLink.setAttribute("style", "stroke:white;stroke-width:2px;");
      // newLink.setAttribute("style", "stroke:white;stroke-width:3px;");
      newLink.setAttribute("x1", nodeList[links[id]["start"]][2]);
      newLink.setAttribute("y1", nodeList[links[id]["start"]][1]);
      newLink.setAttribute("x2", nodeList[links[id]["end"]][2]);
      newLink.setAttribute("y2", nodeList[links[id]["end"]][1]);
      svg.append(newLink);
      return newLink;
    };

    const linkingNodes = () => {
      links.forEach((x, i) => {
        createLink(i);
      });
    };

    const attachNodeLinks = () => {
      links.forEach((x, i) => {
        let nodeSt = x["start"];
        nodeList[nodeSt][5].push(x["id"]);
        let nodeEnd = x["end"];
        nodeList[nodeEnd][6].push(x["id"]);
      });
    };

    attachNodeLinks();
    linkingNodes();
    nodesGen(nodeList);

    // graphGen(...center);
  })([300, 500, 140, msgData], "star");
}

loadMessageFromDB();

$messageStation.style.display = "none";
