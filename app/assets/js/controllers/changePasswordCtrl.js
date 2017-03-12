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