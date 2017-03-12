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