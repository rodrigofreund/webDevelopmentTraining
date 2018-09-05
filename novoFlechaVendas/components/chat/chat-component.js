'use strict'

angular.module('GerenciadorFinanceiroFlechaVendas').component('chat', {
	templateUrl: './components/chat/chat-template.html',
	bindings: {
		observacoes: '=',
		auth: '<',
		idPedido: '<'
	},
	controllerAs: 'ctrl',
	controller: function chatController() {
		var ctrl = this
		ctrl.adicionaObservacao = function() {
			const dataCriacao = new Date().toISOString();
			let msg = {
				idObservacao: undefined,
				idPedido: ctrl.idPedido,
				dataCriacao: dataCriacao,
				dataLeitura: undefined,
				lido: undefined,
				idUsuario: ctrl.auth.id,
				observacao: ctrl.observacao,
				nomeUsuario: ctrl.auth.nome
			}
			console.log('msg: ', msg);
			ctrl.observacoes.push(msg);
			console.log('ctrl.observacoes: ', ctrl.observacoes);
	
			// Limpa campo da tela
			ctrl.observacao = undefined
		}
	}
})