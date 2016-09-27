(function() {
    'use strict';
    var module = angular.module('fbController',['common.directives.formBuilder']);
    
    module.controller('fbController', function($scope, $rootScope) {
    //$scope.html = [{"id":"textbox","component":"textInput","editable":false,"index":0,"label":"Name","description":"Your name","placeholder":"Your name","options":[],"required":true,"validation":"/.*/"}];    
    $scope.goToFormViewer = function(input) {
        $scope.html = [];
        $scope.html = input;
        $rootScope.result = input;
        alert($rootScope.result);
        var res = document.getElementById("result").value;
        console.log(res);
        console.log(window.top.test);
        window.top.test = res;
        window.top.testScope = "sdfdsafds";
    };
    $scope.submit = function(form) {
        console.log(form);
    }
    });
})();

