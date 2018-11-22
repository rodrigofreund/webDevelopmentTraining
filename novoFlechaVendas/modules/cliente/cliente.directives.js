'use strict';

ClienteModulo.directive('checkCpfCnpj', function () {
  return {
    require: 'ngModel',
    link: function (scope, iElement, attrs, ngModel) {
      iElement.bind('keyup', function (e) {
        if (ngModel.$modelValue != undefined) {
          ngModel.$setValidity('cnfCnpj', true);
          if (scope.validaDocumento(ngModel.$modelValue)) {
            ngModel.$setValidity('cnfCnpj', true);
          } else {
            ngModel.$setValidity('cnfCnpj', false);
          }
          scope.$apply();
        }
      });
    }
  };
});

ClienteModulo.directive('ngFileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var model = $parse(attrs.ngFileModel);
      var isMultiple = attrs.multiple;
      var modelSetter = model.assign;
      element.bind('change', function () {
        var values = [];
        var url =
          angular.forEach(element[0].files, function (item) {
            values.push(item);
          });
        scope.$apply(function () {
          if (isMultiple) {
            modelSetter(scope, values);
          } else {
            modelSetter(scope, values[0]);
          }
        });
      });
    }
  };
}]);

ClienteModulo.directive('capitalize', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      var capitalize = function (inputValue) {
        if (inputValue == undefined) inputValue = '';
        var capitalized = inputValue.toUpperCase();
        if (capitalized !== inputValue) {
          modelCtrl.$setViewValue(capitalized);
          modelCtrl.$render();
        }
        return capitalized;
      }
      modelCtrl.$parsers.push(capitalize);
      capitalize(scope[attrs.ngModel]); // capitalize initial value
    }
  };
});
