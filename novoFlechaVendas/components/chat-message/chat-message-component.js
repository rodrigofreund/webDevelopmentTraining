'use strict'

angular.module('GerenciadorFinanceiroFlechaVendas').component('chatMessage', {
	templateUrl: './components/chat-message/chat-message-template.html',
	controller: function chatMessageController() {
		var ctrl = this

		ctrl.calculaTempo = function (msg) {
			return new Date(msg.dataCriacao).toLocaleString()
		}

		ctrl.verificaUsuarioLogado = function (msg) {
			if (ctrl.auth.id == msg.idUsuario) {
				return true;
			}
			return false;
		}
	},
	bindings: {
		mensagens: '=',
		auth: '<'
	},
	controllerAs: 'ctrl'
})