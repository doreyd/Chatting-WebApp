// Creators, Getters & Setters functions
const createElem = type => document.createElement(type);
const createElems = (...types) => types.map(type => createElem(type));
const createSvg = type =>
  document.createElementNS("http://www.w3.org/2000/svg", type);

const getElem = id => document.getElementById(id);
const getElems = (...ids) => ids.map(id => getElem(id));
const getAttr = (elem, attr) => elem.getAttribute(attr);
const getAttrs = (elem, ...attrs) => attrs.map(attr => getAttr(elem, attr));

const setAttr = (elem, style) => {
  for (key in style) elem.setAttribute(key, style[key]);
};
const setAttrId = (id, style) => setAttr(getElem(id), style);

const setStyle = (elem, keys, values) =>
  keys.forEach((key, i) => (elem.style[key] = values[i]));

const addClass = (elem, ...classes) =>
  classes.forEach(oneClass => {
    elem.classList.add(oneClass);
  });

const addClasses = (...list) =>
  list.forEach(item => {
    addClass(...item);
  });

const setClass = (elem, oneClass) => (elem.className = oneClass);
const setClasses = (...list) => list.forEach(x => setClass(x[0], x[1]));

const append = (elems, anchors) =>
  elems.forEach((elem, i) => anchors[i].append(elem));

let allMessage;

const $nowTyping = getElem("nowTyping");
const $messages = getElem("messages");
const $senderName = getElem("senderName");
const $senderImg = getElem("senderImg");
const $sendBox = getElem("sendBox");
const $msgStation = getElem("msgStation");
const $messageSender = getElem("messageSender");
const $chat = getElem("chat");
const $chatContainer = getElem("chatContainer");
const $chatStation = getElem("chatStation");
const $innerChat = getElem("innerChat");
const $mesg = getElem("mesg");
const $mesgImg = getElem("mesgImg");
const $mesgCore = getElem("mesgCore");
const $tempMsg = getElem("tempMsg");
const $newMsgsReceived = getElem("newMsgsReceived");
const $nameHover = getElem("nameHover");
const $left = getElem("left");
const $seen = getElem("seen");

const $blue = getElem("blue");
const $purple = getElem("purple");
const $red = getElem("red");
const $green = getElem("green");
const $orange = getElem("orange");
const $grey = getElem("grey");

const svg = getElem("svg");

let $comWith = "";
let $user = "";

let colorSuits = {
  grey: [
    "#bcbcbc",
    "#eeeded",
    "#fefafa",
    "white",
    "#0084ff",
    "#354060",
    "#354060",
    "#e8e6e6",
    "white"
  ],
  orange: [
    "white",
    "#a03e09",
    "#bc5720",
    "white",
    "#b2653c",
    "#9e3a04",
    "white",
    "#e5a887",
    "white"
  ],
  green: [
    "white",
    "#249b20",
    "#38ba34",
    "white",
    "#136011",
    "#136011",
    "white",
    "#95e59b",
    "white"
  ],
  red: [
    "white",
    "#8c1014",
    "#ad1a1e",
    "white",
    "#68070a",
    "#68070a",
    "white",
    "#e89b9c",
    "white"
  ],
  purple: [
    "white",
    "#72085d",
    "#93147a",
    "white",
    "#630851",
    "#630851",
    "white",
    "#e5a5d8",
    "white"
  ],
  blue: [
    "white",
    "#006ab4",
    "#0d72b8",
    "white",
    "#006ab4",
    "#040049",
    "white",
    "#99a2e5",
    "white"
  ]
};

let lineBase,
  backBase,
  backSecond,
  newMsgDefault,
  msgSendBack,
  namesColor,
  welcomeColor,
  gradientOne,
  gradientTwo,
  newMsgGradient,
  linkStyle,
  bubbleColor,
  nodeBackColor,
  newMsgTxtColor;

