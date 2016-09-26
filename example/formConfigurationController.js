(function() {
    'use strict';
    var module = angular.module('fbController',['common.directives.formBuilder']);
    
    module.controller('fbController', function($scope) {
    //$scope.html = [{"id":"textbox","component":"textInput","editable":false,"index":0,"label":"Name","description":"Your name","placeholder":"Your name","options":[],"required":true,"validation":"/.*/"}];    
    $scope.goToFormViewer = function(input) {
        $scope.html = [];
        $scope.html = input;
    };
    $scope.submit = function(form) {
        console.log(form);
    }
    });
})();

