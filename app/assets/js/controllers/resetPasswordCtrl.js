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