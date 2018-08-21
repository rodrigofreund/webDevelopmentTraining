'use strict';

angular.module('Menu')

.factory('MenuService', ['$http', '$rootScope', 
    function($http, $rootScope){
		var service = {};
		/*modo = 1 : Cadastro*/
		/*modo = 2 : Detalhe*/
		/*modo = 3 : Tabela */
		service.modo = null;
		
		service.modoCadastro = function() {
			return service.modo == 1;
		}
		
		service.modoDetalhe = function() {
			return service.modo == 2;
		}
		
		service.modoTabela = function() {
			return service.modo == 3;
		}
		
		service.setModoCadastro = function() {
			return service.modo = 1;
		}
		
		service.setModoDetalhe = function() {
			return service.modo = 2;
		}
		
		service.setModoTabela = function() {
			return service.modo = 3;
		}
		
		return service;
	}
]);