const { response } = require("express");

const registerEmailInput = document.querySelector('#register-username');
const registerUsernameInput = document.querySelector('#register-username');
const registerPasswordInput = document.querySelector('#register-password');
const registerConfirmPasswordInput = document.querySelector('#register-confirm-password');
const loginEmailInput = document.querySelector('#login-email');
const loginPasswordInput = document.querySelector('#login-password');
const confirmPasswordEyeToggle = document.querySelector('#confirm-password-toggle');
const passwordEyeToggle = document.querySelector('#password-toggle');
const loginPasswordEyeToggle = document.querySelector('#login-password-toggle');
const navigateToLoginSectionBtn = document.querySelector('#navigate-to-login-btn');
const navigateToRegisterSectionBtn = document.querySelector('#navigate-to-register-btn');
const registerSubmit = document.querySelector('#register-submit-form');
const loginSubmit = document.querySelector('#login-submit-form');
const loginSection = document.querySelector('#login-section');
const registerSection = document.querySelector('#register-section');
const banner = document.querySelector('#login-section-banner');

let confirmPasswordText;

const newUser = {
    username:"",
    email:"",
    password:"",
}

const loginUser = {
    email:"",
    password:""
}

const showToast = (content) => {
    const notificationToastContainer = document.querySelector('#notification-toast-container');
    const notificationToastContent = document.querySelector('#notification-toast-content');
    notificationToastContent.innerHTML = content;
    notificationToastContainer.classList.remove('toast-slide-out');
    notificationToastContainer.classList.add('toast-slide-in','width-240');
    setTimeout(()=>{
        notificationToastContainer.classList.remove('toast-slide-in','width-240');
        notificationToastContainer.classList.add('toast-slide-out');
        notificationToastContainer.style.visibility = 'hidden !important';
    },3000)
}

loginEmailInput.addEventListener('keyup',(event)=>{
    loginUser.email = event.target.value;
})

loginPasswordInput.addEventListener('keyup',(event)=>{
    if(loginPasswordInput.value.length > 0){
        loginPasswordEyeToggle.style.visibility = 'visible';
    }
    else{
        loginPasswordEyeToggle.style.visibility = 'hidden';
    }
    loginUser.password = event.target.value;
})

registerEmailInput.addEventListener('keyup',(event)=>{
    newUser.email = event.target.value;
})

registerUsernameInput.addEventListener('keyup',(event)=>{
    newUser.username = event.target.value;
})

registerPasswordInput.addEventListener('keyup',(event)=>{
    if(registerPasswordInput.value.length > 0){
        passwordEyeToggle.style.visibility = 'visible';
    }
    else{
        passwordEyeToggle.style.visibility = 'hidden';
    }
    newUser.password = event.target.value;
})

registerConfirmPasswordInput.addEventListener('keyup',(event)=>{
    if(registerConfirmPasswordInput.value.length > 0){
        confirmPasswordEyeToggle.style.visibility = 'visible';
    }
    else{
        confirmPasswordEyeToggle.style.visibility = 'hidden';
    }
    confirmPasswordText = event.target.value
})

passwordEyeToggle.addEventListener('mouseover',()=>{
    passwordEyeToggle.classList.remove('fa-eye-slash');
    passwordEyeToggle.classList.add('fa-eye');
    registerPasswordInput.type = "text";
})

passwordEyeToggle.addEventListener('mouseleave',()=>{
    passwordEyeToggle.classList.remove('fa-eye');
    passwordEyeToggle.classList.add('fa-eye-slash');
    registerPasswordInput.type = "password";
})

confirmPasswordEyeToggle.addEventListener('mouseover',()=>{
    confirmPasswordEyeToggle.classList.remove('fa-eye-slash');
    confirmPasswordEyeToggle.classList.add('fa-eye');
    registerConfirmPasswordInput.type = 'text';
})

