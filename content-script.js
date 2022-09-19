function injectScript(url, tag) {
  var node = document.getElementsByTagName(tag)[0];
  var script = document.createElement("script");
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', url);
  script.setAttribute('id', 'timeout-executor');
  node.appendChild(script);
}

injectScript(chrome.extension.getURL('inject-script.js'), "body");

//(elem=document.getElementById("testScriptName")).parentNode.removeChild(elem)
