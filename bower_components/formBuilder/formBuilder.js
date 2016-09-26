(function() {
    'use strict';
    
var app = angular.module('formBuilder', []);

app.directive('dynamic', function ($compile) {
  return {
    restrict: 'A',
    controller: 'fbFormBuilderController',
    replace: true,
    scope:{
        kind = '@',
        type = '@'
    }
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
        var viewModel = html;
        var resultModel = "";
        var textfieldCount = 0;
        var checkboxCount = 0;
        var textAreaCount = 0;
        var radioCount = 0;
        var nameCount = 0;
        var selectCount = 0;
        var generateTextField = function(value) {
            scope.required = value.required;
            return "<div class='form-group'><label class='col-sm-4 control-label' ng-class={'fb-required':'"+value.required+"'}>"+value.label+"</label><div class='col-sm-8'><input type='text' required = '"+value.required+"' validator-required='true' validator-group='' class='form-control' placeholder='"+value.placeholder+"'><p class='help-block'>"+value.description+"</p></div></div>";
        };
        var generateTextArea = function(value) {
            return "<div class='form-group'><label class='col-sm-4 control-label' ng-class={'fb-required':'"+value.required+"'}>"+value.label+"</label><div class='col-sm-8'><textarea type='text' required = '"+value.required+"' validator-required='false' class='form-control' placeholder='"+value.placeholder+"'></textarea><p class='help-block'>"+value.description+"</p></div></div>";   
        };

        var generateName = function(value) {
            return "<div class='form-group ng-scope'><label class ='col-md-4 control-label' ng-class={'fb-required':'"+value.required+"'}>"+value.label+"</label><div class='col-md-8'><input type='hidden' required = '"+value.required+"' validator-required='false'><div class='col-sm-6' style='padding-left: 0;'><input type='text' class='form-control'><p class='help-block'>First name</p></div><div class='col-sm-6' style='padding-left: 0;'><input type='text' class='form-control'><p class='help-block'>Last name</p></div></div></div>";
        };

        var generateSelect = function(value) {
            scope["select"+selectCount] = value.options;
            return "<div class='form-group'><label class='col-sm-4 control-label' ng-class={'fb-required':'"+value.required+"'}>"+value.label+"</label><div class='col-sm-8'><select class='form-control' required = '"+value.required+"' ng-model = 'selectModel"+selectCount+"' ng-options='item for item in select"+selectCount+"'></select><p class='help-block ng-binding'>"+value.description+"</p></div></div>";
        };
        var generateCheckbox = function(value) {
            scope["check"+checkboxCount] = value.options;
            return "<div class='form-group'><label class='col-sm-4 control-label' ng-class={'fb-required':'"+value.required+"'}>"+value.label+"</label><div class='col-sm-8'><input type='hidden'><!-- ngRepeat: item in options track by $index --><div class='checkbox ng-scope' ng-repeat='item in check"+checkboxCount+"'><label class='ng-binding'><input type='checkbox' required = '"+value.required+"' value='item'>{{item}}</label></div><p class='help-block'>"+value.description+"</p></div></div>";
        };
        var generateRadio = function(value) {
            //scope.radioOption = value.options;
            scope["check"+checkboxCount] = value.options;
            return "<div class='form-group'><label class='col-sm-4 control-label' ng-class={'fb-required':'"+value.required+"'}>"+value.label+"</label><div class='col-sm-8'><!-- ngRepeat: item in options track by $index --><div class='radio' ng-repeat='item in check"+radioCount+"'><label class='ng-binding'><input validator-group='"+value.label+"' value='{{item}}' required = '"+value.required+"' type='radio'>{{item}}</label></div></div></div>";
        };
        
        angular.forEach(viewModel,function(value, key) {
            if(value.component == "textInput" || value.component == "sampleInput") {
                textfieldCount++;
                var tempField = generateTextField(value);
                resultModel = resultModel + tempField;
            }
            if(value.component == "checkbox") {
                checkboxCount++;
                var tempTextField = generateCheckbox(value);
                resultModel = resultModel + tempTextField;
            }
            if(value.component == "textArea") {
                textAreaCount++;
                var tempTextArea = generateTextArea(value);
                resultModel = resultModel + tempTextArea;
            }
            if(value.component == "name") {
                nameCount++;
                var tempName = generateName(value);
                resultModel = resultModel + tempName;
            }
            if(value.component == "select") {
                selectCount++; //To create dynamic model
                var tempSelect = generateSelect(value);
                resultModel = resultModel + tempSelect;
            }
            if(value.component == "radio") {
                radioCount++;
                var tempRadio = generateRadio(value);
                resultModel = resultModel + tempRadio;
            }
        });
        ele.html(resultModel);
        $compile(ele.contents())(scope);
      });
    }
  };
});

app.controller('fbFormBuilderController', function($scope) {
    //Write controller logic in here
});
})();