confirmPasswordEyeToggle.addEventListener('mouseleave',()=>{
    confirmPasswordEyeToggle.classList.remove('fa-eye');
    confirmPasswordEyeToggle.classList.add('fa-eye-slash');
    registerConfirmPasswordInput.type = 'password';
})

loginPasswordEyeToggle.addEventListener('mouseover',()=>{
    loginPasswordEyeToggle.classList.remove('fa-eye-slash');
    loginPasswordEyeToggle.classList.add('fa-eye');
    loginPasswordInput.type = "text";
})

loginPasswordEyeToggle.addEventListener('mouseleave',()=>{
    loginPasswordEyeToggle.classList.remove('fa-eye');
    loginPasswordEyeToggle.classList.add('fa-eye-slash');
    loginPasswordInput.type = "password";
})

navigateToLoginSectionBtn.addEventListener('click',()=>{
    registerSection.classList.remove('register-content-slide-in');
    registerSection.classList.add('register-content-slide-out');
    banner.classList.remove('register-thumbnail-show');
    banner.classList.add('thumbnail-hide');
    setTimeout(()=>{
        banner.style.backgroundImage = "url('/images/thumbnails/right-side-thumbnail.jpg')";
        registerSection.style.display = 'none';
        banner.classList.remove('thumbnail-hide');
        banner.classList.add('login-thumbnail-show');
        loginSection.classList.remove('login-content-slide-out');
        loginSection.classList.add('login-content-slide-in');
    },1000)
})

navigateToRegisterSectionBtn.addEventListener('click',()=>{
    loginSection.classList.remove('login-content-slide-in');
    loginSection.classList.add('login-content-slide-out');
    banner.classList.remove('login-thumbnail-show');
    banner.classList.add('thumbnail-hide');
    setTimeout(()=>{
        banner.style.backgroundImage = "url('/images/thumbnails/register-thumbnail.jpg')";
        loginSection.style.display = 'none';
        banner.classList.remove('thumbnail-hide');
        banner.classList.add('register-thumbnail-show');
        registerSection.classList.remove('register-content-slide-out');
        registerSection.classList.add('register-content-slide-in');
    },1000)
})

loginSubmit.addEventListener('submit',(event)=>{
    event.preventDefault();
    const loginEmailExclamation = document.querySelector('#login-email-exclamation');
    if(loginUser.email === "" || !loginUser.email){
        loginEmailExclamation.style.visibility = 'visible'
        loginEmailInput.style.border = '1px solid #ed3b3b';
        loginEmailInput.style.color = '#ed3b3b';
        showToast('Please enter all required field !');
        return;
    }
    else{
        loginEmailExclamation.style.visibility = 'hidden';
        loginEmailInput.style.border = '1px solid black';
        loginEmailInput.style.color = 'black';
    }
    if(loginUser.password === "" || !loginUser.password){
        loginPasswordInput.style.border = '1px solid #ed3b3b';
        loginPasswordInput.style.color = '#ed3b3b';
        showToast('Please enter all required field !');
        return;
    }
    else{
        loginPasswordInput.style.border = '1px solid black';
        loginPasswordInput.style.color = 'black';
    }
    fetch('http://localhost:4000/api/auth/login',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(loginUser)
    })
    .then(response=>{
        return{
            headers: response.headers,
            status: response.status
        }
    })
    .then(content=>{
        if(content.status === 201){
            
        }
        accessToken = content.headers.get('Authorization')
        fetch('http://localhost:4000/api/auth/verify',{
            method:'POST',
            headers:{
            'Authorization':`Bearer ${accessToken}`
            }
        })
        .then(response=>response.json())
        .then(result=>{window.location.search = `uid=${result.user.visible_id}`})
        .catch(err=>{
            console.log(err)
        });
    })
    .catch(err=>{
        console.log(err)
    })
})

registerSection.addEventListener('submit',(event)=>{
    event.preventDefault();
})
