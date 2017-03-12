onlineClothingStoreApp.controller('helpContactCtrl', ['$scope', '$rootScope', '$location', 'Service', '$cookieStore', '$location', function ($scope, $rootScope, $location, Service, $cookieStore, $location) {
    $rootScope.$on("CallUpdateCategory", function(event, data){
        $scope.updateCategory(data.category,data.e);
    });

    var category;
    $scope.displayedArrows=false;
    var parentScope = $scope.$parent.$parent;

    if(parentScope.mobile_device){
        $(".categories").remove();
    }else if(parentScope.mobile_device === false){
        $(".categories").css("display", "block");
    }

    if("undefined" === typeof($cookieStore.get("categoryName"))){
        category = "Featured";
    }else{
        category = $cookieStore.get("categoryName");
    }

    function toggleSlideShow(category){
        if(category=="Featured"){
            $scope.displayedSlide=true;
        }else{
            $scope.displayedSlide=false;
        }
    }

    function changeBGColor(category){
        var selected = $("ul").find(".selected");
        selected.css("background-color", "rgba(128,128,128,0.6)");
        selected.attr("class", "");
        $("#"+category).css("background-color", "rgba(0,0,0,0.7)");
        $("#"+category).attr("class", "selected");
    }

    toggleSlideShow(category);
    changeBGColor(category);

    $scope.getItems=function(keyword, query){
        $scope.categoryName = query.toUpperCase();
        var sort = '{"'+keyword+'":"'+query+'"}';
        var a = JSON.parse(sort);
        Service.getItems.get(a, function(data){
            if(keyword === "category"){
                $scope.category=data;
            }else{
                $scope.searchResult=data;
            }
        });
    };

    $scope.getSearch=function(query){
        $scope.getItems('keyword',query);
        $cookieStore.put("query", query);
        $location.path("/search");
    };

    $scope.getItems("category", category);

    $scope.updateCategory = function(category, event){
        event.preventDefault();
        toggleSlideShow(category);
        changeBGColor(category);
        if(category !== "Help-contact"){
            $cookieStore.put("categoryName", category);
        }
        $scope.getItems("category", category);
        var path = category.toLowerCase();
        if(parentScope.mobile_device && path === "featured"){
            path = "home";
        }else if(!parentScope.mobile_device && path === "featured"){
            path = "";
        }
        $location.path('/'+path);
    };

    $scope.keyUpFunction = function(query) {
        console.log(query);
        if (query.length>0){
            $scope.getItems("keyword", query);
            $("#search-input-frame").show();
        }
        else if (query===false || query===" "){
            $("#search-input-frame").hide();
        }
    };

    $scope.showArrows = function(){
        $scope.displayedArrows=true;
    };
    $scope.hideArrows = function(){
        $scope.displayedArrows=false;
    };

    Service.getItems.get({"category":"slideshow"}, function(res){
        images = res.data;
    });

    var images, x = -1;

    $scope.displayNextImage = function() {
        x = (x === images.length - 1) ? 0 : x + 1;
        var e = document.getElementById("imgSlideshow");
        if(e !== null){
            e.src = images[x].imageUrl;
        }
    };

    $scope.displayPreviousImage = function() {
        x = (x <= 0) ? images.length - 1 : x - 1;
        document.getElementById("imgSlideshow").src = images[x].imageUrl;
    };

    var nIntervId = setInterval($scope.displayNextImage, 3000);

    $scope.$on('$destroy', function() {
        clearInterval(nIntervId);
    });
}]);