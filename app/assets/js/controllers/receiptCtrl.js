onlineClothingStoreApp.controller('ReceiptCtrl', ['$scope', 'Service', '$routeParams', function ($scope, Service, $routeParams) {
	$scope.orderNr = $routeParams.orderNr;
	var data = Service.getOrder($scope.orderNr);
	data.promise.then(function(res){
		$scope.items = res.items;
		$scope.totalCost = Service.calTotalCost($scope.items);
	});
}]);