'use strict'

var app = angular.module('GerenciadorFinanceiroFlechaVendas');

app.factory('FileService', ['$window',
	constructor,
])

function constructor($window) {
  var service = {};
  
  service._base64ToArrayBuffer = function(base64) {
    var binary_string =  $window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
  
  service.b64toBlob = function(b64Data, contentType, sliceSize) {
    return new Blob([service._base64ToArrayBuffer(b64Data)], {type: contentType});
  }

	return service;
}