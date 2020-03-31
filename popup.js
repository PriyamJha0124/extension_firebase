chrome.tabs.executeScript({ file: "main.js" });
import * as firebase from './firebase.js';

let startButton = document.getElementById("start");
let stopButton = document.getElementById("stop");
let checkbox = document.getElementById("dabox");
let dropdown = document.getElementById("refreshInterval");
let statusTxt = document.getElementById("status");
let logoutBtn = document.getElementById("logout");
let settings = {
  refreshRate : "",
  autoBook: "",
  status: ""
};

function uploadSettings(user) {
  firebase.default
  .database()
  .ref(user.uid + '/Settings')
  .set(settings)
  .then(() => {
    console.log('Settings Uploaded');
  })
  .catch((err)=> {
    console.log(err);
  });
}

async function downloadSettings(user) {
 await firebase.default
  .database()
  .ref(user.uid + '/Settings')
  .once('value')
  .then(snapshot => {
    settings.refreshRate = snapshot.val().refreshRate;
    settings.autoBook = snapshot.val().autoBook;
    settings.status = snapshot.val().status;
    statusTxt.innerText = (settings.status === 'start') ? 'Started' : 'Stopped';
    console.log('Settings Downloaded')
  })
  .catch(err => {
    console.log(err);
  })
}

function setSettingsToDOM() {
  dropdown.value = settings.refreshRate;
  checkbox.checked = settings.autoBook;
}

document.addEventListener('DOMContentLoaded', () => {
  var currentUser = JSON.parse(localStorage.getItem('user'));
  // localStorage.removeItem('user');
  // console.log(currentUser);
  downloadSettings(currentUser.user)
  .then(() => {
    if (settings.autoBook === '' || settings.status === '') {
      settings.refreshRate = refreshInterval.value;
      settings.autoBook = checkbox.checked;
      settings.status = 'stop';
      uploadSettings(currentUser.user);
    }
    setSettingsToDOM();
  })
  .catch(err => {
    throw new Error(err);
  })
  
  checkbox.onchange = () => {
    settings.autoBook = checkbox.checked;
    uploadSettings(currentUser.user);
  };

  dropdown.onchange = () => {
    settings.refreshRate = refreshInterval.value;
    uploadSettings(currentUser.user);
  };

  logoutBtn.onclick = () => {
    firebase.default
    .auth()
    .signOut()
    .then(() => {
      localStorage.removeItem('user');
      window.location.href = 'auth.html'
    })
    .catch(err => {
      throw new Error(err);
    });
  };

  stopButton.onclick = function () {
    settings.status = 'stop';
    uploadSettings(currentUser.user);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { stop: true },
        function (response) {
          console.log(response);
          window.close();
        }
      );
    });
  };
  
  startButton.onclick = function () {
    settings.status = 'start';
    uploadSettings(currentUser.user);
    var intervalDropdown = document.getElementById("refreshInterval");
    var checkbox = document.getElementById("dabox");
    var autobook = false;
    if (checkbox.checked) {
      autobook = true;
    } else {
      autobook = false;
    }
      const refreshInterval =
      1000 /
      parseFloat(intervalDropdown.options[intervalDropdown.selectedIndex].value);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { start: { refreshInterval: refreshInterval, autobook: autobook } },
        function (response) {
          console.log(response);
          window.close();
        }
      );
    });
  }; 
});

