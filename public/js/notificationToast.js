const showToast = (content,time) => {
    const notificationToastContainer = document.querySelector('#notification-toast-container');
    const notificationToastContent = document.querySelector('#notification-toast-content');
    const notificationToastCloseBtn = document.querySelector('#notification-toast-close-btn');
    notificationToastContent.innerHTML = content;
    notificationToastContainer.classList.add('toast-slide-in','width-240');
    notificationToastContainer.classList.remove('toast-slide-out');
    setTimeout(()=>{
        notificationToastContainer.classList.add('toast-slide-out');
        setTimeout(()=>{
            notificationToastContainer.classList.remove('toast-slide-in','width-240');
            notificationToastContainer.style.visibility = 'hidden !important';
        },1000)
    },time?time:3000);
    notificationToastCloseBtn.addEventListener('click',()=>{
        notificationToastContainer.classList.add('toast-slide-out');
        setTimeout(()=>{
            notificationToastContainer.classList.remove('toast-slide-in','width-240');
            notificationToastContainer.style.visibility = 'hidden !important';
        },1000)
    })
}