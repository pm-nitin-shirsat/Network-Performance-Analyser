// alert(window.owpbjs);
// console.log(window);
function getBrowserName() {
  let userAgent = navigator?.userAgent;
  if (userAgent.match(/firefox|fxios/i)) return "firefox";
  if (userAgent.match(/chrome|chromium|crios/i)) return "chrome";
  if (userAgent.match(/safari/i)) return "safari";
  if (userAgent.match(/opr\//i)) return "opera";
  if (userAgent.match(/edg/i)) return "edge";
  return "others";
}

function getHostName() {
  let hostName = window?.location?.hostname;
  const replaceList = ['www.', 'https://', 'http://', '.com'];
  for (let index = 0; index < replaceList.length; index++) {
    hostName = hostName.replace(replaceList[index], '');
  }
  return hostName;
}

var timeout;
window.owpbjs.onEvent("bidRequested", function (args) {
  //console.log("Requested args: ", args);
  timeout = args.timeout;
});

window.owpbjs.onEvent("bidTimeout", function (timeoutBids) {
  const tBids = JSON.parse(JSON.stringify(timeoutBids));
  const stathatUserEmail = "nikunj.sureka@pubmatic.com";
  const url = "https://api.stathat.com/ez";
  const parameterName = "bidTimeout";
  const hostName = getHostName();
  const browserName = getBrowserName();
  for (let index = 0; index < tBids.length; index++) {
    const timeoutBid = tBids[index];
    const stathatKeyToUse = `${timeoutBid.bidder}_${browserName}_${hostName}_${parameterName}_${countryCode}_${timeout}`;
    const data = "time=" + (new Date()).getTime() + "&stat=" + stathatKeyToUse + "&email=" + stathatUserEmail + "&count=1";
    var statHatElement = document.createElement('script');
    statHatElement.src = url + '?' + data;
    statHatElement.async = true;
    document.body.appendChild(statHatElement);
    console.log("StatHatElement: ", statHatElement);
  }
});


