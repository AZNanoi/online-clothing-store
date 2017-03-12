onlineClothingStoreApp.controller('AppCtrl', ["$scope", function ($scope) {
	var UA = navigator.userAgent;
	if (UA.match(/OPR|iPhone|Android|Opera|Symbian|Motorola|Nokia|Siemens|Samsung|Ericsson|LG|NEC|SEC|MIDP|Windows CE/i))
	{
		$scope.style_css = "style_mobile.css";
		$scope.mobile_device = true;
	}else{
		$scope.style_css = "style.css";
		$scope.mobile_device = false;
	}

	$scope.$back = function() {
		window.history.back();
	};
}]);