const setColors = colors => {
  [
    lineBase,
    backBase,
    backSecond,
    newMsgDefault,
    msgSendBack,
    namesColor,
    welcomeColor,
    gradientOne,
    gradientTwo
  ] = colors;

  newMsgGradient = `linear-gradient(${gradientOne}, ${gradientTwo})`;
  linkStyle = `stroke:${lineBase};stroke-width:2px;`;
  bubbleColor = lineBase;
  nodeBackColor = backBase;
  newMsgTxtColor = namesColor;
  document.body.style.background = backBase;
  $left.style.background = backSecond;
  $chatContainer.style.color = welcomeColor;
  $nameHover.style.color = namesColor;

  if (allMessage) {
    links.forEach((x, i) => setAttrId(i, { style: linkStyle }));

    loadChatStation(allMessage);

    let usersList = Object.keys(allMessage);
    setAttrId(`typing${$user}`, { fill: nodeBackColor, stroke: lineBase });
    setAttrId(`outer${$user}`, { fill: nodeBackColor });

    usersList.forEach(user => {
      setAttrId(`typing${user}`, { fill: nodeBackColor, stroke: lineBase });
      setAttrId(`outer${user}`, { fill: nodeBackColor });
      setAttrId(`text2${user}`, { fill: namesColor });
      setAttrId(`text${user}`, { stroke: lineBase });

      if (getElem(`text2${user}`).textContent > 0) {
        getElem(`container${user}`).style.background = newMsgGradient;
        getElem(`msgCounter${user}`).innerText = getElem(
          `text2${user}`
        ).textContent;
        getElem(`msgCounter${user}`).style.display = "block";
      }
    });
    if ($comWith !== "") showMesgs($comWith, $user);
  }
};

[$blue, $purple, $red, $green, $orange, $grey].forEach(
  elem => (elem.onclick = () => setColors(colorSuits[elem.id]))
);

setColors(colorSuits["grey"]);

let graphType = "star";
let r0 = 30;
let xPos = Math.floor(parseInt(window.screen.width) / 2);
let yPos = Math.floor(parseInt(window.screen.height) / 2);
let initPos = [yPos - 100, xPos, 140];

// Changing the state of messages from read (state=true) to unread (state=false) and vice versa
const stateChange = (messages, type, state) =>
  messages.map(x => (x = x[0] === type ? [x[0], x[1], state] : x));

const ajaxGET = (url, callback) => {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200)
      callback(JSON.parse(xhttp.responseText));
  };
  xhttp.open("GET", url, true);
  xhttp.send();
};

// const setImg = (elem, url) => {
//   elem.src = url;
//   elem.onerror = () => {
//     elem.onerror = null;
//     elem.src = "http://localhost:5000/images/steve.jpg";
//   };
// };

// const setImgH = url => {
//   let ss = url;
//   let img = new Image();
//   img.src = url;
//   img.onerror = () => {
//     img.onerror = null;
//     img.src = "http://localhost:5000/images/steve.jpg";
//     ss = "http://localhost:5000/images/steve.jpg";
//   };
//   return ss;
// };

const checkImage = (elem, imageSrc) => {
  let img = new Image();
  img.onload = () => (elem.src = imageSrc);
  img.onerror = () => (elem.src = `/images/steve.jpg`);
  img.src = imageSrc;
};

const checkImageH = (elem, imageSrc) => {
  let img = new Image();
  img.onload = () => elem.setAttribute("href", imageSrc);
  img.onerror = () => elem.setAttribute("href", `/images/steve.jpg`);
  img.src = imageSrc;
};

ajaxGET("/getUserName", result => {
  $user = result.userName;
  checkImage($chat, `/images/${$user}.jpg`);
  chatContainer.innerText = `Welcome ${$user} !`;
});

