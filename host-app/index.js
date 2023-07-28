const targetOrigin = "http://localhost:3000"; // target is the iframed app

const iframe = document.querySelector("iframe");
const changeCameraButton = document.querySelector("#changeCamera");

// await ready event from child
let initialized = false;

listenForMessages();

changeCameraButton.addEventListener("click", changeCamera);

function changeCamera() {
  const defaultOrigin = { x: 0, y: 0, z: 0 };
  const origin = {
    x: Number(getInputValue("origin-x")),
    y: Number(getInputValue("origin-y")),
    z: Number(getInputValue("origin-z")),
  };

  const lensAngle = Number(getInputValue("lens-angle"));
  const focusDistance = Number(getInputValue("focus-distance"));

  postToViewer("changeCamera", {
    origin: { ...defaultOrigin, ...origin },
    lensAngle: lensAngle ?? 88,
    focusDistance: focusDistance ?? 20,
  });
}

function postToViewer(type, payload) {
  if (initialized)
    iframe.contentWindow.postMessage({ type, payload }, targetOrigin);
  else
    console.log(
      "Please wait for the embedded viewer to be initialized before sending commands"
    );
}

function listenForMessages() {
  window.addEventListener("message", (e) => {
    console.log(e.origin, document.location.origin, e.data.type);
    if (e.origin === targetOrigin && e.data.type === "ready") {
      console.log("Received ready message from embedded app");
      setDefaultInputValues(e.data.payload);
      initialized = true;
      changeCameraButton.removeAttribute("disabled");
    }
  });
}

function setDefaultInputValues(payload) {
  const { x, y, z } = payload.origin;

  setInputValue("origin-x", x);
  setInputValue("origin-y", y);
  setInputValue("origin-z", z);
  setInputValue("lens-angle", payload.lensAngle);
  setInputValue("focus-distance", payload.focusDistance);
}

function getInputValue(selector) {
  return document.querySelector(`#${selector}`).value;
}

function setInputValue(selector, value) {
  const input = document.querySelector(`#${selector}`);
  if (input) input.value = value;
}
