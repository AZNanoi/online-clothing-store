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