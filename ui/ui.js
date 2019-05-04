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

// *****************************************************************
// ****************** Module for creating the UI *******************
// *****************************************************************

// users array = [id, top, left, msgQty]
let users = [
  ["kayla", 400, 300, 6],
  ["john", 400, 400, 3],
  ["dawn", 200, 500, 2],
  ["kayla", 300, 400, 5],
  ["john", 40, 350, 8],
  ["dawn", 500, 500, 11],
  ["myself", 300, 300, 0]
];

// Dynamically create the image elements that will hold the user's avatar
let elems = users.map(x => {
  let elem = document.createElement("img");
  elem.id = x[0];
  document.body.append(elem);
  return elem;
});

// setting the main variables
let colorBase = "steelblue";
// let colorBase = "white";
let colorSecond = "#f1f1ee";
let dimBase = 80;
let dimC = 30;
let dimFactor = 4;
let padding = "4px";
let mrg = 2;

// Function to create and set up SVG elements
const newSvgElem = (type, appendTo, props = {}, textContent) => {
  let newElem = document.createElementNS("http://www.w3.org/2000/svg", type);
  for (prop in props) newElem.setAttribute(prop, props[prop]);
  if (textContent) newElem.textContent = textContent;
  appendTo.append(newElem);
  return newElem;
};

function setImg(img, x, y, d) {
  img.setAttribute("x", x);
  img.setAttribute("y", y);
  img.style.height = d + "px";
  img.style.width = d + "px";
}

function getCirDetails(circle) {
  let cx = circle.getAttribute("cx");
  let cy = circle.getAttribute("cy");
  let r = circle.getAttribute("r");
  return { cx: cx, cy: cy, r: r };
}

function processData(circle) {
  let obj = getCirDetails(circle);
  let { cx, cy, r } = obj;
  return [cx - r, cy - r, 2 * r];
}

const newSvgElemImg = (type, appendTo, props = {}, i) => {
  let newElem = document.createElementNS("http://www.w3.org/2000/svg", type);
  newElem.setAttribute("id", `elem${i}`);
  let clipPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "clipPath"
  );
  clipPath.setAttribute("id", `circle${i}`);
  svg.innerHTML += `<image id="img${i}" xlink:href="kayla.jpg" clip-path="url(#circle${i})" />`;
  let img = document.getElementById(`img${i}`);

  for (prop in props) newElem.setAttribute(prop, props[prop]);
  setImg(img, ...processData(newElem));

  clipPath.append(newElem);
  appendTo.append(clipPath);

  dragSVG(newElem.getAttribute("id"));

  return newElem;
};

let svg = newSvgElem("svg", document.body, { height: 600, width: 1300 });

const outStyleBig = i => {
  let dim = dimBase + users[i][3] * dimFactor,
    cy = users[i][1],
    cx = users[i][2],
    r = Math.round(dim / 2) - 1,
    fill = colorBase;
  return { cy, cx, r, fill };
};

const outStyleSmall = i => {
  let dim = dimBase + users[i][3] * dimFactor,
    cy = Math.round(users[i][1] - (dim * 1.414) / 4),
    cx = Math.round(users[i][2] + (dim * 1.414) / 4),
    r = Math.round(dimC / 2) + 4,
    fill = colorBase;
  return { cy, cx, r, fill };
};

const inStyle = i => {
  let dim = dimBase + users[i][3] * dimFactor,
    cy = users[i][1],
    cx = users[i][2],
    r = Math.round(dim / 2) - 4,
    fill = colorSecond,
    strokeWidth = 10,
    stroke = "white";
  return { cy, cx, r, fill, stroke, "stroke-width": strokeWidth };
};

let msgQtyStyle = i => {
  let dim = dimBase + users[i][3] * dimFactor,
    cy = Math.round(users[i][1] - (dim * 1.414) / 4),
    cx = Math.round(users[i][2] + (dim * 1.414) / 4),
    r = Math.round(dimC / 2),
    strokeWidth = mrg,
    stroke = "white";
  fill = colorSecond;
  return { cy, cx, r, fill, stroke, "stroke-width": strokeWidth };
};

let textStyle = i => {
  let dim = dimBase + users[i][3] * dimFactor;
  let y = Math.round(users[i][1] - (dim * 1.414) / 4) + 5;
  let x = Math.round(users[i][2] + (dim * 1.414) / 4);
  x = users[i][3] > 9 ? x - 10 : x - 4;
  let fill = colorBase;
  let fontFamily = "verdana";
  let fontWeight = "bold";
  let fontSize = "14px";
  return {
    y,
    x,
    fill,
    "font-family": fontFamily,
    "font-weight": fontWeight,
    "font-size": fontSize
  };
};

users.forEach((x, i) => newSvgElem("circle", svg, outStyleBig(i)));
users.forEach((x, i) => newSvgElem("circle", svg, outStyleSmall(i)));
users.forEach((x, i) => newSvgElem("circle", svg, msgQtyStyle(i)));
users.forEach((x, i) => newSvgElemImg("circle", svg, inStyle(i), i));
users.forEach((x, i) => newSvgElem("text", svg, textStyle(i), users[i][3]));
