'use strict'

angular.module('CadastroClientes')
	.controller('CadastroClientesController',
		['$scope',
			'$rootScope',
			'$location',
			'$sce',
			'$route',
			'$routeParams',
			'$window',
			'CadastroClientesService',
			'ClientesCadastradosService',
			'IndustriasService',
			'AuthenticationService',
			'blockUI',
			'ModalService',
			'IndustriaClientePrazoService',
			'NotificationService',
			function ($scope,
				$rootScope,
				$location,
				$sce,
				$route,
				$routeParams,
				$window,
				service,
				ClientesCadastradosService,
				IndustriasService,
				AuthenticationService,
				blockUI,
				ModalService,
				IndustriaClientePrazoService,
				NotificationService) {

				var cliente = ClientesCadastradosService.clienteParaEditar;

				$scope.listaRepresentacoesVendedor = [];
				$scope.listaRepresentacoesCliente = [];
				$scope.listaIndustriaCliente = [];
				$scope.industriaPrazo = {
					selecionado: undefined,
				}

				if (cliente) {
					$scope.cliente = cliente;
					$scope.listaRepresentacoesCliente = cliente.listaRepresentacoesCliente;
					ClientesCadastradosService.clienteParaEditar = null;
					service.getIndustriasCliente(cliente.id, function (response) {
						$scope.listaIndustriaCliente = response;
					});
					if ($scope.cliente.excluido) {
						NotificationService.alert('Este cliente está excluído. Efetue as alterações e salve o cadastro para reativá-lo.')
					}
				} else {
					$scope.cliente = {
						id: null,
						razaoSocial: "",
						nomeFantasia: "",
						cpfCnpj: null,
						rgIe: "",
						rua: "",
						numero: null,
						sala: null,
						andar: null,
						complemento: "",
						bairro: "",
						cep: "",
						cidade: "",
						estado: null,
						telefone: null,
						celular: null,
						contato: "",
						email: "",
						diasEntrega: "",
						horarioEntrega: "",
						nomeBanco: null,
						numeroAgencia: "",
						nomeAgencia: "",
						numeroConta: "",
						idPessoa: null,
						ativo: true,
						bloqueioVenda: false,
						informacoesAdicionais: "",
						pendenteRegistro: null,
						referenciasComerciais: undefined,
						excluido: null
					};
				}

				$scope.banco = {
					nome: null
				};

				$scope.arquivoCliente = undefined

				$scope.representacaoVendedor = {
					selecionado: null
				};

				$scope.industria = {
					selecionado: null
				};

				$scope.estado = {
					selecionado: null
				}

				$scope.industriaCliente = {
					idCliente: null,
					idIndustria: null,
					codigo: null,
					limiteCredito: null,
					ativo: true,
					bloqueioVenda: false,
					nomeIndustria: null,
					removido: false,
					listaIndustriaClientePrazo: [],
					listaIndustriaClientePrazoParaRemover: [],
				}

				$scope.representacaoCliente = {
					id: null,
					industria: {
						id: null,
						nome: null
					},
					usuario: {
						id: null,
						nome: null
					}
				}

				$scope.bloqueiaSalvar = (AuthenticationService.isVendedor() && $scope.listaRepresentacoesCliente.length < 1)

				$scope.tipoPessoa = {
					selecionado: null
				};

				$scope.industriaClientePrazoPadrao = {
					selecionado: undefined,
				}

				var usuario = $rootScope.globals.currentUser.user;

				function _base64ToArrayBuffer(base64) {
					var binary_string =  $window.atob(base64);
					var len = binary_string.length;
					var bytes = new Uint8Array( len );
					for (var i = 0; i < len; i++)        {
							bytes[i] = binary_string.charCodeAt(i);
					}
					return bytes.buffer;
				}

				function b64toBlob(b64Data, contentType, sliceSize) {
					return new Blob([_base64ToArrayBuffer(b64Data)], {type: contentType});
				}

				$scope.downloadArquivo = (nomeArquivo) => {
					service.downloadArquivo($scope.cliente.cpfCnpj, nomeArquivo, (data) => {
							/*let image = new Image();
							image.src = `data:image/jpg;base64,${data}`
							var w = $window.open("", '_blank');
							w.document.write(image.outerHTML);*/
							let a = document.createElement("a");
    					document.body.appendChild(a);
    					a.style = "display: none";
							var blob = b64toBlob(data, 'image/jpg');
							let url = $window.webkitURL.createObjectURL(blob);
							a.href = url;
							a.download = nomeArquivo;
							a.click();
							$window.webkitURL.revokeObjectURL(url);
					})
				}

				$scope.listaNomeBancos = service.buscaNomesBancos();
				if ($scope.cliente.nomeBanco != null) {
					$scope.banco.nome = $scope.cliente.nomeBanco;
				}

				service.getRepresentacoesUsuario(usuario.id, function (response) {
					$scope.listaRepresentacoes = response;
				});

				service.buscaVendedores(function (response) {
					$scope.vendedores = response;
				});

				service.buscaListaTipoPessoa(function (response) {
					$scope.listaTipoPessoa = response;
					if ($scope.cliente.idPessoa != null) {
						$scope.listaTipoPessoa.forEach(function (item, index) {
							if (item.id == $scope.cliente.idPessoa) {
								$scope.tipoPessoa.selecionado = item;
							}
						});
					} else {
						$scope.tipoPessoa.selecionado = $scope.listaTipoPessoa[1];
					}

				});

				$scope.verificaCliente = function () {
					const cpfCnpj = $scope.cliente.cpfCnpj
					if (!cpfCnpj) {
						return
					}
					ClientesCadastradosService.getClienteExistente(cpfCnpj, (response) => {
						if (response) {
							if (AuthenticationService.isVendedor() && !$scope.cliente.id) {
								NotificationService.alert('Cliente já cadastrado! Entre em contato com a administração.')
								$scope.naoEditavel = true
							} else {
								if (!$scope.cliente.id) {
									exibeModalConfirmacaoCliente(response)
								}
							}
						} else {
							$scope.naoEditavel = false
						}
					})
				}

				$scope.selecionaIndustria = function () {
					var industria = $scope.industria.selecionado.industria;
					var listaEncontrados = $.grep($scope.listaIndustriaCliente, function (e, i) {
						return e.idIndustria == industria.id;
					});
					$scope.industriaPrazo = {
						selecionado: undefined
					}
					$scope.industriaClientePrazoPadrao = {
						selecionado: undefined
					}

					if (listaEncontrados.length == 0) {
						$scope.industriaCliente = {
							idCliente: null,
							idIndustria: industria.id,
							codigo: null,
							limiteCredito: null,
							ativo: true,
							bloqueioVenda: false,
							nomeIndustria: industria.nome,
							removido: false,
							listaIndustriaClientePrazo: [],
							listaIndustriaClientePrazoParaRemover: [],
						}
						$scope.industriaPrazo = {
							selecionado: undefined,
						}
						$scope.industriaClientePrazoPadrao = {
							selecionado: undefined,
						}
					} else {
						$scope.industriaCliente = listaEncontrados[0];
						IndustriaClientePrazoService.getIndustriaClientePrazoPorIdIndustriaCliente($scope.industriaCliente.id, (result) => {
							$scope.industriaClientePrazo = result
						})
					}

					buscaRepresentacoesIndustria(industria)

					geraListaPrazosExistentes(industria)
				}

				function exibeModalConfirmacaoCliente(response) {
					var modalOptions = {
						closeButtonText: 'Não',
						actionButtonText: 'Sim',
						headerText: 'Confirmar',
						bodyText: 'O cliente com CNPJ ' + response.cpfCnpj + ' já possui cadastro! Deseja carregar seus dados?'
					};
					ModalService.showModal({}, modalOptions).then(() => {
						ClientesCadastradosService.clienteParaEditar = response
						$route.reload();
					}, function (result) {
						return
					});
				}

				function buscaRepresentacoesIndustria(industria) {
					service.getRepresentacoesIndustria(industria.id, function (response) {
						$scope.listaRepresentacoesVendedor = response;

						if (AuthenticationService.isVendedor()) {
							var representacoes = $.grep($scope.listaRepresentacoesVendedor, function (e, i) {
								return e.usuario.id == usuario.id;
							});
							if (representacoes && representacoes.length > 0) {
								$scope.representacaoVendedor.selecionado = representacoes[0];
							}
							if ($scope.representacaoVendedor.selecionado) {
								$scope.selecionaRepresentacaoVendedor();
							}
						}
					})
				}

				function geraListaPrazosExistentes(industria) {
					IndustriasService.getPrazosIndustria(industria.id, (result) => {
						if ($scope.industriaCliente.listaIndustriaClientePrazo !== null && $scope.industriaCliente.listaIndustriaClientePrazo.length > 0) {
							//GERA LISTA DE PRAZOS JA ADICIONADOS NA INDUSTRIA SELECIONADA
							$scope.industriaPrazo.selecionado = $.grep(result, (ePrazo) => {
								let exists = $.grep($scope.industriaCliente.listaIndustriaClientePrazo, (eIndustriaClientePrazo) => {
									return ePrazo.id === eIndustriaClientePrazo.idIndustriaPrazo
								})
								return exists.length !== 0
							})
							//BUSCA ITEM PADRAO SELECIONADO
							if ($scope.industriaCliente.listaIndustriaClientePrazo.length > 0) {
								let exists = $.grep($scope.industriaCliente.listaIndustriaClientePrazo, (eIndustriaClientePrazo) => {
									return eIndustriaClientePrazo.padrao === true
								})
								if (exists.length > 0) {
									$scope.industriaClientePrazoPadrao.selecionado = exists[0]
								}
							}
						}
						$scope.prazosIndustria = result
					})
				}

				$scope.selecionaRepresentacaoVendedor = function () {
					if (!$scope.listaRepresentacoesCliente) {
						$scope.listaRepresentacoesCliente = [];
					}

					var listaEncontrados = $.grep($scope.listaRepresentacoesCliente, function (e, i) {
						return e.idRepresentacao == $scope.representacaoVendedor.selecionado.id;
					});

					if (!listaEncontrados || listaEncontrados.length == 0) {
						$scope.representacaoCliente = {
							id: $scope.representacaoVendedor.selecionado.id,
							industria: {
								id: $scope.representacaoVendedor.selecionado.industria.id,
								nome: $scope.representacaoVendedor.selecionado.industria.nome
							},
							usuario: {
								id: $scope.representacaoVendedor.selecionado.usuario.id,
								nome: $scope.representacaoVendedor.selecionado.usuario.nome
							}
						}
					} else {
						$scope.representacaoCliente = listaEncontrados[0];
					}
				}

				$scope.alteraSelecaoIndustria = function (industria) {
					if (industria.selecionado) {
						adicionaIndustria(industria);
					} else {
						removeIndustria(industria);
					}
				}

				service.buscaEstados(function (response) {
					$scope.estados = response;
					if ($scope.cliente.estado == null) {
						$scope.estados.forEach(function (item, index) {
							if (item.sigla == 'RS') {
								$scope.estado.selecionado = item;
							}
						});
					} else {
						$scope.estados.forEach(function (item, index) {
							if (item.sigla == $scope.cliente.estado.sigla) {
								$scope.estado.selecionado = item;
							}
						});
					}
				});

				$scope.salvarCliente = function () {
					var banco = $scope.banco.nome;
					$scope.cliente.idPessoa = $scope.tipoPessoa.selecionado.id;
					$scope.cliente.listaIndustriaCliente = $scope.listaIndustriaCliente;
					$scope.cliente.listaRepresentacoesCliente = $scope.listaRepresentacoesCliente;
					$scope.cliente.estado = $scope.estado.selecionado;
					$scope.cliente.nomeBanco = $scope.banco.nome;

					if (AuthenticationService.isVendedor()) {
						$scope.cliente.pendenteRegistro = true
						salvar()
					} else {
						if ($scope.cliente.pendenteRegistro == true) {
							var modalOptions = {
								closeButtonText: 'Não',
								actionButtonText: 'Sim',
								headerText: 'Confirmar',
								bodyText: 'O cliente ' + $scope.cliente.razaoSocial + ' está mardo como pendente de cadastro. Deseja remover esta marcação?'
							};

							ModalService.showModal({}, modalOptions).then(function (result) {
								$scope.cliente.pendenteRegistro = false
								salvar()
							}, function (result) {
								salvar()
							});
						} else {
							salvar()
						}
					}
				}

				$scope.adicionaIndustriaCliente = function () {
					if (!$scope.listaIndustriaCliente) {
						$scope.listaIndustriaCliente = [];
					}
					let atualizou = false
					$scope.listaIndustriaCliente.forEach(function(item, index) {
						if(item.id == $scope.industriaCliente.id && item.removido) {
							$scope.listaIndustriaCliente[index].removido = false
							atualizou = true
						}
					})
					if(!atualizou) {
						$scope.listaIndustriaCliente.push($scope.industriaCliente);
					}
				}

				$scope.adicionaRepresentcaoVendedor = function () {
					if (!$scope.listaRepresentacoesCliente) {
						$scope.listaRepresentacoesCliente = [];
					}
					$scope.listaRepresentacoesCliente.push($scope.representacaoCliente)
					$scope.bloqueiaSalvar = (AuthenticationService.isVendedor() && $scope.listaRepresentacoesCliente.length < 1)
				}

				$scope.adicionaIndustriaClienteRepresentacaoVendedor = function () {
					$scope.adicionaIndustriaCliente();
					$scope.adicionaRepresentcaoVendedor();
				}

				$scope.validaDocumento = function (cpfCnpj) {
					if (cpfCnpj.length == 14) {
						return service.validarCnpj(cpfCnpj);
					} else {
						return false;
					}
				}

				$scope.removeRepresentacao = function (representacao) {
					$.each($scope.listaRepresentacoesCliente, function (i) {
						if ($scope.listaRepresentacoesCliente[i].id === representacao.id) {
							$scope.listaRepresentacoesCliente.splice(i, 1);
							$scope.bloqueiaSalvar = (AuthenticationService.isVendedor() && $scope.listaRepresentacoesCliente.length < 1)
							return false;
						}
					});
				}

				$scope.removerIndustriaCliente = function (industriaCliente) {
					$.each($scope.listaIndustriaCliente, function (i) {
						if ($scope.listaIndustriaCliente[i].id === industriaCliente.id) {
							if(industriaCliente.id === undefined) {
								$scope.listaIndustriaCliente.splice(i, 1);
							} else {
								$scope.listaIndustriaCliente[i].removido = true;
							}
							return false;
						}
					});
				}

				$scope.voltar = function () {
					window.history.back();
				}

				$scope.podeSalvar = function () {
					if (AuthenticationService.isVendedor()) {
						if ($scope.listaRepresentacoesCliente && $scope.listaRepresentacoesCliente.length > 0) {
							return true
						} else {
							return false
						}
					} else {
						return true
					}
				}

				$scope.selecionaIndustriaPrazo = (item) => {
					let industriaClientePrazo = {
						id: undefined,
						idIndustriaCliente: undefined,
						idIndustriaPrazo: item.id,
						descricaoIndustriaPrazo: item.descricao,
						padrao: undefined,
					}
					$scope.industriaCliente.listaIndustriaClientePrazo.push(industriaClientePrazo)
				}

				$scope.removeIndustriaPrazo = (item) => {

					const itemRemovido = $.grep($scope.industriaCliente.listaIndustriaClientePrazo, (e) => {
						return e.idIndustriaPrazo === item.id;
					})

					$scope.industriaCliente.listaIndustriaClientePrazo = $.grep($scope.industriaCliente.listaIndustriaClientePrazo, (e) => {
						return e.idIndustriaPrazo !== item.id;
					})

					if (itemRemovido[0] && itemRemovido[0].padrao) {
						$scope.industriaClientePrazoPadrao.selecionado = undefined
					}

					if (itemRemovido[0] && itemRemovido[0].id) {
						$scope.industriaCliente.listaIndustriaClientePrazoParaRemover.push(itemRemovido[0])
					}
				}

				$scope.removerPadrao = () => {
					$scope.industriaCliente.listaIndustriaClientePrazo.forEach((e, i, arr) => {
						e.padrao = undefined
						$scope.industriaClientePrazoPadrao.selecionado = undefined
					})
				}

				$scope.buscaDescricaoResumidaPrazo = (industriaCliente) => {
					let descr = ""
					industriaCliente.listaIndustriaClientePrazo.forEach((e, i, arr) => {
						if (i === arr.length - 1) {
							descr += (e.padrao ? `<strong>${e.descricaoIndustriaPrazo}</strong>` : e.descricaoIndustriaPrazo)
						} else {
							descr += (e.padrao ? `<strong>${e.descricaoIndustriaPrazo}</strong>, ` : e.descricaoIndustriaPrazo + ", ")
						}
					})
					return $sce.trustAsHtml(descr)
				}

				$scope.selecionaIndustriaPrazoPadrao = function () {
					$scope.industriaCliente.listaIndustriaClientePrazo.forEach((e, i, arr) => {
						if (e.id == $scope.industriaClientePrazoPadrao.selecionado.id && e.idIndustriaPrazo == $scope.industriaClientePrazoPadrao.selecionado.idIndustriaPrazo) {
							e.padrao = true
						} else {
							e.padrao = false
						}
					})
				}

				$scope.uploadArquivoCliente = function () {
					var files = $scope.arquivoCliente;
					if (!files) {
						NotificationService.alert("Nenhum arquivo selecionado")
					}
					blockUI.start('Carregando Arquivo, Aguarde...');
					service.uploadArquivoCliente(files, $scope.cliente.cpfCnpj, function (result) {
						adicionaArquivosCliente(result)
						$scope.arquivoCliente = null
						blockUI.stop();
					}, function (error) {
						console.log('ERR')
						blockUI.stop();
					});
				}

				function adicionaArquivosCliente(arquivosEnviados) {
					if (arquivosEnviados) {
						if (!$scope.cliente.arquivos) {
							$scope.cliente.arquivos = []
						}
						arquivosEnviados.forEach((item, index) => {
							const arquivoClienteDto = {
								id: null,
								idCliente: $scope.cliente.id,
								nomeArquivo: item.nomeArquivo
							}
							$scope.cliente.arquivos.push(arquivoClienteDto)
						})
					}
				}

				function salvar() {
					service.salvarCliente($scope.cliente, function (result) {
						NotificationService.success(`Cliente ${result.razaoSocial} cadastrado com sucesso!`);
						$location.path('/listaClientes');
					})
				}

			}]);
