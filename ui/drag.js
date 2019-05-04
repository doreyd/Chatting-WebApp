const dragging = (elem, container = document.body) => {
  // **************** get & set position *********************
  // *********************************************************
  const getPosition = element => [element.offsetTop, element.offsetLeft];
  function changePosition(element, elementTop, elementLeft) {
    if (elementTop !== "same") element.style.top = elementTop + "px";
    if (elementLeft !== "same") element.style.left = elementLeft + "px";
  }

  // **************** drag & drop ****************************
  // *********************************************************
  function stopDragging(element) {
    setNewAttribute(element, "draggable", "false");
    element.ondragstart = () => {};
    element.ondrag = () => {};
  }

  function dragStart(element, event) {
    CursorY2 = event.pageY;
    CursorX2 = event.pageX;

    OldPosition = getPosition(element);
    DeltaY = CursorY2 - OldPosition[0];
    DeltaX = CursorX2 - OldPosition[1];
  }

  function dragging(element, event) {
    CursorY = event.pageY;
    CursorX = event.pageX;
    NewTop = CursorY - DeltaY;
    NewLeft = CursorX - DeltaX;
    changePosition(element, NewTop, NewLeft);
  }

  function allowDrop(event) {
    event.preventDefault();
  }

  function drop(event) {
    event.preventDefault();
  }

  function startDragging(element) {
    element.onclick = () => {};
    element.setAttribute("draggable", "true");
    element.ondragstart = () => dragStart(element, event);
    element.ondrag = () => dragging(element, event);
    element.ondragend = () => {};
  }

  container.ondrop = () => drop(event);
  container.ondragover = () => allowDrop(event);
  startDragging(elem);
  // **************** End of drag & drop ********************
  // ********************************************************
};
