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

const $svg = getElem("svg");

let svgStyle = {
  height: 500,
  width: 1200
};

setAttr($svg, svgStyle);

let centerStyle = {
  cx: 450,
  cy: 300,
  r: 30,
  fill: "#40a932"
};

let signUpStyle = {
  cx: 550,
  cy: 150,
  r: 70,
  fill: "#324ea9"
};

let aboutStyle = {
  cx: 600,
  cy: 400,
  r: 55,
  fill: "#9d1b21"
};

let signInStyle = {
  cx: 300,
  cy: 300,
  r: 45,
  fill: " #f58a0c"
};

let lineBase = "#c0bfbf";

let linkStyle = {
  style: `stroke:${lineBase};stroke-width:4px;`
};

const svgInit = (style, type) => {
  let $elem = createSvg(type);
  $svg.append($elem);
  setAttr($elem, style);
  return $elem;
};

[signInStyle, signUpStyle, aboutStyle].forEach(style => {
  let x1 = style.cx;
  let y1 = style.cy;
  let x2 = centerStyle.cx;
  let y2 = centerStyle.cy;
  svgInit({ x1, y1, x2, y2, ...linkStyle }, "line");
});
let $signIn = svgInit(signInStyle, "circle");
let $signUp = svgInit(signUpStyle, "circle");
let $about = svgInit(aboutStyle, "circle");
let $center = svgInit(centerStyle, "circle");

let text2 = {
  // x: signUpStyle.cx,
  // y: signUpStyle.cy,
  fill: "white",
  "text-anchor": "middle",
  "alignment-baseline": "middle",
  style: "font-size:24px;font-family:verdana"
};

const createText = (text, style) => {
  let $text = svgInit({ x: style.cx, y: style.cy, ...text2 }, "text");
  $text.textContent = text;
  return $text;
};

createText("Sign Up", signUpStyle);
createText("Sign In", signInStyle);
createText("About", aboutStyle);
