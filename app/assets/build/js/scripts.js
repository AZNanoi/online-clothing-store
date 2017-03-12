// We setup the main Angular model that we will use for our application
// Good Angular practice is to organize your code in different modules, 
// for instance, one module per feature. However, since our App is
// simple we will keep all the code in the "dinnerPlanner" module
//
// Notice the 'ngRoute' and 'ngResource' in the module declaration. Those are some of the core Angular
// modules we are going to use in this app. If you check the index.html you will
// also see that we included separate JavaScript files for these modules. Angular
// has other core modules that you might want to use and explore when you go deeper
// into developing Angular applications. For this lab, these two will suffice.
var onlineClothingStoreApp = angular.module('onlineClothingStore', ['ngRoute','ngResource','ngCookies']);

// Here we configure our application module and more specifically our $routeProvider. 
// Route provider is used to tell angular to load a specific partial (view) for an individual
// specific address that is provided in the browser. This enables us to change the browser address
// even if we are not reloading the page. We can also use back and forward button to navigate between
// our screens. The paths that you use in the conditions of $routeProvider will be shown in the address
// bar after the # sign. So, for instance, the home path will be 'http://localhost:8000/#/home'.
//
// In index.html you will notice the <div ng-view></div> tag. This is where the specific view sill be
// loaded. For instance when you go to http://localhost:8000/, since your path does not match any
// of the when conditions, the otherwise condition is triggered and tells the app to redirect to '/home'.
// The '/home' condition then loads the 'partials/home.html'. 
//
// Apart from specifying the partial HTML that needs to be loaded with your app, you can also specify which
// controller should be responsible for that view. In the controller you will setup the initial data or 
// access the data from the model and create the methods that you will link to events. Remember, controllers 
// can be nested, so you can have one controller responsible for the whole view, but then another one for 
// some sub part of the view. In such way you can reuse your controller on different parts of the view that 
// might have similar logic.
//
// In some cases we want the path to be variable (e.g. contain the dish id). To define the variable part of 
// the path we use the ":" sign. For instance, our '/dish/:dishId' will be triggered when we access 
// 'http://localhost:8000/#/dish/12345'. The 12345 value will be stored in a dishId parameter, which we can
// then access through $routeParams service. More information on this in the dishCtrl.js 
onlineClothingStoreApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider.
    	when('/', {
        templateUrl: 'assets/partials/home.html',
        controller: 'HomeCtrl'
      }).
      when('/home', {
        templateUrl: 'assets/partials/home.html',
        controller: 'HomeCtrl'
      }).
      when('/item/:itemId', {
        templateUrl: 'assets/partials/item.html',
        controller: 'ItemCtrl'
      }).
      when('/login', {
        templateUrl: 'assets/partials/login.html',
        controller: 'LogInCtrl'
      }).
      when('/profile', {
        templateUrl: 'assets/partials/profile.html',
        controller: 'ProfileCtrl'
      }).
      when('/cart', {
        templateUrl: 'assets/partials/cart.html',
        controller: 'CartCtrl'
      }).
      when('/receipt/:orderNr', {
        templateUrl: 'assets/partials/receipt.html',
        controller: 'ReceiptCtrl'
      }).
      when('/edit-account', {
        templateUrl: 'assets/partials/edit-account.html',
        controller: 'EditAccountCtrl'
      }).
      when('/register', {
        templateUrl: 'assets/partials/register.html',
        controller: 'RegisterCtrl'
      }).
      when('/help-contact', {
        templateUrl: 'assets/partials/help-contact.html',
        controller: 'helpContactCtrl'
      }).
      when('/reset-password', {
        templateUrl: 'assets/partials/reset-password.html',
        controller: 'ResetPasswordCtrl'
      }).
      when('/change-password', {
        templateUrl: 'assets/partials/change-password.html',
        controller: 'ChangePasswordCtrl'
      }).
      when('/search', {
        templateUrl: 'assets/partials/search.html',
        controller: 'SearchCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

onlineClothingStoreApp.filter("shorten", function(){
  return function(string){
    var newString;
    if(string.length>18){
      newString = string.substr(0,18)+"...";
    }else{
      newString = string;
    }
    return newString;
  };
});

$(document).mouseup(function (e){
    var container = $("#dropdownMenu");
    var icon = $("#dMenu-icon");

    // if the target of the click isn't the container...
    if (!icon.is(e.target) && !container.is(e.target)) // ... nor a descendant of the container
    {
        container.hide();
        $(icon).css("background-image", "url(assets/images/menu-icon.png)");
    }

    var s_container = $("#search-input-frame");
    var s_input = $("#search_input>input");

    // if the target of the click isn't the container...
    if (!s_input.is(e.target) && !s_container.is(e.target)) // ... nor a descendant of the container
    {
      s_container.hide();
    }
});
onlineClothingStoreApp.factory('Service', ['$q', '$resource', '$cookieStore', function ($q, $resource, $cookieStore) {
	
	// Create a reference to the Firebase database
	this.dataRef = new Firebase('https://clothing-store.firebaseio.com/');
	var usersRef = this.dataRef.child("users");
	this.userName = '';
	var userID = 'null';
	this.authData = this.dataRef.getAuth();
	if (this.authData) {
		userID = this.authData.uid;
		//console.log("User " + userID + " is logged in with " + this.authData.provider);
	}else {
	  	//console.log("User is logged out");
	}

	//Reset user password
	this.resetPassword=function(email){
		alert(email);
		this.dataRef.resetPassword({
  			email: email
		}, function(error) {
  		if (error) {
		    switch (error.code) {
		      case "INVALID_USER":
		        console.log("The specified user account does not exist.");
		        break;
		      default:
		        console.log("Error resetting password:", error);
		    }
		  } else {
		    console.log("Password reset email sent successfully!");
		  }
		});
	};

	//Change user password
	this.changePassword=function(oldPassword, newPassword){
		email=this.authData.password.email;
		this.dataRef.changePassword({
		 	email: email,
		 	oldPassword: oldPassword,
		 	newPassword: newPassword
		}, function(error) {
		  if (error) {
		    switch (error.code) {
		      case "INVALID_PASSWORD":
		        console.log("The specified user account password is incorrect.");
		        break;
		      case "INVALID_USER":
		        console.log("The specified user account does not exist.");
		        break;
		      default:
		        console.log("Error changing password:", error);
		    }
		  } else {
		    console.log("User password changed successfully!");
		  }
		});
	};


	// Retrieve data from given address from firebase database
	function retrieveData(address) {
		var result = $q.defer();
		var ref = usersRef.child(address);
		ref.once("value", function(responce) {
			var data = responce.val();
			result.resolve(data);
		});
		return result;
	}

	if("undefined" === typeof($cookieStore.get("items"))){
		$cookieStore.put("items", []);
	}

	// Save orders
	this.saveOrders = function(data) {
		var orderRef = usersRef.child(userID+"/orders/"+data.orderNr);
		orderRef.set(data);
	};

	// Retrieve data for given order number
	this.getOrder = function(id) {
		return retrieveData(userID+"/orders/"+id);
	};

	// Generate a GUID for a new user
	this.generateGUID = function() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x1000).toString(16).substring(1);
		}
		return s4()+s4()+s4()+s4();
	};

	// Log in user
	this.logIn = function(loginData, callback){
		this.dataRef.authWithPassword(loginData, function(error, authData){
		    if (error) {
		        console.log("Login Failed!", error);
		        callback("deny");
		    } else {
		        console.log("Authenticated successfully with payload:", authData);
		        this.authData = authData;
		        userID = authData.uid;
		        callback("success");
		    }
		},{
			remember: "sessionOnly"
		});
	};

	// Log out user
	this.logOut = function() {
		this.dataRef.unauth();
	};

	// Store user object under "users" into Firebase database
	this.createProfile = function(authentication, data, callback) {
		var self = this;
		this.dataRef.createUser({
			email: authentication.email,
			password: authentication.password
		}, function(error, userData){
			if (error){
				console.log("Error creating user:", error);
				callback(error);
			}else {
			    console.log("Successfully created user account with uid:", userData.uid);
			    userID = userData.uid;
			    self.logIn(authentication, function(authData){
			    	if(authData == "success"){
			    		usersRef.child(userData.uid).set(data);
			    		callback("success");
			    	}
			    });
			  
			}
		});
	};

	// Retrieve profile's data for a given id
	this.getProfile = function() {
		return retrieveData(userID);
	};

	// Update profile
	this.updateProfile = function(data) {
		console.log(userID);
		var user = usersRef.child(userID);
		user.update(data);
	};
	this.addToCart = function(item){
		items=$cookieStore.get("items");
		items.push(item);
		$cookieStore.put("items", items);
	};

	this.deleteFromCart =function(item){
		items=$cookieStore.get("items");
		for (var key in items){
			if (item.Id == items[key].Id && item.size == items[key].size){
				items.splice(key,1);
			}
		}
		$cookieStore.put("items", items);
	};

	this.emptyCart = function(){
		$cookieStore.put("items", []);
	};

	this.getCart=function(){
		return $cookieStore.get("items");
	};

	this.calTotalCost=function(items){
		var totalCost = 0;
		for(var key in items){
			totalCost = totalCost + parseInt(items[key].price)*parseInt(items[key].amount);
		}
		return totalCost;
	};
	//this.getCategory=function(){
	//	return {items:[{'Image':'https://image.spreadshirtmedia.net/image-server/v1/products/118898654/views/1,width=378,height=378,appearanceId=39,version=1447077209/Ansikte-smiley-30-roliga-serier-T-shirts.png', 'Title':'Orange T-Shirt', 'Price':'100 SEK', 'Id':'1'},{'Image':'http://pngimg.com/upload/tshirt_PNG5434.png', 'Title':'White T-Shirt', 'Price':'50 SEK', 'Id':'2'},{'Image':'https://cdn.qwertee.com/images/mens-black.png', 'Title':'Black T-Shirt', 'Price':'75 SEK', 'Id':'3'}]};
	//};
	// Get data for items of a given category
	this.getItems = $resource('/REST_API/items/index.php', {get:{method:"GET",cache:true}});

	// Get data for an item with a specific id
	this.getItem = $resource('/REST_API/item/index.php', {get:{method:"GET",cache:true}});

	return this;
}]);
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
onlineClothingStoreApp.controller('AppCtrl', ["$scope", function ($scope) {
	var UA = navigator.userAgent;
	if (UA.match(/OPR|iPhone|Android|Opera|Symbian|Motorola|Nokia|Siemens|Samsung|Ericsson|LG|NEC|SEC|MIDP|Windows CE/i))
	{
		$scope.style_css = "style_mobile.css";
		$scope.mobile_device = true;
	}else{
		$scope.style_css = "style.css";
		$scope.mobile_device = false;
	}

	$scope.$back = function() {
		window.history.back();
	};
}]);
onlineClothingStoreApp.controller('CartCtrl', ['$scope', 'Service', '$location', function ($scope, Service, $location) {
	var items = Service.getCart();
	var orderNr = Service.generateGUID();
	var d = new Date();
	var h = d.getHours();
	var m = d.getMinutes();
	var s = d.getSeconds();
	if(h<10){
		h =  "0" + h;
	}
	if(m<10){
		m =  "0" + m;
	}
	if(s<10){
		s =  "0" + s;
	}
	var date = d.getDate()+"-"+d.getMonth()+'-'+d.getFullYear()+'T'+h+':'+m+':'+s;
	$scope.cart = {'orderNr': orderNr, 'date': date, 'shipped': 'Ongoing', 'items': items};

	$scope.saveOrders = function(event) {
		event.preventDefault();
		if (Service.authData){
			Service.saveOrders($scope.cart);
			Service.emptyCart();
			$location.path('/receipt/'+orderNr);
		}else{
			$location.path('/login');
		}
		
	};

	$scope.removeItem = function(event) {
		var item = event.target.dataset.item;
		var itemObj = JSON.parse(item);
		Service.deleteFromCart(itemObj);
		$scope.cart.items = Service.getCart();
		$scope.getTotalCost();
	};

	$scope.getTotalCost = function(){
		var items = Service.getCart();
		return Service.calTotalCost(items);
	};
}]);
onlineClothingStoreApp.controller('ChangePasswordCtrl', ['$scope', 'Service', function ($scope, Service) {
	//change the password of the user
	$scope.not_changed=true;
	$scope.changed=false;
	$scope.statusDisplay = false;
	$scope.changePassword=function(myForm){
		console.log(myForm.$valid);
	  if(!myForm.$valid){
		$scope.statusDisplay = true;
		$scope.status = "Invalid data input!";
	  }else if($scope.oldPassword !== $scope.newPassword){
		$scope.statusDisplay = true;
		$scope.status = "The passwords are not matched!";
	  }else{
		$scope.statusDisplay = false;
		Service.changePassword($scope.oldPassword, $scope.newPassword);
		$scope.changed=true;
		$scope.not_changed=false;
	  }

	};

 }]);
