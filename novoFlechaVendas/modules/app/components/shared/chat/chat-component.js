'use strict'

angular.module('GerenciadorFinanceiroFlechaVendas').component('chat', {
	templateUrl: './modules/app/components/shared/chat/chat-template.html',
	bindings: {
		observacoes: '=',
		auth: '<',
		idPedido: '<'
	},
	controllerAs: 'ctrl',
	controller: function chatController(PedidoService) {
		var ctrl = this
		ctrl.adicionaObservacao = function () {
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
			if(!ctrl.observacoes) {
				ctrl.observacoes = [];
			}
			ctrl.observacoes.push(msg);

			let observacaoPedidoUpdateDto = {
				idPedido: ctrl.idPedido,
				listaObservacaoPedidoDto: ctrl.observacoes
			}

			if (ctrl.idPedido) {
				PedidoService.setObservacoesPedido(observacaoPedidoUpdateDto);
			}
			// Limpa campo da tela
			ctrl.observacao = undefined
		}
	}
})
