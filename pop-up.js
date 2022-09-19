'use strict';

function getCurrentWindow(cb) {
  chrome.windows.getCurrent((win) => {
    cb(win);
  });
}

function clearCustomInterval() {
  // let elem = document.getElementById("timeout-executor-script");
  // if (elem) elem.parentNode.removeChild(elem);
  chrome.browserAction.setBadgeText({ text: '' });
  chrome.extension.sendRequest({ startInterval: false });
  window.close();
}

function setCustomInterval() {
  getCurrentWindow((win) => {
    chrome.browserAction.setBadgeText({ text: 'ON' });
    chrome.extension.sendRequest({ startInterval: true, windowId: win.id });
    window.close();
  });
}

function getStatHatStatus() {
  return localStorage.statHatStatus;
}

function setStatHatStatus(elem) {
  localStorage.statHatStatus = (getStatHatStatus() === 'ON') ? 'OFF' : 'ON';
}

function setInnerHTML(elem) {
  elem.innerHTML = (getStatHatStatus() === 'ON') ? 'OFF' : 'ON';
}

function buttonClicked(event) {
  setStatHatStatus(event.target);
  setInnerHTML(event.target);
  (getStatHatStatus() === 'ON') ? setCustomInterval() : clearCustomInterval();
}

function contentLoaded(event) {
  let elem = document.getElementById('toggle-btn');
  setInnerHTML(elem);
  elem.addEventListener('click', buttonClicked);
}

document.addEventListener('DOMContentLoaded', contentLoaded);


// (function onRestart() {
//   console.log("Restart called");
//   (getStatHatStatus() === 'ON') ? setCustomInterval() : clearCustomInterval();
// })();
