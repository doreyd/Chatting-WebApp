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
  ["kayla", 400, 100, 16],
  ["john", 400, 400, 3],
  ["dawn", 200, 500, 2],
  ["kayla", 300, 100, 15],
  ["john", 40, 350, 8],
  ["dawn", 500, 500, 1],
  ["myself", 300, 300, 0]
];

// Dynamic selection of dom elements from users array
// let elems = users.map(x => document.getElementById(x[0]));

// Dynamically create the image elements that will hold the user's avatar
let elems = users.map(x => {
  let elem = document.createElement("img");
  elem.id = x[0];
  document.body.append(elem);
  return elem;
});

// setting the main variables
let colorBase = "steelblue";
let colorSecond = "#f1f1ee";
let dimBase = 80;
let dimC = 30;
let dimFactor = 4;
let padding = "4px";
let mrg = 2;

const setUsers = () => {
  elems.forEach((elem, i) => {
    let dim = dimBase + users[i][3] * dimFactor;
    elem.style.position = "absolute";
    elem.style.top = users[i][1] + "px";
    elem.style.left = users[i][2] + "px";
    elem.style.height = dim + "px";
    elem.style.width = dim + "px";
    elem.style.borderRadius = "50%";
    elem.style.border = "4px solid " + colorBase;
    elem.style.padding = padding;
    elem.src = users[i][0] + ".jpg";
    setName(dim, elem.style.top, elem.style.left, users[i][0]);
    if (users[i][3] !== 0) {
      setMsgQt(dim, elem.style.top, elem.style.left, users[i][3]);
    }
  });
};

