'use strict'

angular.module('GerenciadorFinanceiroFlechaVendas').component('chatMessage', {
	templateUrl: './components/chat-message/chat-message-template.html',
	controller: function chatMessageController(AuthenticationService) {
		this.calculaTempo = calculaTempo.bind(this)
		this.AuthenticationService = AuthenticationService
		this.verificaUsuarioLogado = verificaUsuarioLogado.bind(this)
	},
	bindings: {
		mensagens: '='
	},
	controllerAs: 'ctrl'
})

function calculaTempo(msg) {
	return new Date(msg.dataCriacao).toLocaleString()
}

function verificaUsuarioLogado(msg) {
	if(this.AuthenticationService.getUsuario().id == msg.idUsuario) {
		return true;
	}
	return false;
}