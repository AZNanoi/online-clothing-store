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