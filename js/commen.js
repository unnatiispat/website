// JavaScript Document
$(document).ready(function() { 
  $("#owl-demo").owlCarousel({

      navigation : true,
	   pagination : false, // Show next and prev buttons
      slideSpeed :2000,
      paginationSpeed :900,
      singleItem:true,
	  autoPlay :3000
 
  });

});

$(document).ready(function() { 
  $("#owl-demo1").owlCarousel({

      navigation : true,
	   pagination : false, // Show next and prev buttons
      slideSpeed :2000,
      paginationSpeed :900,
      singleItem:true,
	  autoPlay : 5000
 
  });

});
$(document).ready(function() { 
  $("#owl-demo2").owlCarousel({

      navigation : true,
	   pagination : false, // Show next and prev buttons
      slideSpeed :2000,
      paginationSpeed :900,
      singleItem:true,
	  autoPlay : 5000
 
  });

});

$(document).ready(function() { 
  $("#owl-demo3").owlCarousel({

      navigation : true,
	   pagination : false, // Show next and prev buttons
      slideSpeed :2000,
      paginationSpeed :900,
      singleItem:true,
	  autoPlay : 5000
 
  });

});


 
 
 $(document).ready(function(){
    $(".toggle").click(function(){
        $("#panel").slideToggle("slow");
    });
});

 
 
$(document).ready(function(){
	
	//Check to see if the window is top if not then display button
	$(window).scroll(function(){
		if ($(this).scrollTop() > 100) {
			$('.scrollToTop').fadeIn();
		} else {
			$('.scrollToTop').fadeOut();
		}
	});
	
	//Click event to scroll to top
	$('.scrollToTop').click(function(){
		$('html, body').animate({scrollTop : 0},800);
		return false;
	});
	
});