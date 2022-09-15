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
        registerTimeoutEvent();
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

// chrome.app.runtime.onLaunched.addListener(function (launchData) {

//   console.log('launchData: on launch: ', launchData);

//   // chrome.app.window.create('index.html', {
//   //     'state': "maximized"
//   // });
//   // // ...
// });

// chrome.app.runtime.onRestarted.addListener(function () {
//   console.log('onRestarted');
// });

// function registerTimeoutEvent() {
//   window.owpbjs.onEvent("bidTimeout", function (argsss) {
//     console.log("123>>", argsss);
//   });
// }

// window?.owpbjs?.onEvent("bidTimeout", function (argsss) {
//   console.log("123>>", argsss);
// });


