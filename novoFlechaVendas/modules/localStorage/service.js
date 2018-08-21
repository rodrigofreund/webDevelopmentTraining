'use strict'

angular.module('GerenciadorFinanceiroFlechaVendas')

.factory('LocalStorageService', [ '$http', '$rootScope', function($http, $rootScope) {
  let service = {}

  service.getData = function(itemName) {
  	if(localStorage.getItem(itemName) !== 'undefined') {
			return JSON.parse(localStorage.getItem(itemName))
		} else {
			return undefined
		}
  }

  service.setData = function(itemName, data) {
    if(data) {
		  localStorage.setItem(itemName, JSON.stringify(data))
    }
  }

  service.eraseData = function(itemName) {
    localStorage.removeItem(itemName)
  }

  service.resetData = function(id) {
    if(DATABASE.ID === id) {
      localStorage.clear()
    }
  }

  return service
}])