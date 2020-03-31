function getCurrentListing() {
  return new Promise((resolve) => {
    resolve(document.getElementsByClassName("tour-card__border--transparent"));
  })
}

function copyObject(src) {
  return Object.assign([], src);
}

let intervalHandler;

function startRefresh(refreshInterval, autobook) {
  getCurrentListing().then((result) => {
    let currentListing = copyObject(result);
    intervalHandler = setInterval(() => {
      clickRefresh().then(() => {
        getCurrentListing().then((newListing) => {
          if (newListing.length > currentListing.length) {
            stopRefresh();
            markTrips(getDiffTrips(newListing, currentListing));
            playSuccessSound();
            if (autobook) {
                startAutobook();
             }
          } else if (newListing.length < currentListing.length) {
            currentListing = copyObject(result);
          }
        });
      })
    }, refreshInterval);
  });
}

function getDiffTrips(newTrips, trips) {
  const newTripsArray = Array.from(newTrips)
  const newTripsId = newTripsArray.map(t => t.id);
  const tripsArray = Array.from(trips);
  const tripsId = tripsArray.map(t => t.id);
  const diff = newTripsId.filter(id => !tripsId.includes(id))
  return diff;
}

function markTrips(trips) {
  trips.forEach(tripId => {
    document.getElementById(tripId).style.backgroundColor = "#ccffe6";
  })
}

function playSuccessSound() {
  var _beep = new Audio();
  _beep.src = chrome.runtime.getURL("audio/bell.mp3");
  _beep.play();
}

function clickRefresh() {
  return new Promise(resolve => {
    document.querySelector(".fa.fa-refresh").click();
    resolve();
  }).then(() => {
    return new Promise((res) => {
      let spinInterval = setInterval(() => {
        let spinner = document.querySelector('.fa.fa-spin.fa-spinner.fa-pulse');
        if (!spinner) {
          if (document.evaluate(".//div[contains(text(), 'technical support')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
            return clickRefresh();
          }
          res();
          clearInterval(spinInterval);
        }
      }, 50)
    });
  })
}

function stopRefresh() {
  taskStarted = false;
  clearInterval(intervalHandler)
}

function startAutobook(){
   var resultList = document.querySelector("div.container-fluid.row.align-items-center.tour-header__loadboard-driver-payout-book > div.tour-header__accept-button--loadboard > div:nth-child(2) > button");
  clickBook(resultList);
}

function clickBook(bookElement){
  return new Promise(resolve => {
    bookElement.click();
    resolve();
  }).then(() => {
      return new Promise(res => {
        document.querySelector(".confirmation-body__footer__confirm-button").click();
        res();
      })
  })
}

function sendSuccessMessage() {
  chrome.runtime.sendMessage({ success: true }, function (response) {
  });
}

let taskStarted = false;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  console.log("request is: ", request);
  const start = request.start;
  const stop = request.stop;
  if (start && !taskStarted) {
    taskStarted = true;
    console.log("Starting...")
    startRefresh(start.refreshInterval, start.autobook);
    sendResponse({ message: "ok" });
  }
  if (stop) {
    stopRefresh();
    sendResponse({ message: "ok" });
  }
});
