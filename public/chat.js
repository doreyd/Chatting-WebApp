const getElem = id => document.getElementById(id);
const getElems = (...ids) => ids.map(id => getElem(id));

const createElem = type => document.createElement(type);
const createElems = (...types) => types.map(type => createElem(type));

const createSvg = type =>
  document.createElementNS("http://www.w3.org/2000/svg", type);

const getAttr = (elem, attr) => elem.getAttribute(attr);

const setAttr = (elem, style) => {
  for (key in style) elem.setAttribute(key, style[key]);
};

const setAttrId = (id, style) => {
  let elem = getElem(id);
  setAttr(elem, style);
};

const [
  $nowTyping,
  $messages,
  $senderName,
  $senderImg,
  $sendBox,
  $messageStation,
  $messageSender,
  $chat,
  $chatContainer,
  $chatStation,
  $innerChat,
  $mesg,
  $mesgImg,
  $mesgCore,
  $tempMsg,
  $newMsgsReceived
] = getElems(
  "nowTyping",
  "messages",
  "senderName",
  "senderImg",
  "sendBox",
  "messageStation",
  "messageSender",
  "chat",
  "chatContainer",
  "chatStation",
  "innerChat",
  "mesg",
  "mesgImg",
  "mesgCore",
  "tempMsg",
  "newMsgsReceived"
);

let $user = "";

// Changing the state of messages from read (state=true) to unread (state=false) and vice versa
const stateChange = (messages, type, state) =>
  messages.map(x => (x = x[0] === type ? [x[0], x[1], state] : x));

function getUser() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      $user = xhttp.responseText;
      $chat.src = `images/${$user}.jpg`;
      chatContainer.innerText = `Welcome ${$user} !`;
    }
  };
  xhttp.open("GET", "/getUserName", true);
  xhttp.send();
}

getUser();

function addNewMessage(msgType, msgContent, sender) {
  let [mesg, mesgImg, mesgCore] = createElems("div", "img", "div");

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
  $senderImg.src = `/images/${sender}.jpg`;
  $newMsgsReceived.id = `newMsgsReceived${sender}`;

  $messages.innerHTML = "";
  let senderMessages = allMessage[sender];

  senderMessages.forEach(x =>
    addNewMessage(x[0], x[1], x[0] === "sender" ? sender : receiver)
  );
}

$messages.scrollTo(0, $messages.scrollHeight);

let cc = createSvg("circle");
setAttr(cc, { id: "bubble" });
svg.append(cc);

const socket = io("http://localhost:5000");

socket.on("otherNowTyping", d => {
  // setAttrId("bubble", { class: "" });
  // setAttrId("bubble", { class: "hide" });
  setAttrId(`typing${d["sender"]}`, { class: "innerCircle" });
  // setAttrId(`outer${d["sender"]}`, { class: "" });
  if ($comWith === d["sender"]) $nowTyping.style.display = "block";
});

socket.on("otherStoppedTyping", d => {
  // setAttrId("bubble", { class: "" });
  setAttrId(`typing${d["sender"]}`, { class: "" });

  if ($comWith === d["sender"]) $nowTyping.style.display = "none";
});

socket.on("msgBack", d => {
  let cc = getElem("bubble");
  let ccx = getAttr(getElem(`node${d["sender"]}`), "cx");
  let ccy = getAttr(getElem(`node${d["sender"]}`), "cy");
  setAttr(cc, { cx: ccx, cy: ccy, class: "neMsg" });
  setTimeout(() => {
    setAttrId(`typing${d["sender"]}`, { class: "" });
  }, 200);
  setTimeout(() => {
    setAttrId("bubble", { class: "hide" });
  }, 1010);
  // setAttrId(`typing${d["sender"]}`, { class: "" });
  // console.log(getAttr(getElem(`node${d["sender"]}`), "cx"));

  // setAttrId(`outer${d["sender"]}`, { class: "neMsg" });
  let text2 = getElem(`text2${d["sender"]}`);
  text2.textContent++;

  setAttrId(`text${d["sender"]}`, { class: "show" });
  setAttrId(`text2${d["sender"]}`, { class: "show" });

  let msgCounter = getElem(`msgCounter${d["sender"]}`);
  msgCounter.innerText = text2.textContent;
  msgCounter.classList.remove("hide");
  msgCounter.classList.add("show");

  // setAttrId(`outer${d["sender"]}`, { class: "neMsg" });

  // let outer = getElem(`outer${d["sender"]}`);
  // outer.classList.add("neMsg");

  if ($comWith === d["sender"]) {
    $nowTyping.style.display = "none";
    addNewMessage("sender", d["message"], d["sender"]);
    $messageSender.style.background = "#d0fbcc";
    $messageSender.style.backgroundImage = "linear-gradient(#e4fde2, #b7feb0)";
  } else {
    allMessage[d["sender"]].push(["sender", d["message"], false]);
  }
});

