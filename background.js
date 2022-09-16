'use strict';

let intervalId;
const STAT_HAT_API_TIMEOUT = 30000;  // IN ms
const RELOAD_WINDOW_TIMEOUT = 60000;  // IN ms

function reloadWindow(windowId, options = {}) {
  chrome.tabs.query({ windowId: windowId }, async (tabs) => {
    const strategy = {};
    for (const i in tabs) {
      const tab = tabs[i];
      chrome.tabs.reload(tab.id, () => {
        //registerTimeoutEvent();
        setTimeout(async () => {
          chrome.tabs.executeScript(tab.id, { file: "stat-hat-executor.js" });
        }, STAT_HAT_API_TIMEOUT);
      });
    }
  });
}

// chrome.tabs.onActivated.addListener(onActivateTab);

chrome.extension.onRequest.addListener((request, sender, sendResponse) => {
  if (!request.startInterval) {
    clearInterval(intervalId);
    return;
  }
  intervalId = setInterval(() => {
    //setTimeout(() => {
    reloadWindow(request.windowId, {});
  }, RELOAD_WINDOW_TIMEOUT);
});

/////////////////////////

// function getCurrentWindow(cb) {
//   chrome.windows.getCurrent((win) => {
//     cb(win);
//   });
// }

// function setCustomInterval() {
//   getCurrentWindow((win) => {
//     chrome.browserAction.setBadgeText({ text: 'ON' });
//     chrome.extension.sendRequest({ startInterval: true, windowId: win.id });
//     //window.close();
//   });
// }

// window.onload = function () {
//   setCustomInterval();
// };

// function registerTimeoutEvent() {
//   // alert(window.owpbjs);
//   // window.owpbjs.onEvent("bidTimeout", function (argsss) {
//   //   console.log("123>>", argsss);
//   // });
//   chrome.extension.sendRequest({ setBidTimeoutevent: true });
// }

// // window?.owpbjs?.onEvent("bidTimeout", function (argsss) {
// //   console.log("123>>", argsss);
// // });