function addNewMessage(msgType, msg, sender) {
  let [mesg, mesgImg, mesgCore] = createElems("div", "img", "div");

  setClasses(
    [mesg, msgType],
    [mesgImg, msgType + "Img"],
    [mesgCore, msgType + "Message"]
  );

  if (msg.length > 15)
    setStyle(mesgCore, ["wordWrap", "width"], ["break-word", "150px"]);
  else mesgCore.style.width = (msg.length * 140) / 17 + "px";

  mesgCore["innerText"] = msg;

  checkImage(mesgImg, `/images/${sender}.jpg`);

  append([mesgImg, mesgCore, mesg], [mesg, mesg, $messages]);

  mesgCore.style.background = msgType === "receiver" ? msgSendBack : "#e7e7e7";
  mesg.style.height = mesgCore.offsetHeight + 5 + "px";
  $messages.scrollTo(0, $messages.scrollHeight);
}

const setOneElem = (elem, data) => {
  data["props"].forEach((prop, i) => {
    if (elem === $senderImg) checkImage(elem, data["values"][i]);
    else elem[prop] = data["values"][i];
  });
};

const setManyElems = (...elems) =>
  elems.forEach(obj => setOneElem(obj["elem"], obj["data"]));

function loadMessages(sender, receiver) {
  setManyElems(
    {
      elem: $senderName,
      data: { props: ["innerText"], values: [sender] }
    },
    {
      elem: $senderImg,
      data: { props: ["src"], values: [`/images/${sender}.jpg`] }
    },
    {
      elem: $newMsgsReceived,
      data: { props: ["id"], values: [`newMsgsReceived${sender}`] }
    },
    {
      elem: $messages,
      data: { props: ["innerHTML"], values: [""] }
    }
  );
  $senderName.style["color"] = namesColor;
  allMessage[sender].forEach(x =>
    addNewMessage(x[0], x[1], x[0] === "sender" ? sender : receiver)
  );
}

$messages.scrollTo(0, $messages.scrollHeight);

// Create the bubble to be used when receiving a new message
let bubble = createSvg("circle");
setAttr(bubble, { id: "bubble" });
svg.append(bubble);

const hideTyping = d => setAttrId(`typing${d["sender"]}`, { class: "" });
const hideBubble = () => setAttrId("bubble", { class: "hide" });

// The bubbling effect triggered when receiving a new message
const buubbleUp = d => {
  let [bubble, node] = getElems(`bubble`, `node${d["sender"]}`);
  let [cx, cy] = getAttrs(node, "cx", "cy");
  setAttr(bubble, {
    cx,
    cy,
    stroke: bubbleColor,
    fill: bubbleColor,
    class: "neMsg"
  });

  setTimeout(() => hideTyping(d), 200);
  setTimeout(() => stopType(d), 50);
  setTimeout(() => hideBubble(), 1010);
};

const stopType = d => {
  hideTyping(d);
  getElem(`typing2${d["sender"]}`).style.display = "none";
  if ($comWith === d["sender"]) $nowTyping.style.display = "none";
};

// Socket connection
const socket = io("http://localhost:5000");

// Socket Events handling
socket.on("otherNowTyping", d => {
  getElem(`typing${d["sender"]}`).style.stroke = lineBase;
  setAttrId(`typing${d["sender"]}`, { class: "circlePulsing" });
  getElem(`typing2${d["sender"]}`).style.display = "block";
  if ($comWith === d["sender"]) $nowTyping.style.display = "block";
});

socket.on("otherStoppedTyping", d => {
  stopType(d);
});

const showSeen = d => {
  if (d["sender"] === $comWith) $seen.style.display = "block";
  allMessage[$comWith] = stateChange(allMessage[$comWith], "receiver", true);
  // console.log(stateCount(allMessage[$comWith], "receiver", false));
  // console.log(allMessage[$comWith]);
};

socket.on("messageRead", d => {
  showSeen(d);
});

const msgCountUp = (n, d) => {
  let [name, display] = n === 0 ? [$comWith, "hide"] : [d["sender"], "show"];

  let [text, text2] = getElems(`text${name}`, `text2${name}`);

  setAttr(text, { class: display });
  setAttr(text2, { class: display });

  if (display === "show") text2.textContent++;
  else text2.textContent = 0;

  let msgCounter = getElem(`msgCounter${name}`);
  msgCounter.innerText = text2.textContent;
  msgCounter.classList.remove(display === "show" ? "hide" : "show");
  msgCounter.classList.add(display);
};

