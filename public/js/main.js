const _checkoutListBtn = document.querySelector('#header-customer-navigation-cart-btn');
const _orderList = document.querySelector('#order-list-container');
const _scrollToTopBtn = document.querySelector("#scroll-to-top-btn");
const _openOrderListBtn = document.querySelector("#show-order-list-btn");
const _scrollToTopBtnTooltip = document.querySelector("#scroll-top-btn-tooltip");
const _openOrderListBtnTooltip = document.querySelector('#order-list-btn-tooltip');

let accessToken;

fetch('http://localhost:4000/api/auth/login',{
  method:'POST',
  headers:{
    'Content-Type':'application/json'
  },
  body:JSON.stringify({
    'email':'khoip2k3@gmail.com',
    'password':'123456'
  })
})
.then(response=>response.headers)
.then(headers=>{
  accessToken = headers.get('Authorization')
  fetch('http://localhost:4000/api/auth/verify',{
    method:'POST',
    headers:{
      'Authorization':`Bearer ${accessToken}`
    }
  })
  .then(response=>response.json())
  // .then(result=>{window.location.search = `uid=${result.user.visible_id}`})
  .catch(err=>{console.log(err)});
})
.catch(err=>{
  console.log(err)
})

_scrollToTopBtn.addEventListener('mouseover',()=>{
  _scrollToTopBtnTooltip.classList.add("display-tooltip");
  _scrollToTopBtnTooltip.classList.remove("hide-tooltip");
})

_scrollToTopBtn.addEventListener('mouseleave',()=>{
  _scrollToTopBtnTooltip.classList.remove("display-tooltip");
  _scrollToTopBtnTooltip.classList.add("hide-tooltip");
})

_openOrderListBtn.addEventListener('mouseover',()=>{
  _openOrderListBtnTooltip.classList.add("display-tooltip");
  _openOrderListBtnTooltip.classList.remove("hide-tooltip");
})

_openOrderListBtn.addEventListener('mouseleave',()=>{
  _openOrderListBtnTooltip.classList.remove("display-tooltip");
  _openOrderListBtnTooltip.classList.add("hide-tooltip");
})

_checkoutListBtn.addEventListener('click',()=>{
  _orderList.style.display = 'unset';
  _orderList.classList.remove("hide-order-list");
  _orderList.classList.add("show-order-list");
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

