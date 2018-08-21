var cadastroClienteModule = angular.module('CadastroClientes');

cadastroClienteModule.directive('autoComplete', ['$timeout', function ($timeout) {
  return function (scope, iElement, iAttrs) {
    iElement.autocomplete({
      source: scope[iAttrs.uiItems],
      select: function () {
        $timeout(function () {
          iElement.trigger('input');
        }, 0);
      }
    });
  };
}]);

cadastroClienteModule.directive('capitalize', function () {
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

cadastroClienteModule.directive('checkCpfCnpj', function () {
  return {
    require: 'ngModel',
    link: function (scope, iElement, attrs, ngModel) {
      iElement.bind('blur', function (e) {
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

cadastroClienteModule.directive('ngFileModel', ['$parse', function ($parse) {
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

cadastroClienteModule.filter('sim_nao', function () {
  return function (text, length, end) {
    if (text) {
      return 'Sim';
    }
    return 'Não';
  }
});