const setMsgQt = (dim, top, left, msgQty) => {
  let circle = document.createElement("div");
  circle.style.position = "absolute";
  circle.style.height = dimC + "px";
  circle.style.width = dimC + "px";
  circle.style.borderRadius = "50%";
  // circle.style.background = "#e4e4e2";
  // circle.style.color = colorBase;
  circle.style.background = colorSecond;
  circle.style.color = colorBase;
  circle.style.border = mrg + "px solid white";

  cy = parseInt(top) + dim / 2 - mrg - (dim * 1.414) / 4;
  cx = parseInt(left) + dim / 2 + mrg + (dim * 1.414) / 4;

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

const setName = (dim, top, left, name) => {
  let nameDiv = document.createElement("div");
  nameDiv.style.position = "absolute";
  nameDiv.style.top = parseInt(top) + dim + "px";
  nameDiv.style.left = parseInt(left) + "px";

  nameDiv.style.fontFmily = "verdana";
  nameDiv.style.fontWeight = "bold";
  nameDiv.style.textAlign = "center";
  nameDiv.style.verticalAlign = "middle";
  nameDiv.style.background = colorSecond;
  nameDiv.style.color = colorBase;
  nameDiv.style.borderRadius = "5px";
  nameDiv.style.padding = "2px 5px 2px 5px";
  nameDiv.innerText = name;
  nameDiv.style.border = mrg + "px solid white";
  document.body.append(nameDiv);
};

setUsers();

// Function to create and set up SVG elements
const newSvgElem = (type, appendTo, props = {}, textContent) => {
  let newElem = document.createElementNS("http://www.w3.org/2000/svg", type);
  for (prop in props) newElem.setAttribute(prop, props[prop]);
  if (textContent) newElem.textContent = textContent;
  appendTo.append(newElem);
  return newElem;
};

function setImg(img, x, y, d) {
  // let img = document.getElementById(imgId);
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

const newSvgElem2 = (type, appendTo, props = {}, i) => {
  let newElem = document.createElementNS("http://www.w3.org/2000/svg", type);
  let clipPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "clipPath"
  );
  clipPath.setAttribute("id", `circle${i}`);

  let svgHTML = svg.innerHTML;
  svg.innerHTML =
    svgHTML +
    `<image id="img${i}" xlink:href="kayla.jpg" clip-path="url(#circle${i})" />`;

  let img = document.getElementById(`img${i}`);
  for (prop in props) newElem.setAttribute(prop, props[prop]);

  // console.log(processData(newElem));
  // console.log(img);
  setImg(img, ...processData(newElem));
  console.log(clipPath);
  console.log(img);
  clipPath.append(newElem);
  appendTo.append(clipPath);
  // appendTo.append(img);
  return newElem;
};

let circleStyle = {
  cx: 100,
  cy: 100,
  r: 40,
  fill: "green"
};

let svg = newSvgElem("svg", document.body, { height: 600, width: 1300 });

const outStyleBig = i => {
  let dim = dimBase + users[i][3] * dimFactor,
    cy = users[i][1],
    cx = users[i][2],
    r = Math.round(dim / 2) + 1,
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
    strokeWidth = 4,
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

// let textClass ={}

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
// const newImg = (imgSrc, props = {}) => {
//   let img = document.createElement("img");
//   for (prop in props) img.setAttribute(prop, props[prop]);
//   img.setAttribute("src")
//   img.src = imgSrc + ".jpg";
//   document.body.append(img);
// };

//**************************************** */
// let circle = document.getElementById("circle");

// function setImg(imgId, x, y, d) {
//   let img = document.getElementById(imgId);
//   img.setAttribute("x", x);
//   img.setAttribute("y", y);
//   img.style.height = d + "px";
//   img.style.width = d + "px";
// }

// function getCirDetails(circle) {
//   let cx = circle.getAttribute("cx");
//   let cy = circle.getAttribute("cy");
//   let r = circle.getAttribute("r");
//   return { cx: cx, cy: cy, r: r };
// }

// function processData(circle) {
//   let obj = getCirDetails(circle);
//   let { cx, cy, r } = obj;
//   return [cx - r, cy - r, 2 * r];
// }

// setImg(...processData(circle));
//********************************************* */

users.forEach((x, i) => newSvgElem("circle", svg, outStyleBig(i)));
users.forEach((x, i) => newSvgElem("circle", svg, outStyleSmall(i)));

// users.forEach((x, i) => newSvgElem2("circle", svg, inStyle(i), i));

users.forEach((x, i) => newSvgElem("circle", svg, msgQtyStyle(i)));
users.forEach((x, i) => newSvgElem("text", svg, textStyle(i), users[i][3]));

users.forEach((x, i) => newSvgElem2("circle", svg, inStyle(i), i));

// users.forEach((x, i) => newElem("img", svg, msgQtyStyle(i)));
// const newImgElem = (type, appendTo, props = {}, props2 = {}, i) => {
//   let newElem = document.createElementNS("http://www.w3.org/2000/svg", type);
//   for (prop in props) newElem.setAttribute(prop, props[prop]);

//   let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
//   let clipPath = document.createElementNS(
//     "http://www.w3.org/2000/svg",
//     "clipPath"
//   );
//   clipPath.setAttribute("id", `clipImg${i}`);

//   let img = document.createElement("img");
//   for (prop2 in props2) img.setAttribute(prop2, props2[prop2]);
//   img.setAttribute("clip-path", `url(#clipImg${i})`);
//   img.setAttribute("src", `${users[i][0]}.jpg`);

//   clipPath.append(newElem);
//   defs.append(clipPath);
//   appendTo.append(defs);
//   return newElem;
// };

// users.forEach((x, i) =>
//   newImgElem(
//     "circle",
//     svg,
//     inStyle(i),
//     { height: inStyle(i)["r"] * 2, width: inStyle(i)["r"] * 2 },
//     i
//   )
// );

// users.forEach((x, i) =>
//   newImgElem(
//     "circle",
//     svg,
//     inStyle(i),
//     { height: inStyle(i)["r"] * 2, width: inStyle(i)["r"] * 2 },
//     i
//   )
// );

const setMsgQt2 = (dim, top, left, msgQty) => {
  let circle = document.createElement("div");
  circle.style.position = "absolute";
  circle.style.height = dimC + "px";
  circle.style.width = dimC + "px";
  circle.style.borderRadius = "50%";
  // circle.style.background = "#e4e4e2";
  // circle.style.color = colorBase;
  circle.style.background = colorSecond;
  circle.style.color = colorBase;
  circle.style.border = mrg + "px solid white";

  cy = parseInt(top) + dim / 2 - mrg - (dim * 1.414) / 4;
  cx = parseInt(left) + dim / 2 + mrg + (dim * 1.414) / 4;

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
