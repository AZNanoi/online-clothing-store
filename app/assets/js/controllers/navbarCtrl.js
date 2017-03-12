onlineClothingStoreApp.controller('NavbarCtrl', ['$scope', '$rootScope', 'Service', function ($scope, $rootScope, Service) {
    $scope.updateCategory = function(category, event) {
        $rootScope.$emit("CallUpdateCategory", {"category":category, "e":event});
    };

    $scope.showMenuIcon = false;
    $scope.menuIcon = "images/menu-icon.png";
    $scope.itemsAmount=Service.getCart().length;

    var parentScope = $scope.$parent.$parent;
    parentScope.childScope = $scope;

    window.addEventListener('orientationchange', function() {
        if(window.screen.width > window.screen.height)
        {
            $("#header").css("position", "absolute");
            console.log(window.screen.width);
            if(window.screen.width<=1024){
                $("#menu").css("position", "absolute");
            }
        }else{
            $("#header").css("position", "fixed");
            $("#menu").css("position", "fixed");
        }
    }, false);

    if(parentScope.mobile_device){
        //$scope.showMenuIcon=true;
        $scope.mobile_device = true;
        $(".shopping_cart").css("margin-right", "20px");
    }else{
        $scope.showMenuIcon=false;
        $scope.mobile_device = false;
    }

    function authDataCallback(authData){
        if(authData){
            var profileData = Service.getProfile();
            profileData.promise.then(function(res){
                $scope.full_name = res.personalDetails.fname + ' ' + res.personalDetails.lname;
            });
            $scope.loggedIn=true;
            $scope.showMenuIcon=true;
            $scope.notLoggedIn=false;
            $(".shopping_cart").css("margin-right", "15px");
        }else{
            $scope.full_name = "";
            $scope.loggedIn=false;
            $scope.notLoggedIn=true;
        }
    }

    Service.dataRef.onAuth(authDataCallback);

    $scope.logOut = function(){
        Service.logOut();
        authDataCallback();
        $scope.dMenuDisplayed = false;
        $(".shopping_cart").css("margin-right", "0px");
        $scope.toggleDMenu();
    };

    $scope.toggleDMenu = function(event) {
        var container = $("#dropdownMenu");
        var icon = $("#dMenu-icon");
        if(container.css("display") == "none"){
            container.css("display", "block");
            icon.css("background-image", "url(assets/images/menu-icon-gray.png)");
        }else{
            container.css("display", "none");
            icon.css("background-image", "url(assets/images/menu-icon.png)");
        }
    };
}]);