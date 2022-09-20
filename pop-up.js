'use strict';

function getCurrentWindow(cb) {
  chrome.windows.getCurrent((win) => {
    cb(win);
  });
}

function clearCustomInterval() {
  chrome.browserAction.setBadgeText({ text: '' });
  chrome.extension.sendRequest({ startInterval: false });
  window.close();
}

function setCustomInterval(countryCode) {
  getCurrentWindow((win) => {
    chrome.browserAction.setBadgeText({ text: 'ON' });
    chrome.extension.sendRequest({ startInterval: true, windowId: win.id, countryCode: countryCode });
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

function getCountryCode() {
  let elem = document.getElementById('country-code');
  if (!elem.value) return "00";
  return String(elem.value).toUpperCase().substring(0, 2);
}

function buttonClicked(event) {
  setStatHatStatus(event.target);
  setInnerHTML(event.target);
  (getStatHatStatus() === 'ON') ? setCustomInterval(getCountryCode()) : clearCustomInterval();
}

function contentLoaded(event) {
  let elem = document.getElementById('toggle-btn');
  setInnerHTML(elem);
  elem.addEventListener('click', buttonClicked);
}

document.addEventListener('DOMContentLoaded', contentLoaded);


