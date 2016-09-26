(function() {
    'use strict';
    
var app = angular.module('common.directives.formBuilder', []);

app.directive('dynamic', function ($compile, dataService, $timeout) {
  return {
    restrict: 'A',
    controller: 'fbFormBuilderController',
    replace: true,
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
        dataService.form = html;  
        var generateTextField = function(value) {
            scope.required = value.required;
            var model = "textField"+textfieldCount;
            dataService.model.push({"id":"textbox","label":value.label,"value":"",index:""+textfieldCount,"type":"textField"});
            return "<div class='form-group'><label class='col-sm-4 control-label' ng-class={'fb-required':'"+value.required+"'}>"+value.label+"</label><div class='col-sm-8'><input type='text' ng-model = '"+model+"' required = '"+value.required+"' validator-required='true' validator-group='' class='form-control' placeholder='"+value.placeholder+"'  ng-change = \"textFieldValueChanged("+model+","+textfieldCount+")\"><p class='help-block'>"+value.description+"</p></div></div>";
        };
        var generateTextArea = function(value) {
            var model = "textArea"+textAreaCount;
            dataService.model.push({"label":value.label,"value":"",index:""+textAreaCount,"type":"textArea"});
            return "<div class='form-group'><label class='col-sm-4 control-label' ng-class={'fb-required':'"+value.required+"'}>"+value.label+"</label><div class='col-sm-8'><textarea  ng-model = '"+model+"' type='text' required = '"+value.required+"' validator-required='false' class='form-control' placeholder='"+value.placeholder+"' ng-change = \"textAreaValueChanged("+model+","+textAreaCount+")\"></textarea><p class='help-block'>"+value.description+"</p></div></div>";
        };

        var generateName = function(value) {
            var firstNameModel = "firstName"+nameCount;
            var secondNameModel = "secondName"+nameCount;
            //dataService.model.push({"label":value.label,"value":"", index:""+nameCount,"type":"name"});
            dataService.model.push({"label":value.label,"value":"","index":""+nameCount,"type":"name"});
            return "<div class='form-group ng-scope'><label class ='col-md-4 control-label' ng-class={'fb-required':'"+value.required+"'}>"+value.label+"</label><div class='col-md-8'><input type='hidden' required = '"+value.required+"' validator-required='false'><div class='col-sm-6' style='padding-left: 0;'><input type='text' ng-model = '"+firstNameModel+"' class='form-control'  ng-change = \"nameChanged("+firstNameModel+","+nameCount+",'first')\"><p class='help-block'>First name</p></div><div class='col-sm-6' style='padding-left: 0;'><input type='text' class='form-control' ng-model = '"+secondNameModel+"' ng-change = \"nameChanged("+secondNameModel+","+nameCount+",'second')\"><p class='help-block'>Last name</p></div></div></div>";
        };

        var generateSelect = function(value) {
            var model = "select"+selectCount;
            //{"label":"Select","value":"value one"}
            dataService.model.push({"label":value.label,"value":"","index":""+selectCount,"type":"select"});
            scope["selectOptions"+selectCount] = value.options;
            return "<div class='form-group'><label class='col-sm-4 control-label' ng-class={'fb-required':'"+value.required+"'}>"+value.label+"</label><div class='col-sm-8'><select class='form-control' required = '"+value.required+"'  ng-model = '"+model+"' ng-options='item for item in selectOptions"+selectCount+"' ng-change = \"selectChanged("+model+","+selectCount+")\"></select><p class='help-block ng-binding'>"+value.description+"</p></div></div>";
        };
        var generateCheckbox = function(value) {
            var model = "checkbox"+checkboxCount;
            dataService.model.push({"id":"checkbox","label":value.label,"value":"","index":""+checkboxCount,"type":"checkBox"});
            scope["check"+checkboxCount] = value.options;
            return "<div class='form-group'><label class='col-sm-4 control-label' ng-class={'fb-required':'"+value.required+"'}>"+value.label+"</label><div class='col-sm-8'><input type='hidden'><!-- ngRepeat: item in options track by $index --><div class='checkbox ng-scope' ng-repeat='item in check"+checkboxCount+"'><label class='ng-binding' ng-click = \"checkBoxTapped("+model+",item,"+checkboxCount+",'checkbox')\"><input type='checkbox' required = '"+value.required+"' id ='checkbox1' ng-model = '"+model+"' name = 'checkbox1' value='{{item}}'>{{item}}</label></div><p class='help-block'>"+value.description+"</p></div></div>";
        };
        var generateRadio = function(value) {
            var model = "radio"+radioCount;
            //{"label":"Radio","value":"value one"}
            scope["radioOptions"+radioCount] = value.options;
            dataService.model.push({"label":value.label,"value":"","index":""+radioCount,"type":"radio"});
            return "<div class='form-group'><label class='col-sm-4 control-label' ng-class={'fb-required':'"+value.required+"'}>"+value.label+"</label><div class='col-sm-8'><!-- ngRepeat: item in options track by $index --><div class='radio' ng-repeat='item in radioOptions"+radioCount+"'><label class='ng-binding' ng-click = \"radioTapped("+model+", "+radioCount+")\"><input validator-group='"+value.label+"' value='{{item}}' name = 'df' required = '"+value.required+"' type='radio' ng-model = '"+model+"'>{{item}}</label></div></div></div>";
        };
        
        angular.forEach(viewModel,function(value, key) {
            if(value.component == "textInput" || value.component == "sampleInput") {
                textfieldCount++;
                var tempField = generateTextField(value);
                resultModel = resultModel + tempField;
            }
            if(value.component == "checkbox") {
                checkboxCount++;
                var tempCheckBox = generateCheckbox(value);
                resultModel = resultModel + tempCheckBox;
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
    
app.directive('fbSubmit', function() {
    return {
        restrict: 'AEC',
        controller: 'fbFormBuilderController',
        scope: {
            type: '@',
            kind: '@'
        },
        link: function(scope,elem,attrs) {
            var button = "<div class = 'row'><div class='col-md-8 col-md-offset-4'><input type='submit' ng-click='submit(form)' class='btn btn-default'/></div></div>";
            elem.bind('click',function(event) {
                scope.submit(scope.type,scope.kind);
            });
            elem.html(button);
        },
    }
});
app.factory('dataService', [function(){
  return { form: [], model:[] };
}]);
app.controller('fbFormBuilderController', function($scope, dataService, $timeout) {
    //Write controller logic in here
    $scope.submit = function(type, kind) {
        console.log(type +""+ kind);
        var result = {
            "kind":kind,
            "type":type,
            "formStructure":dataService.form,
            "formInput":dataService.model
        }
        alert(JSON.stringify(result));
        console.log(JSON.stringify(result));
    }
    var removeObjectFromArray = function(object, array) {
            for (var i=array.length-1; i>=0; i--) {
                if (array[i] === object) {
                    array.splice(i, 1);
                }
            }
            return array;
        }
    var addItem = function(items,item){
        var tempArray = items.split(",");
        removeObjectFromArray("",tempArray);
        if(tempArray.indexOf(item) == -1) {
            tempArray.push(item);
        }
        return tempArray.join(",");
    };
    
    var removeItem = function(items,item){
        var tempArray = items.split(",");
        if(tempArray.indexOf(item) != -1) {
            tempArray.splice(tempArray.indexOf(item), 1);
        }
        return tempArray.join(",");
    };
    
    $scope.checkBoxTapped = function(flag,value, count, type) {
        var modelArray = dataService.model;
        angular.forEach(modelArray,function(result, key) {
            if(modelArray[key].index == count && modelArray[key].type == "checkBox") {
                
                if(flag) {
                    modelArray[key] = {"id":modelArray[key].id,"label":modelArray[key].label,"value":addItem(modelArray[key].value,value),"index":""+count, "type":modelArray[key].type};    
                }
                else {
                    modelArray[key] = {"id":modelArray[key].id,"label":modelArray[key].label,"value":removeItem(modelArray[key].value,value),"index":""+count, "type":modelArray[key].type}; 
                }
                
            }
        });
        dataService.model = modelArray;
    };
    
    $scope.radioTapped = function(model,index) {
        var modelArray = dataService.model;
        angular.forEach(modelArray,function(result, key) {
            if(modelArray[key].index == index && modelArray[key].type == "radio") {
                modelArray[key] = {"label":modelArray[key].label,"value":model,"index":""+index, "type":modelArray[key].type}; 
            }
        });
        dataService.model = modelArray;
    }
    $scope.textFieldValueChanged = function(model,index) {
        var modelArray = dataService.model;
        angular.forEach(modelArray,function(result, key) {
            if(modelArray[key].index == index && modelArray[key].type == "textField") {
                modelArray[key] = {"id":"textbox","label":modelArray[key].label,"value":model,"index":index, "type":modelArray[key].type}; 
            }
        });
        dataService.model = modelArray;
    }
    $scope.textAreaValueChanged = function(model,index) {
        var modelArray = dataService.model;
        angular.forEach(modelArray,function(result, key) {
            if(modelArray[key].index == index && modelArray[key].type == "textArea") {
                modelArray[key] = {"label":modelArray[key].label,"value":model,"index":index, "type":modelArray[key].type}; 
            }
        });
        dataService.model = modelArray;
    }
    
    var addFirstName = function(items,item) {
        var tempArray = items.split(",");
        removeObjectFromArray("",tempArray);
        tempArray[0] = item;
        return tempArray.join(", ");
    };
    var addSecondName = function(items,item) {
        var tempArray = items.split(",");
        removeObjectFromArray("",tempArray);
        tempArray[1] = item;
        return tempArray.join(", ");
    };
    $scope.nameChanged = function(model,index,name) {
        var modelArray = dataService.model;
        console.log(modelArray);
        angular.forEach(modelArray,function(result, key) {
            if(modelArray[key].index == index && modelArray[key].type == "name") {
                console.log(123);
                if(name == "first") {
                    modelArray[key] = {"label":modelArray[key].label,"value":addFirstName(modelArray[key].value,model),"index":""+index, "type":modelArray[key].type};    
                    console.log(modelArray[key]);
                }
                else {
                    modelArray[key] = {"label":modelArray[key].label,"value":addSecondName(modelArray[key].value,model),"index":index,"type":modelArray[key].type};    
                }
            }
        });
        dataService.model = modelArray;
    };
    $scope.selectChanged = function(model,index) {
        console.log("model "+model+ " index "+index);
        var modelArray = dataService.model;
            angular.forEach(modelArray,function(result, key) {
                console.log(1);
                if(modelArray[key].index == index && modelArray[key].type == "select") {
                    modelArray[key] = {"label":modelArray[key].label,"value":model,"index":index, "type":modelArray[key].type}; 
                }
            });    
        dataService.model = modelArray;
    };

});
})();