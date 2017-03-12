onlineClothingStoreApp.controller('SliderCtrl', ['$scope', function ($scope) {
	//Slider
	if (navigator.msMaxTouchPoints) {
	  $('#slider').addClass('ms-touch');
	}

	if (navigator.msMaxTouchPoints) {
	  $('#slider').addClass('ms-touch');

	  // Listed for the scroll event and move the image with translate.
	  $('#slider').on('scroll', function() {
	    $('.slide-image').css('transform','translate3d(-' + (100-$(this).scrollLeft()/6) + 'px,0,0)');
	  });
	}
	else {
	  $scope.slider = {

	    // The elements.
	    el: {
	      slider: $("#slider"),
	      holder: $(".holder"),
	      imgSlide: $(".slide-image")
	    },

	    // The stuff that makes the slider work.
	    slideWidth: $('#slider').width(), // Calculate the slider width.
	    // Define these as global variables so we can use them across the entire script.
	    touchstartx: undefined,
	    touchmovex: undefined,
	    movex: undefined,
	    index: 0,
	    longTouch: undefined,

	    // continued
	    init: function() {
	      this.bindUIEvents();
	    },

	    bindUIEvents: function() {
		    this.el.holder.on("touchstart", function(event) {
		        $scope.slider.start(event);
		    });

		    this.el.holder.on("touchmove", function(event) {
		        $scope.slider.move(event);
		    });

		    this.el.holder.on("touchend", function(event) {
		        $scope.slider.end(event);
		    });
	    },

	    start: function(event){
	    		this.longTouch = false;
				setTimeout(function() {
				  // Since the root of setTimout is window we can’t reference this. That’s why this variable says window.slider in front of it.
				  $scope.slider.longTouch = true;
				}, 250);
				// Get the original touch position.
				this.touchstartx =  event.originalEvent.touches[0].pageX;
				$('.animate').removeClass('animate');
	    },

	    move: function(event){

		        // Continuously return touch position.
				this.touchmovex =  event.originalEvent.touches[0].pageX;
				// Calculate distance to translate holder.
				this.movex = this.index*this.slideWidth + (this.touchstartx - this.touchmovex);
				// Defines the speed the images should move at.
				var panx = this.movex/6;
				if (this.movex < 600 && $('.holder').width()>this.slideWidth) { // Makes the holder stop moving when there is no more content.
				  this.el.holder.css('transform','translate3d(-' + this.movex + 'px,0,0)');
				}
				if (panx < 0) { // Corrects an edge-case problem where the background image moves without the container moving.
				  this.el.imgSlide.css('transform','translate3d(-' + panx + 'px,0,0)');
				 }
	    },
	    end: function(event){
	    	// Calculate the distance swiped.
				var absMove = Math.abs(this.index*this.slideWidth - this.movex);
				// Calculate the index. All other calculations are based on the index.
				if (absMove > this.slideWidth/4 || this.longTouch === false && $('.holder').width()>this.slideWidth) {
				  if (this.movex > this.index*this.slideWidth && this.index < 2) {
				    this.index++;
				  } else if (this.movex < this.index*this.slideWidth && this.index > 0) {
				    this.index--;
				  }
				}

				// Move and animate the elements.
				if($('.holder').width()>this.slideWidth){
					console.log("a");
					this.el.holder.addClass('animate').css('transform', 'translate3d(-' + this.index*this.slideWidth + 'px,0,0)');
					this.el.imgSlide.addClass('animate').css('transform', 'translate3d(-' + 50-this.index*50 + 'px,0,0)');
					$(".g_thumbnail>img").css("border", "0px solid #00c7ff");
				    $(".g_thumbnail").find('[data-id="'+this.index+'"]').css("border", "2px solid #00c7ff");
				}
	    }
	  };
	  $scope.slider.init();

	}

}]);