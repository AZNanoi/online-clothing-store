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