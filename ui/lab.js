const newImgElem = (type, appendTo, props = {}, props2 = {}, i) => {
  let newElem = document.createElementNS("http://www.w3.org/2000/svg", type);
  for (prop in props) newElem.setAttribute(prop, props[prop]);

  let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  let clipPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "clipPath"
  );
  clipPath.setAttribute("id", `clipImg${i}`);

  let img = document.createElement("img");
  for (prop2 in props2) img.setAttribute(prop2, props2[prop2]);
  img.setAttribute("clip-path", `url(#clipImg${i})`);
  img.setAttribute("xlink:href", `${users[i][0]}.jpg)`);

  clipPath.append(newElem);
  defs.append(clipPath);
  appendTo.append(defs);
  return newElem;
};

users.forEach((x, i) =>
  newImgElem(
    "circle",
    svg,
    inStyle(i),
    { height: inStyle(i)[r] * 2, width: height },
    i
  )
);

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

users.forEach((x, i) => newSvgElem("circle", svg, outStyleBig(i)));
users.forEach((x, i) => newSvgElem("circle", svg, outStyleSmall(i)));
users.forEach((x, i) => newSvgElem("circle", svg, inStyle(i)));

users.forEach((x, i) => newSvgElem("circle", svg, msgQtyStyle(i)));
users.forEach((x, i) => newSvgElem("text", svg, textStyle(i), users[i][3]));

<svg width="500" height="350">
  <defs>
    <clipPath id="myCircle">
      <circle cx="250" cy="145" r="125" fill="#FFFFFF" />
    </clipPath>
  </defs>
  <image
    width="500"
    height="350"
    xlink:href="img.jpg"
    clip-path="url(#myCircle)"
  />
</svg>;
