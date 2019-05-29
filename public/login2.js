const getElem = id => document.getElementById(id);
const getElems = (...ids) => ids.map(id => getElem(id));
const getAttr = (elem, attr) => elem.getAttribute(attr);
const getAttrs = (elem, ...attrs) => attrs.map(attr => getAttr(elem, attr));

const setAttr = (elem, style) => {
  for (key in style) elem.setAttribute(key, style[key]);
};
const setAttrId = (id, style) => setAttr(getElem(id), style);

const createElem = type => document.createElement(type);
const createElems = (...types) => types.map(type => createElem(type));
const createSvg = type =>
  document.createElementNS("http://www.w3.org/2000/svg", type);

const getCSS = (elem, prop) => window.getComputedStyle(elem, prop);

const $svg = getElem("svg");
const $dotCont = getElem("dotContainer");
const $dot = getElem("dot");

const $signInPart = getElem("signInPart");
const $signUpPart = getElem("signUpPart");

const $submit = getElem("submit");
const $underSubmit = getElem("underSubmit");
const $submit2 = getElem("submit2");
const $underSubmit2 = getElem("underSubmit2");
const $aboutPart = getElem("aboutPart");

let svgStyle = {
  // width: 500
  width: 600
};

setAttr($svg, svgStyle);

let centerStyle = {
  cx: 250,
  cy: 300,
  r: 30,
  id: "center-circle",
  fill: "#40a932"
};

let signUpStyle = {
  cx: 350,
  cy: 150,
  r: 60,
  id: "signUp-circle",
  fill: "#324ea9"
};

let aboutStyle = {
  cx: 400,
  cy: 400,
  r: 55,
  id: "about-circle",
  fill: "#9d1b21"
};

let signInStyle = {
  cx: 100,
  cy: 300,
  r: 45,
  id: "signIn-circle",
  fill: "#f58a0c"
};

let lineBase = "#c0bfbf";

let linkStyle = {
  style: `stroke:${lineBase};stroke-width:4px;`
};

const sizeUp = id => {
  let elem = getElem(id);
  let r0 = elem.getAttribute("r");
  elem.setAttribute("r", r0 * 1.3);
  let thisText = getElem(id.split("-")[0]);
  let size0 = parseInt(thisText.style["font-size"]);
  thisText.style["font-size"] = `${size0 * 1.4}px`;
};

const sizeDown = id => {
  let elem = getElem(id);
  let r0 = elem.getAttribute("r");
  elem.setAttribute("r", r0 / 1.3);
  let thisText = getElem(id.split("-")[0]);
  let size0 = parseInt(thisText.style["font-size"]);
  thisText.style["font-size"] = `${size0 / 1.4}px`;
};

// const fillUp = elem => {
//   let r = 100;
//   if (elem.id === "signIn-circle") r = 90;
//   else if (elem.id === "signUp-circle") r = 110;
//   else if (elem.id === "about-circle") r = 120;

//   let color = elem.getAttribute("fill");
//   let cx = elem.getAttribute("cx");
//   let cy = elem.getAttribute("cy");

//   setAttr($topCircle, topStyle(cx, cy, r, color, "block"));
// };

const fillUp = elem => {
  // let r = 100;
  // if (elem.id === "signIn-circle") r = 90;
  // else if (elem.id === "signUp-circle") r = 110;
  // else if (elem.id === "about-circle") r = 120;

  let color = elem.getAttribute("fill");
  // let cx = elem.getAttribute("cx");
  // let cy = elem.getAttribute("cy");

  // setAttr($topCircle, topStyle(cx, cy, r, color, "block"));
};

// let dot = getElem("dot");

const svgInit = (style, type) => {
  let $elem = createSvg(type);
  $svg.append($elem);
  setAttr($elem, style);
  setAttr($elem, { class: "change" });
  if (style.id !== "center-circle" && type === "circle") {
    $elem.onmouseover = e => sizeUp(e.target.getAttribute("id"));
    $elem.onmouseout = e => sizeDown(e.target.getAttribute("id"));
    $elem.onclick = e => {
      // dot.style.display = "none";
      showSection($dot, e.target);
    };
  }

  return $elem;
};

[signInStyle, signUpStyle, aboutStyle].forEach(style => {
  let x1 = style.cx;
  let y1 = style.cy;
  let x2 = centerStyle.cx;
  let y2 = centerStyle.cy;
  svgInit({ x1, y1, x2, y2, ...linkStyle }, "line");
});

// Generate the circles
let $signIn = svgInit(signInStyle, "circle");
let $signUp = svgInit(signUpStyle, "circle");
let $about = svgInit(aboutStyle, "circle");
let $center = svgInit(centerStyle, "circle");

// const sizeUp = e => console.log(e.target);

const basicStyle = size => {
  return {
    fill: "white",
    "text-anchor": "middle",
    "alignment-baseline": "middle",
    contentEditable: "true",
    style: `font-size:${size}px;font-family:verdana`
  };
};

