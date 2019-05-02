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

let users = [
  ["kayla", 100, 100, 6],
  ["john", 400, 400, 3],
  ["dawn", 200, 500, 2],
  ["myself", 300, 300, 0]
];

// Dynamic selection of dom elements from users array
let elems = users.map(x => document.getElementById(x[0]));

// let colorBase = "#3749ce";
let colorBase = "steelblue";
let dim = 80;
let dimC = 20;
// let msgQty = 6;

const setUsers = () => {
  elems.forEach((elem, i) => {
    elem.style.position = "absolute";
    // elem.style.top = Math.round(Math.random() * 600) + "px";
    // elem.style.left = Math.round(Math.random() * 1000) + "px";
    elem.style.top = users[i][1] + "px";
    elem.style.left = users[i][2] + "px";
    elem.style.height = dim + "px";
    elem.style.width = dim + "px";
    elem.style.borderRadius = "50%";
    elem.style.border = "4px solid " + colorBase;
    elem.style.padding = "2px";
    elem.src = users[i][0] + ".jpg";
    setName(elem.style.top, elem.style.left, users[i][0]);
    if (users[i][3] !== 0) {
      setMsgQt(elem.style.top, elem.style.left, users[i][3]);
    }
  });
};

const setMsgQt = (top, left, msgQty) => {
  let circle = document.createElement("div");
  circle.style.position = "absolute";
  circle.style.height = dimC + "px";
  circle.style.width = dimC + "px";
  circle.style.borderRadius = "50%";
  circle.style.background = "#e4e4e2";
  circle.style.color = colorBase;
  cy = parseInt(top) + dim / 2 - (dim * 1.414) / 4;
  cx = parseInt(left) + dim / 2 + (dim * 1.414) / 4;

  circle.style.top = Math.round(cy - dimC / 2) + "px";
  circle.style.left = Math.round(cx - (dimC * 7) / 20) + "px";

  circle.style.fontFmily = "verdana";
  circle.style.fontWeight = "bold";
  circle.style.textAlign = "center";
  circle.style.verticalAlign = "middle";
  circle.style.padding = "2px";
  circle.innerText = msgQty;

  document.body.append(circle);
};

const setName = (top, left, name) => {
  let nameDiv = document.createElement("div");
  nameDiv.style.position = "absolute";
  nameDiv.style.top = parseInt(top) + dim + "px";
  nameDiv.style.left = parseInt(left) + "px";

  nameDiv.style.fontFmily = "verdana";
  nameDiv.style.fontWeight = "bold";
  nameDiv.style.textAlign = "center";
  nameDiv.style.verticalAlign = "middle";
  nameDiv.style.background = "#e4e4e2";
  nameDiv.style.color = colorBase;
  nameDiv.style.borderRadius = "5px";
  nameDiv.style.padding = "2px 5px 2px 5px";
  nameDiv.innerText = name;

  document.body.append(nameDiv);
};

setUsers();

// set dimensions as dim
// set position as top, left
// set number of messages as msgQty
// set name of user as name
