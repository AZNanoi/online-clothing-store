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