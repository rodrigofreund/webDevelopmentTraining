'use strict'

var UsuarioModulo = angular.module('UsuarioModulo')

UsuarioModulo.component('cadastroCompletoUsuario', {
	controller: function usuarioModuloController(
		$scope,
		$state,
		$route,
		UsuarioService,
		IndustriasService,
		CadastroClientesService,
		NotificationService,
		AuthenticationService,
		ModalService) {

		if($state.params.id) {
			//Buscar dados do usuário
			UsuarioService.buscaUsuarioPorId($state.params.id, (result) => {
				$scope.cadastro = result
				$scope.senhaOriginal = AuthenticationService.getPassword($scope.cadastro.senha.senha1)
				$scope.cadastro.senha.senha1
				$scope.representacoes = result.representacoes
			})
		} else {
			$scope.cadastro = {
				ativo: true
			}
			$scope.representacoes = []
		}

		$scope.representacao = {
			industria: null
		}
		$scope.listaIndustria = []
		$scope.senhaAlterada = false
		$scope.importacao = {
			usuario: null
		}

		UsuarioService.listaPerfil(function(result) {
			$scope.listaPerfil = result
		})

		$scope.selecionaTabRepresentacao = function() {
			IndustriasService.getIndustrias(function(result) {
				$scope.listaIndustria = result
			})
			if($scope.cadastro.id) {
				UsuarioService.buscaUsuarioCadastroDto($scope.cadastro.id, (result) => {
					$scope.representacoes = result.representacoes
				})
			}
		}

		$scope.selecionaTabRepresentacaoCliente = function() {
			CadastroClientesService.buscaVendedores(function(result) {
				$scope.usuarios = result
				$scope.nomeUsuarioFormatado = `${$scope.cadastro.id} - ${$scope.cadastro.nome}`
			})
		}

		$scope.criaRepresentacao = function() {
			var listaEncontrados = $.grep($scope.representacoes, function (e, i) {
				return e.idIndustria == $scope.representacao.industria.id;
			});
			if(listaEncontrados && listaEncontrados.length > 0) {
				NotificationService.alert('Indústria já cadastrada para o usuário.')
			} else {
				var representacaoDto = new RepresentacaoDto($scope.cadastro, $scope.representacao.industria);
				$scope.representacoes.push(representacaoDto)
			}
		}

		$scope.salvaUsuario = function() {
			ajustesCriptografiaSenha()
			$scope.cadastro.representacoes = $scope.representacoes
			if(validaSenha()) {
				UsuarioService.salvaUsuario($scope.cadastro, function(result) {
					$scope.cadastro = result
					$scope.senhaOriginal = AuthenticationService.getPassword($scope.cadastro.senha.senha1)
					$scope.senhaAlterada = false
					NotificationService.success('Usuário cadastrado com sucesso!')
				})
			} else {
				NotificationService.error('Senhas informadas não são iguais')
			}
		}

		$scope.excluiUsuario = function() {
			var modalOptions = {
				closeButtonText: 'Não',
				actionButtonText: 'Sim',
				headerText: 'Confirmar',
				bodyText: `Ao EXCLUIR o usuário o não será mais possível acessar os dados deste! Confirma?`
			};
			ModalService.showModal({}, modalOptions).then(function (result) {
				UsuarioService.buscaUsuarioPorId($scope.cadastro.id, function(result){
					result.excluido = true
					UsuarioService.salvaUsuario(result, function(usuario) {
						NotificationService.success("Usuário EXCLUÍDO com sucesso!")
						$state.go('usuario.pesquisa')
					})
				})
			})
		}

		$scope.sinalizaSenhaAlterada = function() {
			$scope.senhaAlterada = true
		}

		$scope.isVendedor = function() {
			return AuthenticationService.isVendedor();
		}

		$scope.importar = function() {
			if($scope.cadastro.id === $scope.importacao.usuario.id) {
				NotificationService.alert('Não é possível importar para o mesmo usuário')
				return
			}
			var importacaoUsuarioDto = {
				idUsuarioOrigem : $scope.importacao.usuario.id,
				idUsuarioDestino : $scope.cadastro.id
			}
			UsuarioService.verificarImportacaoBaseUsuario(importacaoUsuarioDto, function(result) {
				var modalOptions = {
					closeButtonText: 'Cancelar',
					actionButtonText: 'Importar',
					headerText: `Dados a serem importados`,
					bodyDataList: result
				};
				var modalDefaults = {
					backdrop: true,
					keyboard: true,
					modalFade: true,
					templateUrl: 'modules/partials/modalImportacaoClientesUsuario.html',
				};
				ModalService.showModal(modalDefaults, modalOptions).then(function (modalResult) {
					UsuarioService.importarBaseUsuario(result, function(importacaoResult) {
						NotificationService.success(`Importação realizada com sucesso! ${importacaoResult} clientes importados.`)
						$state.go('usuario.edicao', {'id': $scope.cadastro.id})
					})
				});
			})
		}

		$scope.verificaUsuarioCadastradoPorLogin = () => {
			UsuarioService.buscaUsuarioPorLogin($scope.cadastro.login, (result => {
				if(result) {
					NotificationService.error('Login do usuário já existente');
					$scope.cadastro.login = null
				}
			}));
		}

		function ajustesCriptografiaSenha() {
			if($scope.cadastro.id) {
				if($scope.senhaAlterada && $scope.senhaOriginal != $scope.cadastro.senha.senha1) {
					$scope.cadastro.senha.senha1 = AuthenticationService.getPasswordEncoded($scope.cadastro.senha.senha1)
					$scope.cadastro.senha.senha2 = AuthenticationService.getPasswordEncoded($scope.cadastro.senha.senha2)
				}
			} else {
				$scope.cadastro.senha.senha1 = AuthenticationService.getPasswordEncoded($scope.cadastro.senha.senha1)
				$scope.cadastro.senha.senha2 = AuthenticationService.getPasswordEncoded($scope.cadastro.senha.senha2)
			}
		}

		function validaSenha() {
			return $scope.cadastro.senha.senha1 === $scope.cadastro.senha.senha2
		}
  },
  templateUrl: 'modules/usuario/components/cadastroCompleto/views/cadastroCompleto.html',
	bindings: {},
	controllerAs: 'ctrl',
})