onlineClothingStoreApp.controller('EditAccountCtrl', ['$scope', 'Service', '$controller', '$location', function ($scope, Service, $controller, $location) {
	$controller('ProfileCtrl', {$scope: $scope});
	$scope.noSuccesed= false;

	$scope.updateProfile = function(myForm) {
		if(myForm.$valid){
			$scope.noSuccesed= false;
			var pDetails = {fname: $scope.fname, lname: $scope.lname, mobile: $scope.mobile};
			var address = {co: $scope.co, street: $scope.street, postalCode: $scope.postalCode, city: $scope.city};
			var data = {personalDetails: pDetails, shippingAddress: address};
			Service.updateProfile(data);
			$location.path("/profile");
		}else{
			$scope.noSuccesed= true;
			$scope.message="Incorrect input data!";
		}
		
	};
}]);
onlineClothingStoreApp.controller('helpContactCtrl', ['$scope', '$rootScope', '$location', 'Service', '$cookieStore', '$location', function ($scope, $rootScope, $location, Service, $cookieStore, $location) {
    $rootScope.$on("CallUpdateCategory", function(event, data){
        $scope.updateCategory(data.category,data.e);
    });

    var category;
    $scope.displayedArrows=false;
    var parentScope = $scope.$parent.$parent;

    if(parentScope.mobile_device){
        $(".categories").remove();
    }else if(parentScope.mobile_device === false){
        $(".categories").css("display", "block");
    }

    if("undefined" === typeof($cookieStore.get("categoryName"))){
        category = "Featured";
    }else{
        category = $cookieStore.get("categoryName");
    }

    function toggleSlideShow(category){
        if(category=="Featured"){
            $scope.displayedSlide=true;
        }else{
            $scope.displayedSlide=false;
        }
    }

    function changeBGColor(category){
        var selected = $("ul").find(".selected");
        selected.css("background-color", "rgba(128,128,128,0.6)");
        selected.attr("class", "");
        $("#"+category).css("background-color", "rgba(0,0,0,0.7)");
        $("#"+category).attr("class", "selected");
    }

    toggleSlideShow(category);
    changeBGColor(category);

    $scope.getItems=function(keyword, query){
        $scope.categoryName = query.toUpperCase();
        var sort = '{"'+keyword+'":"'+query+'"}';
        var a = JSON.parse(sort);
        Service.getItems.get(a, function(data){
            if(keyword === "category"){
                $scope.category=data;
            }else{
                $scope.searchResult=data;
            }
        });
    };

    $scope.getSearch=function(query){
        $scope.getItems('keyword',query);
        $cookieStore.put("query", query);
        $location.path("/search");
    };

    $scope.getItems("category", category);

    $scope.updateCategory = function(category, event){
        event.preventDefault();
        toggleSlideShow(category);
        changeBGColor(category);
        if(category !== "Help-contact"){
            $cookieStore.put("categoryName", category);
        }
        $scope.getItems("category", category);
        var path = category.toLowerCase();
        if(parentScope.mobile_device && path === "featured"){
            path = "home";
        }else if(!parentScope.mobile_device && path === "featured"){
            path = "";
        }
        $location.path('/'+path);
    };

    $scope.keyUpFunction = function(query) {
        console.log(query);
        if (query.length>0){
            $scope.getItems("keyword", query);
            $("#search-input-frame").show();
        }
        else if (query===false || query===" "){
            $("#search-input-frame").hide();
        }
    };

    $scope.showArrows = function(){
        $scope.displayedArrows=true;
    };
    $scope.hideArrows = function(){
        $scope.displayedArrows=false;
    };

    Service.getItems.get({"category":"slideshow"}, function(res){
        images = res.data;
    });

    var images, x = -1;

    $scope.displayNextImage = function() {
        x = (x === images.length - 1) ? 0 : x + 1;
        var e = document.getElementById("imgSlideshow");
        if(e !== null){
            e.src = images[x].imageUrl;
        }
    };

    $scope.displayPreviousImage = function() {
        x = (x <= 0) ? images.length - 1 : x - 1;
        document.getElementById("imgSlideshow").src = images[x].imageUrl;
    };

    var nIntervId = setInterval($scope.displayNextImage, 3000);

    $scope.$on('$destroy', function() {
        clearInterval(nIntervId);
    });
}]);
onlineClothingStoreApp.controller('HomeCtrl', ['$scope', '$rootScope', '$location', 'Service', '$cookieStore', '$location', function ($scope, $rootScope, $location, Service, $cookieStore, $location) {
    $rootScope.$on("CallUpdateCategory", function(event, data){
        $scope.updateCategory(data.category,data.e);
    });
    $scope.showSearchResult = false;
    var category;
    $scope.displayedArrows=false;
    var parentScope = $scope.$parent.$parent;

    if(parentScope.mobile_device){
        $(".categories").remove();
    }else if(parentScope.mobile_device === false){
        $(".categories").css("display", "block");
    }

    if("undefined" === typeof($cookieStore.get("categoryName"))){
        category = "Featured";
    }else{
        category = $cookieStore.get("categoryName");
    }

    function toggleSlideShow(category){
        if(category=="Featured"){
            $scope.displayedSlide=true;
        }else{
            $scope.displayedSlide=false;
        }
    }

    function changeBGColor(category){
        var selected = $("ul").find(".selected");
        selected.css("background-color", "rgba(128,128,128,0.6)");
        selected.attr("class", "");
        $("#"+category).css("background-color", "rgba(0,0,0,0.7)");
        $("#"+category).attr("class", "selected");
    }

    window.addEventListener('orientationchange', function() {
        if(window.screen.width > window.screen.height)
        {
            if(window.screen.width<=768){
                $("#home").css("width", "100%");
            }
        }
    }, false);

    toggleSlideShow(category);
    changeBGColor(category);

    $scope.getItems=function(keyword, query){
        $scope.categoryName = query.toUpperCase();
        var sort = '{"'+keyword+'":"'+query+'"}';
        var a = JSON.parse(sort);
        Service.getItems.get(a, function(data){
            if(keyword === "category"){
                $scope.category=data;
            }else{
                $scope.searchResult=data;
            }
            if(data.data.length > 0){
                $scope.showSearchResult = true;
            }else{
                $scope.showSearchResult = false;
            }
        });
    };

    $scope.getSearch=function(query){
        $scope.getItems('keyword',query);
        $cookieStore.put("query", query);
        $location.path("/search");
        $scope.showSearchResult = false;
    };

    $scope.getItems("category", category);

    $scope.updateCategory = function(category, event){
        event.preventDefault();
        toggleSlideShow(category);
        changeBGColor(category);
        if(category !== "Help-contact"){
            $cookieStore.put("categoryName", category);
        }
        $scope.getItems("category", category);
        var path = category.toLowerCase();
        if(parentScope.mobile_device && path === "featured"){
            path = "home";
        }else if(!parentScope.mobile_device && path === "featured"){
            path = "";
        }
        $location.path('/'+path);
    };

    $scope.keyUpFunction = function(query) {
        console.log(query);
        if (query.length>0){
            $scope.getItems("keyword", query);
            $("#search-input-frame").show();
        }
        else if (query===false || query===""){
            $scope.showSearchResult = false;
        }
    };

    $scope.showArrows = function(){
        $scope.displayedArrows=true;
    };
    $scope.hideArrows = function(){
        $scope.displayedArrows=false;
    };

    Service.getItems.get({"category":"slideshow"}, function(res){
        images = res.data;
    });

    var images, x = -1;

    $scope.displayNextImage = function() {
        if(typeof images !== "undefined"){
            x = (x === images.length - 1) ? 0 : x + 1;
            var e = document.getElementById("imgSlideshow");
            if(e !== null){
                e.src = images[x].imageUrl;
            }
        }
    };

    $scope.displayPreviousImage = function() {
        x = (x <= 0) ? images.length - 1 : x - 1;
        document.getElementById("imgSlideshow").src = images[x].imageUrl;
    };

    var nIntervId = setInterval($scope.displayNextImage, 3000);

    $scope.$on('$destroy', function() {
        clearInterval(nIntervId);
    });
}]);
onlineClothingStoreApp.controller('ItemCtrl', ['$scope', '$routeParams', 'Service', '$cookieStore', '$controller', '$q', function ($scope, $routeParams, Service, $cookieStore, $controller, $q) {
	$controller("HomeCtrl", {$scope:$scope});
	$controller("SliderCtrl", {$scope:$scope});
	$scope.childScope = {};
	$scope.amount = 0;
	$scope.statusMessage = "";
	$scope.selectedAmount = 1;
	$scope.addedToCart = false;
	$scope.selectSize = true;
	$scope.oneSize = false;
	$scope.sold_out = false;
	$scope.sold_out_s = false;
	$scope.imagesLength = $q.defer();

	buttonDisabled(true);

	function displayError(){
		$("#statusMessage").css("color", "red");
		if($scope.selectedSize === undefined || $scope.selectedSize === null){
			if(!$scope.oneSize){
				$scope.statusMessage = "Choice a size!";
				return true;
			}
		}

		if($scope.selectedColor === undefined || $scope.selectedColor === null){
			if(!$scope.sold_out_s){
				$scope.statusMessage = "Choice a color!";
				return true;
			}
		}else if($scope.selectedAmount > $scope.amount){
			$scope.statusMessage = "Selected amount exceeds the available amount!";
			return true;
		}
		return false;
	}

	$scope.checkAmount = function() {
		if(displayError()){
			buttonDisabled(true);
		}else{
			$scope.statusMessage = "";
			buttonDisabled(false);
		}
	};

	$scope.addToCart = function() {
		var item = {'Id': itemId, 'name': $scope.item.Name, 'price': $scope.item.Price, 'size': $scope.selectedSize, 'color': $scope.selectedColor,'amount': $scope.selectedAmount};
		Service.addToCart(item);
		$scope.childScope.itemsAmount=Service.getCart().length;
		$scope.statusMessage = "Added to cart";
		$("#statusMessage").css("color", "green");
	};

	$scope.goToHome = function(categoryName) {
		$cookieStore.put("categoryName", categoryName);
	};

	function buttonDisabled(disabled){
		if (disabled){
			$scope.b_disabled=true;
			$(".add_to_cart").css("background-color", "rgba(117,117,117,0.35)");
			$(".add_to_cart").css("cursor", "auto");
		}
		else{
			$scope.b_disabled=false;
			$(".add_to_cart").css("background-color", "rgba(9,199,101,0.75)");
			$(".add_to_cart").css("cursor", "pointer");
		}
	}

	$scope.getColors = function(){
		$scope.selectedColor = null;
		$scope.statusMessage = "";
		var list = [];
		if($scope.selectedSize || $scope.oneSize){
			$(".amount").css("color", "black");
			for (i=0; i < quantities.length; i++){
				if ($scope.selectedSize==quantities[i].Size && $.inArray(quantities[i].Color, list)==-1){
					list.push(quantities[i].Color);
				}else if($scope.oneSize){
					list.push(quantities[i].Color);
				}
			}
			$scope.colors=list;
			if(list.length<1){
				$scope.sold_out = true;
				$scope.amount = 0;
				$(".amount").css("color", "red");
				buttonDisabled(true);
			}else{
				$scope.sold_out = false;
			}
		}else{
			$scope.colors=undefined;
			buttonDisabled(true);
		}
		if(!$scope.oneSize){
			$scope.getAmount();
		}
	};

	$scope.getAmount = function(){
		$scope.statusMessage = "";
		var n = 0;
		for (i=0; i < quantities.length; i++){
			if($scope.selectedSize === undefined || $scope.selectedSize === null){
				n+=parseInt(quantities[i].Quantity);				
			}else if($scope.selectedColor === undefined || $scope.selectedColor === null){
				if($scope.selectedSize==quantities[i].Size){
					n+=parseInt(quantities[i].Quantity);
				}
			}else{
				if ($scope.selectedSize==quantities[i].Size && $scope.selectedColor==quantities[i].Color){
					n=quantities[i].Quantity;
				}else if($scope.oneSize && $scope.selectedColor==quantities[i].Color){
					n=quantities[i].Quantity;
				}
			}		
		}
		$scope.amount=n;
		$scope.checkAmount();
	};

	var quantities;
	var itemId = $routeParams.itemId;
	
	Service.getItem.get({"id":itemId}, function(data){

		$scope.item=data;
		$scope.imagesLength.resolve(data.imageUrls.length);
		quantities = $scope.item.Quantities;
		var totalAmount = 0;
		for (i=0; i < quantities.length; i++){
			totalAmount+=parseInt(quantities[i].Quantity);
		}
		$scope.amount=totalAmount;
		if(data.Category == "Accessories"){
			$scope.selectSize = false;
			$scope.oneSize = true;

			$scope.getColors();
		}else{
			$scope.sizes = ["S", "M", "L"];
		}
		if(quantities.length<1){
			$scope.sold_out = true;
			$scope.sold_out_s = true;
		}
		$scope.getItems("category", $scope.item.Category);
	});
	
	$scope.changeImage = function(e){
		var index = $(e.target).data("id");
		$(".holder").addClass('animate').css('transform', 'translate3d(-' + parseInt($('#slider').width()) * parseInt(index) + 'px,0,0)');
		$(".g_thumbnail>img").css("border", "0px solid #00c7ff");
		$(".g_thumbnail").find('[data-id="'+index+'"]').css("border", "2px solid #00c7ff");
	};
}]);
onlineClothingStoreApp.controller('LogInCtrl', ['$q', '$scope', '$location', 'Service', function ($q, $scope, $location, Service) {
	$scope.status = "";
	$scope.noSuccessed = false;
	$scope.loading = false;

	$scope.init = function(){
		var authData = Service.dataRef.getAuth();
		if (authData) {
			$location.path('/home');
		}
	};
	$scope.init();

	$scope.logIn = function(){
		$scope.loading = true;
		$("#login").fadeTo(500, 0.3);
		var loginData = {email: $scope.email, password: $scope.password};
		Service.logIn(loginData, function(res){
			if (res === 'success') {
				$location.path('/home');
				$scope.$apply();
				$scope.loading = false;
				$scope.noSuccessed = false;
				$("#loading").addClass("ng-hide");
				$("#login").fadeTo(500, 1);
			}else {
				$scope.loading = false;
				$scope.noSuccessed = true;
				$("#loading").addClass("ng-hide");
				$(".response").removeClass("ng-hide");
				$("#login").fadeTo(500, 1);
				$(".response").text("Login Failed! Incorrect email or password!");
			}
		});	
	};
}]);
onlineClothingStoreApp.controller('NavbarCtrl', ['$scope', '$rootScope', 'Service', function ($scope, $rootScope, Service) {
    $scope.updateCategory = function(category, event) {
        $rootScope.$emit("CallUpdateCategory", {"category":category, "e":event});
    };

    $scope.showMenuIcon = false;
    $scope.menuIcon = "images/menu-icon.png";
    $scope.itemsAmount=Service.getCart().length;

    var parentScope = $scope.$parent.$parent;
    parentScope.childScope = $scope;

    window.addEventListener('orientationchange', function() {
        if(window.screen.width > window.screen.height)
        {
            $("#header").css("position", "absolute");
            console.log(window.screen.width);
            if(window.screen.width<=1024){
                $("#menu").css("position", "absolute");
            }
        }else{
            $("#header").css("position", "fixed");
            $("#menu").css("position", "fixed");
        }
    }, false);

    if(parentScope.mobile_device){
        //$scope.showMenuIcon=true;
        $scope.mobile_device = true;
        $(".shopping_cart").css("margin-right", "20px");
    }else{
        $scope.showMenuIcon=false;
        $scope.mobile_device = false;
    }

    function authDataCallback(authData){
        if(authData){
            var profileData = Service.getProfile();
            profileData.promise.then(function(res){
                $scope.full_name = res.personalDetails.fname + ' ' + res.personalDetails.lname;
            });
            $scope.loggedIn=true;
            $scope.showMenuIcon=true;
            $scope.notLoggedIn=false;
            $(".shopping_cart").css("margin-right", "15px");
        }else{
            $scope.full_name = "";
            $scope.loggedIn=false;
            $scope.notLoggedIn=true;
        }
    }

    Service.dataRef.onAuth(authDataCallback);

    $scope.logOut = function(){
        Service.logOut();
        authDataCallback();
        $scope.dMenuDisplayed = false;
        $(".shopping_cart").css("margin-right", "0px");
        $scope.toggleDMenu();
    };

    $scope.toggleDMenu = function(event) {
        var container = $("#dropdownMenu");
        var icon = $("#dMenu-icon");
        if(container.css("display") == "none"){
            container.css("display", "block");
            icon.css("background-image", "url(assets/images/menu-icon-gray.png)");
        }else{
            container.css("display", "none");
            icon.css("background-image", "url(assets/images/menu-icon.png)");
        }
    };
}]);
onlineClothingStoreApp.controller('ProfileCtrl', ['$scope', 'Service', '$location', function ($scope, Service, $location) {

	$scope.init = function(){
		var authData = Service.dataRef.getAuth();
		if (authData) {
			$scope.email = authData.password.email;
		}else{
			$location.path('/home');
		}
	};
	$scope.init();

	var data = Service.getProfile();
	data.promise.then(function(res){
		$scope.full_name = res.personalDetails.fname + ' ' + res.personalDetails.lname;
		$scope.fname = res.personalDetails.fname;
		$scope.lname = res.personalDetails.lname;
		$scope.mobile = res.personalDetails.mobile;
		$scope.co = res.shippingAddress.co;
		$scope.street = res.shippingAddress.street;
		$scope.postalCode = res.shippingAddress.postalCode;
		$scope.city = res.shippingAddress.city;
		$scope.orders = res.orders;
	});

	$scope.calTotal = function(obj){
		return Service.calTotalCost(obj);
	};
}]);


