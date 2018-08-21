'use strict'
var NotificacaoModule = angular.module('Notificacao').controller('NotificacaoController', [
	'$scope',
	'Notificacation',
	constructor,
])

function constructor($scope, Notificacation) {

}

NotificacaoModule.config(function(NotificationProvider) {
	NotificationProvider.setOptions({
		delay: TIMEOUT/4,
		startTop: 20,
		startRight: 10,
		verticalSpacing: 20,
		horizontalSpacing: 20,
		positionX: 'right',
		positionY: 'top'
	});
})

