'use strict'

angular.module('GerenciadorFinanceiroFlechaVendas').factory('DatabaseService', [
	'$http',
	'$rootScope',
	constructor,
])

function constructor($http, $rootScope) {
	var service = {};

	service.startDatabase = function() {
		document.addEventListener('deviceready', function() {
			var db = window.sqlitePlugin.openDatabase({name: 'test.db', location: 'default'});
			alert(db)
			db.transaction(function(tr) {
				tr.executeSql('SELECT upper(?) AS upperString', ['Test string'], function(tr, rs) {
					alert('Got upperString result: ' + rs.rows.item(0).upperString);
				});
			}, function(erro) {
				alert('error ao abrir dabaase')
			});
		});
	}

	return service;
}