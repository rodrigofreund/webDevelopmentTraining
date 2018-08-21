var pedidoProdutosModule = angular.module('PedidoProdutos');

pedidoProdutosModule.filter('percentage', ['$filter', function($filter){
		return function(input) {
			return $filter('number')(input * 100) + '%';
		};
	}]);

pedidoProdutosModule.directive('percent', function($filter){
	var p = function(viewValue) {
        if(!viewValue) {
            viewValue = "0"
        }
		return parseFloat(viewValue)/100
	};
	
    var f = function(modelValue){
        return $filter('number')(parseFloat(modelValue)*100, 2)
    };
    
    return {
        require: 'ngModel',
        link: function(scope, ele, attr, ctrl){
            ctrl.$parsers.unshift(p)
            ctrl.$formatters.unshift(f)
        }
    };
});