import * as firebase from './firebase.js';

let loginBtn = document.getElementById('loginBtn');
let signUpBtn = document.getElementById('signUpBtn');
let resetBtn = document.getElementById('resetBtn');
var emailField = document.getElementById('email');
var passwordField = document.getElementById('password');
let signUpSwitch = document.getElementById('signUpSwitch');
let forgotSwitch = document.getElementById('forgotSwitch')
let text = document.getElementById('headingTxt');
let pswdlbl = document.getElementById('pswd-lbl'); 

document.addEventListener('DOMContentLoaded', ()=> {
  try{
    var currentUser = JSON.parse(localStorage.getItem('user'));
    if(currentUser.user.uid){
      window.location.href = 'popup.html';
    }
  }
  catch(err) {
    console.log(err);
  }
 
  loginBtn.addEventListener('click', ()=> {
    firebase.default.auth()
    .signInWithEmailAndPassword(emailField.value, passwordField.value)
    .then((user)=> {
      // console.log(user)
      localStorage.setItem('user', JSON.stringify(user))
      window.location.href='popup.html';
    })
    .catch(err => {
    M.toast({html: err, displayLength: 2000})
    })
  });
  signUpBtn.addEventListener('click', ()=> {
    firebase.default
    .auth()
    .createUserWithEmailAndPassword(emailField.value, passwordField.value)
    .then((res)=> {
      M.toast({html: 'Account Created Succesfully', displayLength: 2000})
    })
    .catch(err => {
      M.toast({html: err, displayLength: 2500})
    })
  });

  signUpSwitch.addEventListener('click', ()=> {
    text.innerText = 'Sign Up';
    loginBtn.classList.add('hide');
    signUpBtn.classList.remove('hide');
    signUpSwitch.classList.add('hide');
    passwordField.classList.remove('hide');
    resetBtn.classList.add('hide');
    loginSwitch.classList.remove('hide');
    pswdlbl.classList.remove('hide');
  });

  loginSwitch.addEventListener('click', ()=> {
    text.innerText = 'Login';
    signUpBtn.classList.add('hide');
    loginBtn.classList.remove('hide');
    loginSwitch.classList.add('hide');
    passwordField.classList.remove('hide');
    resetBtn.classList.add('hide');
    signUpSwitch.classList.remove('hide');
    pswdlbl.classList.remove('hide');
  });

  resetBtn.addEventListener('click', ()=> {  
    firebase.default
    .auth()
    .sendPasswordResetEmail(emailField.value)
    .then(()=>{
      M.toast({html: 'Reset Link Sent'})
    })
    .catch(err => {
      M.toast({html: err, displayLength: 2000})
    });
  })

  forgotSwitch.addEventListener('click', ()=> {
    text.innerText = 'Reset Password'
    passwordField.classList.add('hide');
    loginBtn.classList.add('hide');
    signUpBtn.classList.add('hide');
    resetBtn.classList.remove('hide');
    pswdlbl.classList.add('hide');
  });
});
