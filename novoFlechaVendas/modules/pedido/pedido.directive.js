'use strict';

var PedidoModule = angular.module('pedido.module');

PedidoModule.directive('percent', function ($filter) {
  var p = function (viewValue) {
    if (!viewValue) {
      viewValue = "0"
    }
    return parseFloat(viewValue.replace(",", ".")) / 100
  };

  var f = function (modelValue) {
    return $filter('number')(parseFloat(modelValue) * 100, 2)
  };

  return {
    require: 'ngModel',
    link: function (scope, ele, attr, ctrl) {
      ctrl.$parsers.unshift(p)
      ctrl.$formatters.unshift(f)
    }
  };
});

PedidoModule.directive('validDate', function () {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function (scope, elem, attrs, ngModel) {

      ngModel.$options.allowInvalid = true;

      ngModel.$validators.invalidDate = function (modelValue, viewValue) {
        if (!modelValue) {
          return true;
        }

        var datepickerOptions = scope.$eval(attrs.datepickerOptions);
        if (!datepickerOptions) {
          return true;
        }

        if (datepickerOptions.minDate || datepickerOptions.maxDate) {
          var modelValueMoment = moment(modelValue);

          if (datepickerOptions.minDate) {
            var minDateMoment = moment(datepickerOptions.minDate);
            if (modelValueMoment.isBefore(minDateMoment, 'day')) {
              return false;
            }
          }

          if (datepickerOptions.maxDate) {
            var maxDateMoment = moment(datepickerOptions.maxDate);
            if (modelValueMoment.isAfter(maxDateMoment, 'day')) {
              return false;
            }
          }
        }

        if (datepickerOptions.dateDisabled && datepickerOptions.dateDisabled({ date: modelValue })) {
          return false;
        }

        return true;
      }
    }
  }
});