function nowIsTyping(receiver, sender) {
  socket.emit("nowTyping", {
    receiver,
    sender
  });
}

function nowRead(receiver, sender) {
  socket.emit("nowRead", {
    receiver,
    sender
  });
}

function stopTyping(receiver, sender) {
  socket.emit("stopTyping", {
    receiver,
    sender
  });
}

function sendMessageForm(receiver, message, sender) {
  socket.emit("sendMessage", {
    receiver,
    message,
    sender
  });
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
        // if (senderName.includes("@")) {
        //   addNewMessage("receiver", "XXX", thisUser);
        // } else {
        addNewMessage("receiver", $sendBox.value, thisUser);
        sendMessageForm(senderName, $sendBox.value, thisUser);
        allMessage[senderName].push(["receiver", $sendBox.value]);
        // }
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
  let text = getElem(`text${$comWith}`);
  let text2 = getElem(`text2${$comWith}`);

  setAttr(text, { class: "hide" });
  setAttr(text2, { class: "hide" });

  text2.textContent = 0;
  let msgCounter = getElem(`msgCounter${$comWith}`);
  msgCounter.innerText = 0;

  msgCounter.classList.remove("show");
  msgCounter.classList.add("hide");

  allMessage[$comWith] = stateChange(allMessage[$comWith], "sender", true);
  nowRead($user, $comWith);
};

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

$chat.onclick = () =>
  ($chatStation.style.display =
    $chatStation.style.display === "none" ? "block" : "none");

$comWith = "";

function addSenderToChatStation(sndTmp, sender) {
  let [sendCont, sendImg, sendName, newMsg] = createElems(
    "div",
    "img",
    "div",
    "p"
  );

  newMsg.id = "msgCounter" + sndTmp;
  newMsg.innerText = 0;
  newMsg.classList.add("newMsg");
  newMsg.classList.add("hide");
  sendCont.className = "messageSender2";

  sendImg.src = "/images/" + sender + ".jpg";
  sendImg.className = "senderImg";

  sendName.innerText = sndTmp;
  sendName.className = "senderName2";
  sendCont.onclick = () => {
    $messageStation.style.display = "block";
    $comWith = sndTmp;

    openMessagingBox(sndTmp, $user);
  };
  sendCont.appendChild(sendImg);
  sendCont.appendChild(sendName);
  $innerChat.appendChild(sendCont);
  sendCont.appendChild(newMsg);
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
  $innerChat.innerHTML = "";
  for (sender in allMessage) addSenderToChatStation(sender, sender);
}

const formatMessages = messages => {
  // Counting how many messages correspond to a certain type and a certain state
  const stateCount = (messages, type, state) => {
    return messages.reduce((sum, x) => {
      return (sum = x[0] === type && x[2] === state ? ++sum : sum);
    }, 0);
  };

  // Check if messages are more of a "sender" or "receiver" type
  const msgType = (msgs, type = "sender") =>
    msgs.reduce((sum, x) => (sum = x[0] === type ? ++sum : --sum), 0);

  // console.log(msgType(messages["dawn"], "receiver"));
  let keyList = Object.keys(messages);
  // console.log(keyList);
  let msgData = {
    nodes: keyList,
    msgType: keyList.map(x => msgType(messages[x])),
    msgNew: keyList.map(x => stateCount(messages[x], "sender", false)),
    msgUnread: keyList.map(x => stateCount(messages[x], "receiver", false))
  };

  return msgData;
};

