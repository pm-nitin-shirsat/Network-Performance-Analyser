function injectScript(url, tag, countryCode) {
  var node = document.getElementsByTagName(tag)[0];

  let scr = document.createElement("script");
  scr.innerHTML = `var countryCode = "${countryCode}";`;
  node.appendChild(scr);

  var script = document.createElement("script");
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', url);
  script.setAttribute('id', 'timeout-executor-script');
  node.appendChild(script);
}

chrome.storage.local.get('countryCode', function (items) {
  injectScript(chrome.extension.getURL('inject-script.js'), "body", items.countryCode);
});