const updateLocalMsgs = d =>
  allMessage[d["sender"]].push(["sender", d["message"], false]);

socket.on("newMessage", d => {
  if (d["sender"] === $comWith) $seen.style.display = "none";
  getElem(`container${d["sender"]}`).style.backgroundImage = newMsgGradient;
  buubbleUp(d);
  msgCountUp(1, d);
  updateLocalMsgs(d);
  if ($comWith === d["sender"]) {
    $nowTyping.style.display = "none";
    showMesgs($comWith, $user);
  }
});

// Socket Event Emitting
const nowIsTyping = (receiver, sender) =>
  socket.emit("nowTyping", {
    receiver,
    sender
  });

const nowRead = (receiver, sender) =>
  socket.emit("nowRead", {
    receiver,
    sender
  });

const stopTyping = (receiver, sender) =>
  socket.emit("stopTyping", {
    receiver,
    sender
  });

const sendMessage = (receiver, message, sender) => {
  $seen.style.display = "none";
  socket.emit("sendMessage", {
    receiver,
    message,
    sender
  });
};

function initializeSendBox(thisUser) {
  $sendBox.addEventListener("keyup", event => {
    let senderName = $senderName.innerText;
    nowIsTyping(senderName, thisUser);
    $sendBox.onblur = () => stopTyping(senderName, thisUser);

    if (event.key === "Enter") {
      if ($sendBox.value !== "") {
        addNewMessage("receiver", $sendBox.value, thisUser);
        sendMessage(senderName, $sendBox.value, thisUser);
        allMessage[senderName].push(["receiver", $sendBox.value, false]);
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

$msgStation.onclick = () => {
  getElem(`container${$comWith}`).style.background = newMsgDefault;
  getElem(`messageSender`).style.background = newMsgDefault;
  msgCountUp(0);

  let unread = stateCount(allMessage[$comWith], "sender", false);
  if (unread > 0) nowRead($user, $comWith);
  allMessage[$comWith] = stateChange(allMessage[$comWith], "sender", true);
};

const setBottom = (pos, ...elems) =>
  elems.forEach(elem => (elem.style["bottom"] = `${pos}px`));

const getStyle = (elem, prop) => elem.style[prop];

$messageSender.onclick = () => {
  let bottom = parseInt(getStyle($sendBox, "bottom"));
  if (bottom !== 0) setBottom(0, $msgStation, $sendBox);
  else setBottom(-306, $msgStation, $sendBox);
};

$chat.onclick = () => {
  $chatStation.style["display"] =
    getStyle($chatStation, "display") === "none" ? "block" : "none";
};

const showMesgs = (sender, thisUser) => {
  let unread = stateCount(allMessage[sender], "receiver", false);
  let lastMsgType = allMessage[sender][allMessage[sender].length - 1][0];
  if (unread === 0 && lastMsgType === "receiver") $seen.style.display = "block";
  else $seen.style.display = "none";
  $seen.style.color = msgSendBack;
  $msgStation.style.display = "block";
  $comWith = sender;
  openMessagingBox(sender, thisUser);
  if (getElem(`text2${sender}`).textContent > 0)
    $messageSender.style.backgroundImage = newMsgGradient;
  else $messageSender.style.backgroundImage = "";
};

function addSender(sender) {
  let [container, img, name, msg, typing] = createElems(
    "div",
    "img",
    "div",
    "p",
    "p"
  );

  addClasses(
    [msg, "newMsg", "hide"],
    [img, "senderImg"],
    [name, "senderName2"],
    [typing, "typing"],
    [container, "messageSender2"]
  );
  container.id = `container${sender}`;
  typing.id = `typing2${sender}`;
  typing.innerText = "is now typing...";
  typing.style.display = "none";
  msg.style.color = backBase;
  msg.style.border = `1px solid ${backBase}`;

  msg.id = `msgCounter${sender}`;
  msg.innerText = 0;
  msg.style.color = namesColor;
  name.innerText = sender;
  name.style.color = namesColor;

  checkImage(img, `/images/${sender}.jpg`);

  // img.src = `/images/${sender}.jpg`;
  // img.onerror = () => {
  //   img.onerror = null;
  //   img.src = "http://localhost:5000/images/steve.jpg";
  // };
  container.onclick = () => showMesgs(sender, $user);

  append(
    [img, name, msg, typing, container],
    [container, container, container, container, $innerChat]
  );
}

function loadChatStation(allMessage) {
  $innerChat.innerHTML = "";
  for (sender in allMessage) addSender(sender);
}

// Counting how many messages correspond to a certain type and a certain state
const stateCount = (messages, type, state) => {
  return messages.reduce((sum, x) => {
    return (sum = x[0] === type && x[2] === state ? ++sum : sum);
  }, 0);
};

// Check if messages are more of a "sender" or "receiver" type
const msgType = (msgs, type = "sender") =>
  msgs.reduce((sum, x) => (sum = x[0] === type ? ++sum : --sum), 0);

// Format Messages to be used in the graph
const formatMessages = messages => {
  let keyList = Object.keys(messages);
  let msgData = {
    nodes: keyList,
    msgType: keyList.map(x => msgType(messages[x])),
    msgNew: keyList.map(x => stateCount(messages[x], "sender", false)),
    msgUnread: keyList.map(x => stateCount(messages[x], "receiver", false))
  };
  return msgData;
};

let msgData;
let center = [];

// function www(msgData) {
const chainSVGgroup = (elemGroupId, linkStart = [], linkEnd = []) => {
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

const setSVGelem = (type, style, appendTo) => {
  let elem = createSvg(type);
  setAttr(elem, style);
  appendTo.append(elem);
  return elem;
};

const showName = e => {
  $nameHover.innerText = e.target.id.split("img")[1];
  $nameHover.style.display = "block";
  $nameHover.style.top = e.pageY + 40 + "px";
  $nameHover.style.left = e.pageX + "px";
};

const hideName = () => {
  $nameHover.style.display = "none";
};

// Function to create and set up SVG elements
const nodeGenerator = (x, ...styles) => {
  let [nodeSt, outerSt, imgSt, typingSt, msgSt, msgTextSt, clipSt] = styles;
  let user = x[4];
  let newMsgQty = center[3].msgNew[x[0]];

  let clipPath = setSVGelem("clipPath", clipSt, svg);
  let newElem = setSVGelem("circle", nodeSt, clipPath);
  setSVGelem("circle", outerSt, svg);
  setSVGelem("circle", typingSt, svg);

  let $msgSt = setSVGelem("circle", msgSt, svg);
  let $msgTextSt = setSVGelem("text", msgTextSt, svg);
  $msgTextSt.textContent = newMsgQty;

  if (newMsgQty > 0) {
    setAttr($msgSt, { class: "show" });
    setAttr($msgTextSt, { class: "show" });
    let msgCounter = getElem("msgCounter" + user);
    msgCounter.innerText = newMsgQty;
    msgCounter.classList.remove("hide");
    msgCounter.classList.add("show");
    getElem("container" + user).style.backgroundImage = newMsgGradient;
  } else {
    setAttr($msgSt, { class: "hide" });
    setAttr($msgTextSt, { class: "hide" });
  }

  let idList = [
    `node${user}`,
    `img${user}`,
    `outer${user}`,
    `typing${user}`,
    `text${user}`,
    `text2${user}`
  ];

  let img = setSVGelem("image", imgSt, svg);
  img.onclick = user !== $user ? () => showMesgs(user, $user) : "";

  checkImageH(img, `images/${user}.jpg`);
  img.onmouseover = showName;
  img.onmouseout = hideName;

  chainSVGgroup([...idList], x[5], x[6]);
  return newElem;
};

// *********************************************
// *********** Graph Style Formatting **********
// *********************************************

const nodeSt = x => {
  return {
    cy: x[1],
    cx: x[2],
    r: x[3],
    id: `node${x[4]}`
  };
};

const outerSt = x => {
  return {
    cy: x[1],
    cx: x[2],
    r: x[3] + 6,
    id: `outer${x[4]}`,
    "stroke-width": 3,
    stroke: lineBase,
    fill: nodeBackColor,
    "stroke-width": 2
  };
};

const imgSt = x => {
  return {
    y: x[1] - x[3],
    x: x[2] - x[3],
    height: x[3] * 2,
    width: x[3] * 2,
    id: `img${x[4]}`,
    "clip-path": `url(#clip${x[4]})`
  };
};

const typingSt = x => {
  return {
    ...outerSt(x),
    class: "",
    id: `typing${x[4]}`
  };
};

const msgSt = x => {
  return {
    cy: x[1] - x[3],
    cx: x[2] + x[3],
    r: 10,
    id: `text${x[4]}`,
    fill: newMsgDefault
  };
};

const msgTextSt = x => {
  return {
    y: x[1] - x[3] + 5,
    x: x[2] + x[3] - 4,
    id: `text2${x[4]}`,
    fill: namesColor
  };
};

const clipSt = x => {
  return {
    id: `clip${x[4]}`
  };
};
// *********************************************
// *********************************************

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

// Initialize the nodeRaw list
const nodeRawInit = (cx, cy, r, msgs) => {
  msgs.nodes.forEach((node, i, arr) => {
    let alpha = Math.PI / 6 + (i * (Math.PI * 2)) / arr.length;
    let [sin, cos] = sinCos(alpha);
    let [x, y] = netShape(cx, cy, r, sin, cos, i, graphType);
    nodeRaw.push([x, y, r0, msgs.nodes[i]]);
    links.push([arr.length, i]);
  });
  nodeRaw.push([cx, cy, r0, $user]);
};

function generateGraph(center) {
  nodeRawInit(...center);
  // Formatting the node list
  let nodeList = nodeRaw.map((x, i) => [i, x[0], x[1], x[2], x[3], [], []]);
  links = links.map((x, i) => ({ id: i, start: x[0], end: x[1] }));

  const nodesGen = nodesList => {
    nodesList.forEach(node => {
      nodeGenerator(
        node,
        nodeSt(node),
        outerSt(node),
        imgSt(node),
        typingSt(node),
        msgSt(node),
        msgTextSt(node),
        clipSt(node)
      );
    });
  };

  const createLink = id => {
    let newLink = createSvg("line");
    setAttr(newLink, {
      id,
      style: linkStyle,
      y1: nodeList[links[id]["start"]][1],
      x1: nodeList[links[id]["start"]][2],
      y2: nodeList[links[id]["end"]][1],
      x2: nodeList[links[id]["end"]][2]
    });
    svg.append(newLink);
    return newLink;
  };

  const linkingNodes = () => links.forEach((x, i) => createLink(i));

  const attachNodeLinks = () => {
    links.forEach(x => {
      nodeList[x["start"]][5].push(x["id"]);
      nodeList[x["end"]][6].push(x["id"]);
    });
  };

  attachNodeLinks();
  linkingNodes();
  nodesGen(nodeList);
}

ajaxGET("/getMessages", result => {
  allMessage = result;
  loadChatStation(allMessage);
  msgData = formatMessages(allMessage);
  center = [...initPos, msgData];
  generateGraph(center);
});

const rePos = val => {
  svg.style.left = `-${val}px`;
  svg.setAttribute("width", document.body.clientWidth + val);
};

const changeSVGpos = () => {
  let newPos = Math.floor(675 - document.body.clientWidth / 2);
  rePos(newPos);
};

document.body.onresize = () => {
  changeSVGpos();
};
changeSVGpos();

$chatStation.style.display = "none";
