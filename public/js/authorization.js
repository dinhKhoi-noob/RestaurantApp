const authCookie = document.cookie.includes('auth=');
if(!authCookie){
    showToast("You are not logged in now, or your login session is expired!");
}