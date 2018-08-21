'use strict'

var AuthenticationApp = angular.module('Authentication').controller('LoginController', [
	'$scope',
	'$rootScope',
	'$location',
	'$http',
	'AuthenticationService',
	'AuthenticationRepository',
	'StorageService',
	'NetworkService',
	'SincronizacaoService',
	'blockUI',
	constructor
])

function constructor($scope,
		$rootScope,
		$location,
		$http,
		AuthenticationService,
		AuthenticationRepository,
		StorageService,
		NetworkService,
		SincronizacaoService,
		blockUI) {

	AuthenticationService.ClearCredentials();

	$scope.rememberModel = {
		value : AuthenticationService.getPasswordRemember()
	};
	
	var credentials = null;

	if($scope.rememberModel.value) {
		credentials = AuthenticationService.getCredentialsRemember();
		if(credentials) {
			$scope.login = credentials.user.login;
			$scope.senha = AuthenticationService.getPassword(credentials.authdata);
		}
	}

	$scope.doLogin = function() {
		let login = $scope.login
		let senha = $scope.senha
		//Verificar se e celular
		if (NetworkService.isMobile()) {
			if(NetworkService.isOnline() == NETWORK_STATUS.ONLINE) {
				blockUI.start('Sincronizando dados, Aguarde...')
				SincronizacaoService.sincroniza(login, AuthenticationService.getPasswordEncoded(senha), function(response) {
					if(response) {
						let usuarioLocal = StorageService.getLoginUsuario(login, AuthenticationService.getPasswordEncoded(senha))
						if(usuarioLocal) {
							blockUI.stop()
							AuthenticationService.SetCredentials($scope.senha, $scope.rememberModel.value, usuarioLocal);
							$location.path('/dashboard')
						} else {
							blockUI.stop()
							$scope.mensagem = "Autenticação inválida";
						}
					} else {
						blockUI.stop()
						console.log('erro na sincronização')
					}
				})
			} else {
				let idDb = StorageService.getIdentificadorBancoDados()
				if(idDb && idDb === DATABASE.ID) {
					let usuarioLocal = StorageService.getLoginUsuario(login, AuthenticationService.getPasswordEncoded(senha))
					if(usuarioLocal) {
						AuthenticationService.SetCredentials($scope.senha, $scope.rememberModel.value, usuarioLocal);
						$location.path('/dashboard')
						let dtAtualizacao = StorageService.getDataSincronizacao()
						alert('Você está operando offline no momento. Data última sincronização: ' + moment(dtAtualizacao).format('dddd, DD/M/YYYY'))
					} else {
						$scope.mensagem = "Autenticação inválida";
					}
				} else {
					alert("É necessário efetuar a sincronização com o servidor antes de usar o aplicativo.")
					$location.path('/login')
				}
			}
		} else {
			AuthenticationService.Login($scope.login, AuthenticationService.getPasswordEncoded($scope.senha), function(response) {
				if (response != "") {
					AuthenticationService.SetCredentials($scope.senha, $scope.rememberModel.value, response);
					$location.path('/dashboard')
				} else {
					$scope.mensagem = "Autenticação inválida";
				}
			});
		}
	}
}

AuthenticationApp.directive('restrict', function(AuthenticationService){
	return{
		restrict: 'A',
		prioriry: 100000,
		scope: false,
		link: function(){
		},
		compile:  function(element, attr, linker){
			var accessDenied = true;
			var user = AuthenticationService.getUsuario();
			
			var attributes = attr.access.split(" ");
			for(var i in attributes){
				if(user.perfil.nome === attributes[i]){
					accessDenied = false;
				}
			}
			if(accessDenied){
				element.children().remove();
				element.remove();
			}
		}
	}
});
