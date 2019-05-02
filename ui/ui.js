let data = {
  kayla: [
    ["receiver", "this is a response to the test", false],
    ["sender", "this is a test", false],
    ["sender", "this", false],
    ["receiver", "hi", false],
    ["receiver", "how are you", false],
    ["sender", "howdddddddddddddddddddddddddddddddddddddddd", false],
    ["sender", "You wanna grab a coffee sometime next week ", false]
  ],
  dawn: [
    ["sender", "how was the book i gave you", false],
    ["receiver", "I really liked it !! ", false],
    ["sender", "I think i will be buying that car we saw last time. ", false]
  ]
};

// Counting how many messages correspond to a certain type and a certain state
const stateCount = (messages, type, state) => {
  return messages.reduce((sum, x) => {
    return (sum = x[0] === type && x[2] === state ? ++sum : sum);
  }, 0);
};

// Changing the state of messages from read (state=true) to unread (state=false) and vice versa
const stateChange = (messages, type, state) => {
  return messages.map(x => (x = x[0] === type ? [x[0], x[1], state] : x));
};

console.log(stateCount(data["kayla"], "sender", false));

const $kayla = document.getElementById("kayla");
const $dawn = document.getElementById("dawn");
const $john = document.getElementById("john");
const $myself = document.getElementById("myself");

let elems = [$kayla, $john, $dawn, $myself];

const setUsers = () => {
  elems.forEach(elem => {
    // let dim = Math.round(Math.random() * 200);
    dim = 80;
    elem.style.position = "absolute";
    elem.style.top = Math.round(Math.random() * 600) + "px";
    elem.style.left = Math.round(Math.random() * 1000) + "px";
    elem.style.height = dim + "px";
    elem.style.width = dim + "px";
    elem.style.borderRadius = "50%";
    elem.style.border = "4px solid steelblue";
    elem.style.padding = "2px";
    setMsgQt(dim, elem.style.top, elem.style.left);
    setName(dim, elem.style.top, elem.style.left, "john");
  });
};

const setMsgQt = (dim, top, left) => {
  let circle = document.createElement("div");
  let dimC = 20;
  circle.style.position = "absolute";
  circle.style.height = dimC + "px";
  circle.style.width = dimC + "px";
  circle.style.borderRadius = "50%";
  circle.style.background = "#e4e4e2";
  circle.style.color = "steelblue";
  cy = parseInt(top) + dim / 2 - (dim * 1.414) / 4;
  cx = parseInt(left) + dim / 2 + (dim * 1.414) / 4;

  circle.style.top = Math.round(cy - dimC / 2) + "px";
  circle.style.left = Math.round(cx - (dimC * 7) / 20) + "px";

  circle.style.fontFmily = "verdana";
  circle.style.fontWeight = "bold";
  circle.style.textAlign = "center";
  circle.style.verticalAlign = "middle";
  circle.style.padding = "2px";
  circle.innerText = "15";

  document.body.append(circle);
};

const setName = (dim, top, left, name) => {
  let nameDiv = document.createElement("div");
  nameDiv.style.position = "absolute";
  nameDiv.style.top = parseInt(top) + dim + "px";
  nameDiv.style.left = parseInt(left) + "px";

  nameDiv.style.fontFmily = "verdana";
  nameDiv.style.fontWeight = "bold";
  nameDiv.style.textAlign = "center";
  nameDiv.style.verticalAlign = "middle";
  nameDiv.style.background = "#e4e4e2";
  nameDiv.style.color = "steelblue";
  nameDiv.style.borderRadius = "5px";
  nameDiv.style.padding = "2px 5px 2px 5px";
  nameDiv.innerText = name;

  document.body.append(nameDiv);
};

setUsers();