onlineClothingStoreApp.controller('ReceiptCtrl', ['$scope', 'Service', '$routeParams', function ($scope, Service, $routeParams) {
	$scope.orderNr = $routeParams.orderNr;
	var data = Service.getOrder($scope.orderNr);
	data.promise.then(function(res){
		$scope.items = res.items;
		$scope.totalCost = Service.calTotalCost($scope.items);
	});
}]);
 onlineClothingStoreApp.controller('RegisterCtrl', ['$scope', 'Service', '$location', '$controller', function ($scope, Service, $location, $controller) {
	$scope.co = "-";
	$scope.valid = false;
	$scope.loading = false;

	$controller("LogInCtrl", {$scope: $scope});
	$scope.init();

	$scope.createProfile = function(myForm){
		$scope.loading = true;
		$("#register").fadeTo(500, 0.3);
		var success = false;
		if(!myForm.$valid){
			$scope.valid = true;
		}else if($scope.password !== $scope.password2){
			$scope.loading = false;
			$("#register").fadeTo(100, 1);
			$("#error").text("Password doesn't match the confirm password!");
		}else{
			$scope.valid = false;
			var authentication = {email: $scope.email, password: $scope.password};
			var pDetails = {fname: $scope.fname, lname: $scope.lname, mobile: $scope.mobile, email: $scope.email};
			var address = {co: $scope.co, street: $scope.street, postalCode: $scope.postalCode, city: $scope.city};
			var data = {personalDetails: pDetails, shippingAddress: address};
			Service.createProfile(authentication, data, function(res){
				if (res == "success"){
					success = true;
				}else{
					$scope.loading = false;
					$("#loading").addClass("ng-hide");
					$("#register").fadeTo(500, 1);
					$("#error").text("Error: The specified email address is already in use.");
				}
			});
			waitForIt(success);
		}		
	};

     function waitForIt(success){
         if(success){
             $location.path('/home');
             $scope.$apply();
         }else{
             setTimeout(function(){waitForIt();}, 100);
         }
     }
}]);
onlineClothingStoreApp.controller('ResetPasswordCtrl', ['$scope', 'Service', function ($scope, Service) {
//send an email to the customer with a new randomized password
$scope.not_sent=true;
$scope.sent=false;
  $scope.resetPassword=function(){
      Service.resetPassword($scope.email);
      $scope.sent=true;
      $scope.not_sent=false;
  };

 }]);
onlineClothingStoreApp.controller('SearchCtrl', ['$scope', 'Service', '$cookieStore', '$controller', function ($scope, Service, $cookieStore, $controller) {
	$controller('HomeCtrl', {$scope:$scope});
	$scope.searchQuery=$cookieStore.get("query");
	$scope.searchResult=$scope.getItems("keyword", $scope.searchQuery);
}]);