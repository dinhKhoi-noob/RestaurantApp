$("#slideshow > div:gt(0)").hide();

setInterval(function() { 
  $('#slideshow > div:first')
  .fadeOut(1500)
  .next()
  .fadeIn(1500)
  .end()
  .appendTo('#slideshow');
}, 5000);