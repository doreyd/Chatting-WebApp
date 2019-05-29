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

let svgStyle = {
  width: 1300,
  height: 600
};

setAttr($svg, svgStyle);

let cStyle = {
  cx: 300,
  cy: 200,
  r: 50,
  fill: "red"
};
let gStyle = {
  cx: 200,
  cy: 400,
  r: 100,
  fill: "green"
};
let bStyle = {
  cx: 500,
  cy: 500,
  r: 80,
  fill: "blue"
};
let c = createSvg("circle");
$svg.append(c);
setAttr(c, cStyle);

let b = createSvg("circle");
$svg.append(b);
setAttr(b, bStyle);

let g = createSvg("circle");
$svg.append(g);
setAttr(g, gStyle);

let dot = getElem("dot");

const getData = elem => {
  return [
    parseInt(getAttr(elem, "cx")) + parseInt(getCSS($svg)["left"]),
    parseInt(getAttr(elem, "cy")) + parseInt(getCSS($svg)["top"]),
    parseInt(getAttr(elem, "r")),
    getAttr(elem, "fill")
  ];
};
const showSection = (elem, dd) => {
  elem.style.display = "none";
  let [cx, cy, r, col] = getData(dd);
  expandDiv(elem, 1, cx, cy, r, col);
  elem.style.transition = "all linear .5s";
  elem.style.display = "block";
  setTimeout(() => expandDiv(elem, 2, cx, cy, r, col), 10);
};
const expandDiv = (elem, f, cx, cy, r, col) => {
  elem.style.background = col;
  elem.style.left = cx - f * r + "px";
  elem.style.top = cy - f * r + "px";
  elem.style.width = f * r * 2 + "px";
  elem.style.height = f * r * 2 + "px";
};

c.onclick = e => showSection(dot, e.target);

b.onclick = e => showSection(dot, e.target);

g.onclick = e => showSection(dot, e.target);