const createText = (text, style, size, id) => {
  let $text = svgInit(
    { x: style.cx, y: style.cy, id, ...basicStyle(size) },
    "text"
  );
  $text.textContent = text;

  $text.onmouseover = () => sizeUp(`${id}-circle`);
  $text.onmouseout = () => sizeDown(`${id}-circle`);

  $text.onclick = () => {
    showSection($dot, getElem(`${id}-circle`));
  };

  return $text;
};

// Generate the texts
createText("Sign Up", signUpStyle, 20, "signUp");
createText("Sign In", signInStyle, 16, "signIn");
createText("About", aboutStyle, 18, "about");

const rePos = val => {
  svg.style.left = `${val}px`;
  $dotCont.style.left = `${val}px`;
};

const changeSVGpos = () => {
  let newPos = Math.floor(document.body.clientWidth) / 2 - 250;
  rePos(newPos);
};

document.body.onresize = () => changeSVGpos();
changeSVGpos();

//Generate the Welome message at the bottom
let welcomeStyle = {
  x: 55,
  y: 600,
  fill: "#324ea9"
};

let lineStyle = {
  x: 55,
  y: 630,
  fill: "#7f7f7f"
};

const createText2 = (text, style, size) => {
  let $text = svgInit(
    {
      x: style.x,
      y: style.y,
      fill: style.fill,
      style: `font-size:${size}px;font-family:verdana`
    },
    "text"
  );
  $text.textContent = text;
  return $text;
};

let topStyle = (cx, cy, r, color, display) => {
  return {
    cx: cx,
    cy: cy,
    r: r,
    id: "top",
    fill: color,
    style: `display:${display};`
  };
};

let $topCircle = svgInit(topStyle(100, 100, 0, "purple", "none"), "circle");

createText2("Welcome to ChitChat !", welcomeStyle, 34, "welcome");
createText2("The instant messaging WebApp", lineStyle, 24, "line");

// let $topCircle = svgInit(topStyle(100, 100, 0, "purple", "none"), "circle");

const getData = elem => {
  return [
    parseInt(getAttr(elem, "cx")),
    parseInt(getAttr(elem, "cy")),
    parseInt(getAttr(elem, "r")),
    getAttr(elem, "fill")
  ];
};

const showSection = (elem, svgElem) => {
  $dot.style.display = "none";
  let [cx, cy, r, col] = getData(svgElem);
  expandDiv(elem, 1, cx, cy, r, col);
  elem.style.transition = "all linear .5s";

  setTimeout(() => expandDiv(elem, 2, cx, cy, r, col), 10);
  $dot.style.display = "block";
  let svgId = getAttr(svgElem, "id");

  if (svgId === "signIn-circle") {
    $signInPart.style.display = "block";
    $signUpPart.style.display = "none";
    $aboutPart.style.display = "none";
  } else if (svgId === "signUp-circle") {
    $signInPart.style.display = "none";
    $signUpPart.style.display = "block";
    $aboutPart.style.display = "none";
  } else if (svgId === "about-circle") {
    $signInPart.style.display = "none";
    $signUpPart.style.display = "none";
    $aboutPart.style.display = "block";
  }
};

const expandDiv = (elem, f, cx, cy, r, col) => {
  elem.style.background = col;
  elem.style.left = cx - f * r + "px";
  elem.style.top = cy - f * r + "px";
  elem.style.width = f * r * 2 + "px";
  elem.style.height = f * r * 2 + "px";
};

const hoverSubmit = () => {
  $underSubmit.style.background = "#40a932";
  $submit.style.color = "white";
};
const hoverOut = () => {
  $underSubmit.style.background = "white ";
  $submit.style.color = "#40a932";
};

const hoverSubmit2 = () => {
  $underSubmit2.style.background = "#40a932";
  $submit2.style.color = "white";
};
const hoverOut2 = () => {
  $underSubmit2.style.background = "white";
  $submit2.style.color = "#40a932";
};

const pushSubmit = () => {
  onmouseleave.log("ddd");
  $underSubmit.style.color = "#fcb158";
  $submit.style.color = "#b36c19";
};

$submit.onmouseover = hoverSubmit;
$submit.onmouseout = hoverOut;

$underSubmit.onmouseover = hoverSubmit;
$underSubmit.onmouseout = hoverOut;

$submit2.onmouseover = hoverSubmit2;
$submit2.onmouseout = hoverOut2;

$underSubmit2.onmouseover = hoverSubmit2;
$underSubmit2.onmouseout = hoverOut2;

$aboutPart.innerText = `
      ChitChat is a chatting WebApp built using
pure javascript on both the front and back end.
No framework, nor any library was used in building
the front-end. Just Javascript, CSS3 & HTML5.
The back end was developed using NodeJS and mongodb.
Please enjoy !!
`;