function www(msgData) {
  const dragSVGgroup = (elemGroupId, linkStart = [], linkEnd = []) => {
    let [a, b, elemGroup] = [linkStart, linkEnd, elemGroupId].map(y =>
      y.map(x => getElem(x))
    );
    elemGroup.forEach(x => dragSVG(x, elemGroup, a, b));
  };

  // This is a module for drag and drop SVG elements
  const dragSVG = (elem, elemGroup, stElem, enElem) => {
    let delta = [];
    let deltaSt = [];
    let deltaEn = [];

    let elemDragged;

    const coord = (e, elem) => {
      let elemX = elem.x ? getAttr(elem, "x") : getAttr(elem, "cx");
      let elemY = elem.y ? getAttr(elem, "y") : getAttr(elem, "cy");

      return [e.pageX, e.pageY, elemX, elemY];
    };

    const getDelta = (e, elem, i) => {
      let d2 = coord(e, elem);
      if (elem.cx) {
        setAttr(elem, { cx: d2[0] - delta[i][0] });
        setAttr(elem, { cy: d2[1] - delta[i][1] });
      } else if (elem.x) {
        setAttr(elem, { x: d2[0] - delta[i][0] });
        setAttr(elem, { y: d2[1] - delta[i][1] });
      }
      deltaSt.forEach(arr => {
        setAttr(arr[0], { x1: d2[0] - arr[1] });
        setAttr(arr[0], { y1: d2[1] - arr[2] });
      });
      deltaEn.forEach(arr => {
        setAttr(arr[0], { x2: d2[0] - arr[1] });
        setAttr(arr[0], { y2: d2[1] - arr[2] });
      });
    };

    const newPos = e => elemGroup.forEach((x, i) => getDelta(e, x, i));

    const setDelta = (e, elem) => {
      let d = coord(e, elem);
      delta.push([d[0] - d[2], d[1] - d[3]]);
      deltaSt = stElem.map(elem => [
        elem,
        d[0] - getAttr(elem, "x1"),
        d[1] - getAttr(elem, "y1")
      ]);

      deltaEn = enElem.map(elem => [
        elem,
        d[0] - getAttr(elem, "x2"),
        d[1] - getAttr(elem, "y2")
      ]);
    };

    elem.onmousedown = e => {
      elemDragged = e.target;
      elemGroup.forEach(x => setDelta(e, x));
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
    let svg = getElem("svg");

    const setSVGelem = (type, style = {}, appendTo) => {
      let elem = createSvg(type);
      setAttr(elem, style);
      appendTo.append(elem);
      return elem;
    };

    // Function to create and set up SVG elements
    const nodeGenerator = (props = {}, outer, imgProps, newMsg, newMsg2, x) => {
      let clipPath = setSVGelem("clipPath", { id: `clip${x[4]}` }, svg);
      let newElem = setSVGelem(
        "circle",
        { id: `node${x[4]}`, ...props },
        clipPath
      );
      setSVGelem("circle", outer, svg);
      setSVGelem("circle", { ...outer, class: "", id: `typing${x[4]}` }, svg);

      let txtCircle = setSVGelem("circle", newMsg, svg);
      let text2 = setSVGelem("text", newMsg2, svg);

      text2.textContent = center[3].msgNew[x[0]];
      if (center[3].msgNew[x[0]] > 0) {
        txtCircle.setAttribute("class", "show");
        text2.setAttribute("class", "show");
        let msgCounter = getElem("msgCounter" + x[4]);

        msgCounter.innerText = center[3].msgNew[x[0]];

        msgCounter.classList.remove("hide");
        msgCounter.classList.add("show");
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

      let img = setSVGelem("image", imgProps, svg);
      if (x[4] !== $user) {
        img.onclick = () => {
          $messageStation.style.display = "block";
          $comWith = x[4];
          openMessagingBox(x[4], $user);
        };
      }

      dragSVGgroup([...idList], x[5], x[6]);
      return newElem;
    };

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
      let qty = msgs.nodes.length;
      for (let i = 0; i < qty; i++) {
        let alpha = Math.PI / 6 + (i * (Math.PI * 2)) / qty;
        let [sin, cos] = sinCos(alpha);
        let [x, y] = netShape(cx, cy, r, sin, cos, i, graphType);
        nodeRaw.push([x, y, r0, msgs.nodes[i]]);
        links.push([qty, i]);
      }
      nodeRaw.push([cx, cy, r0, $user]);
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
            "clip-path": `url(#clip${x[4]})`
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
          x
        );
      });
    };

    const createLink = id => {
      let newLink = createSvg("line");

      setAttr(newLink, {
        id,
        style: "stroke:white;stroke-width:2px;",
        x1: nodeList[links[id]["start"]][2],
        y1: nodeList[links[id]["start"]][1],
        x2: nodeList[links[id]["end"]][2],
        y2: nodeList[links[id]["end"]][1]
      });

      svg.append(newLink);
      return newLink;
    };

    const linkingNodes = () => links.forEach((x, i) => createLink(i));

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
