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