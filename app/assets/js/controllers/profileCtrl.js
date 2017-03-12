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

