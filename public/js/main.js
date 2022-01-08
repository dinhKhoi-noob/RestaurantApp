const checkoutListBtn = document.querySelector('#header-customer-navigation-cart-btn');
const orderList = document.querySelector('#order-list-container');
const scrollToTopBtn = document.querySelector("#scroll-to-top-btn");
const openOrderListBtn = document.querySelector("#show-order-list-btn");
const scrollToTopBtnTooltip = document.querySelector("#scroll-top-btn-tooltip");
const openOrderListBtnTooltip = document.querySelector('#order-list-btn-tooltip');

const setAuthCookie = (uid) => {
  fetch(`http://localhost:4000/api/auth/${uid}`)
  .then((response)=>response.json())
  .then(result=>{
    if(result.success)
    {
      if(result.user.is_expired === 1){
        showToast("User is not existed");
        return;
      }
      const currentTime = new Date(Date.now());
      const expireDate = new Date(currentTime.setHours(currentTime.getHours() + 1)).toUTCString();
      localStorage.setItem('user',JSON.stringify(result.user));
      document.cookie = `auth=${uid}; expires=${expireDate}; path=/page`;
      return;
    }
    showToast("User is not existed");
    setTimeout(()=>{
      window.location.search = "";
    },3000);
  })
  .catch(err=>{
    showToast("User is not existed");
    setTimeout(()=>{
      window.location.search = "";
    },3000);
  })
}

const checkLoggedUser = () =>{
  const authCookie = document.cookie.includes('auth=');
  const urlSearchParams = new URLSearchParams(window.location.search);
  const userId = urlSearchParams.get('uid');
  if(!authCookie){
    setExpiredCookie(1,userId);
  }
  if(userId && !authCookie){
    setAuthCookie(userId);
  }
}

scrollToTopBtn.addEventListener('mouseover',()=>{
  scrollToTopBtnTooltip.classList.add("display-tooltip");
  scrollToTopBtnTooltip.classList.remove("hide-tooltip");
})

scrollToTopBtn.addEventListener('mouseleave',()=>{
  scrollToTopBtnTooltip.classList.remove("display-tooltip");
  scrollToTopBtnTooltip.classList.add("hide-tooltip");
})

openOrderListBtn.addEventListener('mouseover',()=>{
  openOrderListBtnTooltip.classList.add("display-tooltip");
  openOrderListBtnTooltip.classList.remove("hide-tooltip");
})

openOrderListBtn.addEventListener('mouseleave',()=>{
  openOrderListBtnTooltip.classList.remove("display-tooltip");
  openOrderListBtnTooltip.classList.add("hide-tooltip");
})

checkoutListBtn.addEventListener('click',()=>{
  orderList.style.display = 'unset';
  orderList.classList.remove("hide-order-list");
  orderList.classList.add("show-order-list");
})


$( "#datepicker" ).datepicker({
  beforeShow: function (textbox, instance) {
    var txtBoxOffset = $(this).offset();
    var top = txtBoxOffset.top;
    var left = txtBoxOffset.left;
    console.log('top: ' + top + 'left: ' + left);
            setTimeout(function () {
                instance.dpDiv.css({
                    top: top+65,
                    left: left-5
            });
        }, 0);

      },
  // altField: "#datepicker-input",
  // altFormat: "yy-mm-dd",
  showButtonPanel: true,
  dateFormat: "yy-mm-dd",
  changeMonth: true,
  changeYear: true,
  yearRange: "c:c+1",
  dayNamesMin : [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sar" ]
  // defaultDate: +1,
});
$("#discount-slideshow > div:gt(0)").hide();

setInterval(function() { 
  $('#discount-slideshow > div:first')
  .fadeOut(1500)
  .next()
  .fadeIn(1500)
  .end()
  .appendTo('#discount-slideshow');
}, 5000);

const categories = document.querySelectorAll('.category-list');
categories.forEach(category=>{
  category.addEventListener('change',()=>{
    console.log(category.value)
    window.location.href = category.value;
  })
})
localStorage.setItem('Hello','World');
$(window).scroll(function() {

  //After scrolling 600px from the top...
  if ( $(window).scrollTop() >= 600 ) {
    $('#navigation-bar-container').addClass('navigation-slide-in');
    $('#navigation-bar-container').removeClass('navigation-slide-out');
    $('.order-list-btn-section').removeClass('hide-btn');
    $('.order-list-btn-section').addClass('show-btn');
  } else {
    $('#navigation-bar-container').removeClass('navigation-slide-in');
    $('#navigation-bar-container').addClass('navigation-slide-out');
    $('.order-list-btn-section').removeClass('show-btn');
    $('.order-list-btn-section').addClass('hide-btn');
  }
});

checkLoggedUser();