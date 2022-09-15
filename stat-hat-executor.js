
function getSSP(name, pubConfigs) {
  for (let pubConfig of pubConfigs) {
    if (name.includes(pubConfig.searchName)) return pubConfig;
  }
}

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

function getParameters() {
  return [
    {
      key: "dns",
      name: "DNS Lookup",
      timeEndKey: "domainLookupEnd",
      timeStartKey: "domainLookupStart"
    },
    {
      key: "tcp",
      name: "TCP Connection",
      timeEndKey: "connectEnd",
      timeStartKey: "connectStart"
    },
    {
      key: "que_st",
      name: "Queueing and stalled",
      timeEndKey: "requestStart",
      timeStartKey: "startTime"
    },
    {
      key: "rs_wfs",
      name: "Request Sent and Waiting For Server",
      timeEndKey: "responseStart",
      timeStartKey: "requestStart"
    },
    {
      key: "cd",
      name: "Content Download",
      timeEndKey: "responseEnd",
      timeStartKey: "responseStart"
    },
    {
      key: "dur",
      name: "Duration",
      timeEndKey: "responseEnd",
      timeStartKey: "startTime"
    }
  ];
}

function getBuckets() {
  return [
    {
      key: "0",
      rangeStart: -1,
      rangeEnd: 0
    },
    {
      key: "0-10",
      rangeStart: 0,
      rangeEnd: 10
    },
    {
      key: "10-20",
      rangeStart: 10,
      rangeEnd: 20
    },
    {
      key: "20-30",
      rangeStart: 20,
      rangeEnd: 30
    },
    {
      key: "30-40",
      rangeStart: 30,
      rangeEnd: 40
    },
    {
      key: "40-50",
      rangeStart: 40,
      rangeEnd: 50
    },
    {
      key: "50-100",
      rangeStart: 50,
      rangeEnd: 100
    },
    {
      key: "100-200",
      rangeStart: 100,
      rangeEnd: 200
    }
  ];
}

function getBucketKey(value) {
  const limit = 3000;
  const difference = 200;

  // If value is above 3000
  if (value > limit) return `${limit}_above`;

  // Value between 0 to 200
  const buckets = getBuckets();
  for (let index = 0; index < buckets.length; index++) {
    const bucket = buckets[index];
    if (value > bucket.rangeStart) {
      if (!bucket.hasOwnProperty("rangeEnd")) return bucket.key;
      if (value <= bucket.rangeEnd) {
        return bucket.key;
      }
    }
  }

  // Value between 200 to 3000
  const isDivisible = value % difference === 0;
  const rangeStart = difference * (isDivisible ? Math.floor(value / difference) - 1 : Math.floor(value / difference));
  return `${rangeStart}-${rangeStart + difference}`;
}

function getPartners() {
  return [{
    key: "pm",
    name: "Pubmatic",
    searchName: "hbopenbid.pubmatic.com"
  },
  {
    key: "tl",
    name: "3 Lift",
    searchName: "tlx.3lift.com"
  },
  {
    key: "an",
    name: "adnxs",
    searchName: "ib.adnxs.com"
  },
  {
    key: "rc",
    name: "Rubicon",
    searchName: "fastlane.rubiconproject.com"
  },
  {
    key: "google",
    name: "Google",
    searchName: "securepubads.g.doubleclick.net"
  }
  ];
}

function getTimeValue(endTime, startTime) {
  if (isNaN(endTime) || isNaN(startTime)) return -1;
  if (endTime === 0 || startTime === 0) return -1;
  return endTime - startTime;
}

function statHatHatLogger() {
  let performanceResources = window.performance.getEntriesByType("resource");
  console.log("performanceResources: ", performanceResources);

  const hostName = getHostName();
  const browserName = getBrowserName();

  for (let performanceResource of performanceResources) {
    let pubConfig = getSSP(performanceResource.name, getPartners());
    if (pubConfig) {
      console.log(pubConfig.name, performanceResource);
      const stathatUserEmail = "nikunj.sureka@pubmatic.com";
      const url = "https://api.stathat.com/ez";
      const parameters = getParameters();

      for (let index = 0; index < parameters.length; index++) {
        const parameter = parameters[index];
        const value = getTimeValue(performanceResource[parameter.timeEndKey], performanceResource[parameter.timeStartKey]);
        if (value < 0) {
          continue;
        }

        const stathatKeyToUse = `${pubConfig.key}_${browserName}_${hostName}_${parameter.key}_${getBucketKey(value)}`;
        const data = "time=" + (new Date()).getTime() + "&stat=" + stathatKeyToUse + "&email=" + stathatUserEmail + "&count=1";
        var statHatElement = document.createElement('script');
        statHatElement.src = url + '?' + data;
        statHatElement.async = true;
        document.body.appendChild(statHatElement);
        console.log("StatHatElement: ", statHatElement);
      }
    }
  };
};

statHatHatLogger();
