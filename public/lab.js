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
    fill: newMsgDefault,
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
    href: `images/${x[4]}.jpg`,
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
