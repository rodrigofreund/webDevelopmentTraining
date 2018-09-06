'use strict';

var ClienteModulo = angular.module('cliente.module');

ClienteModulo.component('cadastroClienteComponent', {
  templateUrl: 'modules/cliente/components/cadastro/views/cadastroCliente.html',
  bindings: {
    cliente: '<',
    listaIndustriaCliente: '<'
  },
  controllerAs: 'ctrl',
  /*
  $scope,
				$rootScope,
				$location,
				$sce,
				$route,
				$window,
				service,
				ClientesCadastradosService,
				IndustriasService,
				AuthenticationService,
				blockUI,
				ModalService,
				IndustriaClientePrazoService,
				NotificationService
  */
  controller: function (NotificationService, ModalService, ClienteService) {
    var ctrl = this;

    function _base64ToArrayBuffer(base64) {
      var binary_string = $window.atob(base64);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes.buffer;
    }

    function b64toBlob(b64Data, contentType) {
      return new Blob([_base64ToArrayBuffer(b64Data)], { type: contentType });
    }

    ctrl.downloadArquivo = (nomeArquivo) => {
      service.downloadArquivo(ctrl.cliente.cpfCnpj, nomeArquivo, (data) => {
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

    ctrl.listaNomeBancos = service.buscaNomesBancos();
    if (ctrl.cliente.nomeBanco != null) {
      ctrl.banco.nome = ctrl.cliente.nomeBanco;
    }

    service.getRepresentacoesUsuario(usuario.id, function (response) {
      ctrl.listaRepresentacoes = response;
    });

    service.buscaVendedores(function (response) {
      ctrl.vendedores = response;
    });

    service.buscaListaTipoPessoa(function (response) {
      ctrl.listaTipoPessoa = response;
      if (ctrl.cliente.idPessoa != null) {
        ctrl.listaTipoPessoa.forEach(function (item, index) {
          if (item.id == ctrl.cliente.idPessoa) {
            ctrl.tipoPessoa.selecionado = item;
          }
        });
      } else {
        ctrl.tipoPessoa.selecionado = ctrl.listaTipoPessoa[1];
      }

    });

    ctrl.verificaCliente = function () {
      const cpfCnpj = ctrl.cliente.cpfCnpj
      if (!cpfCnpj) {
        return
      }
      ClientesCadastradosService.getClienteExistente(cpfCnpj, (response) => {
        if (response) {
          if (AuthenticationService.isVendedor() && !ctrl.cliente.id) {
            NotificationService.alert('Cliente já cadastrado! Entre em contato com a administração.')
            ctrl.naoEditavel = true
          } else {
            if (!ctrl.cliente.id) {
              exibeModalConfirmacaoCliente(response)
            }
          }
        } else {
          ctrl.naoEditavel = false
        }
      })
    }

    ctrl.selecionaIndustria = function () {
      var industria = ctrl.industria.selecionado.industria;
      var listaEncontrados = $.grep(ctrl.listaIndustriaCliente, function (e, i) {
        return e.idIndustria == industria.id;
      });
      ctrl.industriaPrazo = {
        selecionado: undefined
      }
      ctrl.industriaClientePrazoPadrao = {
        selecionado: undefined
      }

      if (listaEncontrados.length == 0) {
        ctrl.industriaCliente = {
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
        ctrl.industriaPrazo = {
          selecionado: undefined,
        }
        ctrl.industriaClientePrazoPadrao = {
          selecionado: undefined,
        }
      } else {
        ctrl.industriaCliente = listaEncontrados[0];
        IndustriaClientePrazoService.getIndustriaClientePrazoPorIdIndustriaCliente(ctrl.industriaCliente.id, (result) => {
          ctrl.industriaClientePrazo = result
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
        ctrl.listaRepresentacoesVendedor = response;

        if (AuthenticationService.isVendedor()) {
          var representacoes = $.grep(ctrl.listaRepresentacoesVendedor, function (e, i) {
            return e.usuario.id == usuario.id;
          });
          if (representacoes && representacoes.length > 0) {
            ctrl.representacaoVendedor.selecionado = representacoes[0];
          }
          if (ctrl.representacaoVendedor.selecionado) {
            ctrl.selecionaRepresentacaoVendedor();
          }
        }
      })
    }

    function geraListaPrazosExistentes(industria) {
      IndustriasService.getPrazosIndustria(industria.id, (result) => {
        if (ctrl.industriaCliente.listaIndustriaClientePrazo !== null && ctrl.industriaCliente.listaIndustriaClientePrazo.length > 0) {
          //GERA LISTA DE PRAZOS JA ADICIONADOS NA INDUSTRIA SELECIONADA
          ctrl.industriaPrazo.selecionado = $.grep(result, (ePrazo) => {
            let exists = $.grep(ctrl.industriaCliente.listaIndustriaClientePrazo, (eIndustriaClientePrazo) => {
              return ePrazo.id === eIndustriaClientePrazo.idIndustriaPrazo
            })
            return exists.length !== 0
          })
          //BUSCA ITEM PADRAO SELECIONADO
          if (ctrl.industriaCliente.listaIndustriaClientePrazo.length > 0) {
            let exists = $.grep(ctrl.industriaCliente.listaIndustriaClientePrazo, (eIndustriaClientePrazo) => {
              return eIndustriaClientePrazo.padrao === true
            })
            if (exists.length > 0) {
              ctrl.industriaClientePrazoPadrao.selecionado = exists[0]
            }
          }
        }
        ctrl.prazosIndustria = result
      })
    }

    ctrl.selecionaRepresentacaoVendedor = function () {
      if (!ctrl.listaRepresentacoesCliente) {
        ctrl.listaRepresentacoesCliente = [];
      }

      var listaEncontrados = $.grep(ctrl.listaRepresentacoesCliente, function (e, i) {
        return e.idRepresentacao == ctrl.representacaoVendedor.selecionado.id;
      });

      if (!listaEncontrados || listaEncontrados.length == 0) {
        ctrl.representacaoCliente = {
          id: ctrl.representacaoVendedor.selecionado.id,
          industria: {
            id: ctrl.representacaoVendedor.selecionado.industria.id,
            nome: ctrl.representacaoVendedor.selecionado.industria.nome
          },
          usuario: {
            id: ctrl.representacaoVendedor.selecionado.usuario.id,
            nome: ctrl.representacaoVendedor.selecionado.usuario.nome
          }
        }
      } else {
        ctrl.representacaoCliente = listaEncontrados[0];
      }
    }

    ctrl.alteraSelecaoIndustria = function (industria) {
      if (industria.selecionado) {
        adicionaIndustria(industria);
      } else {
        removeIndustria(industria);
      }
    }

    service.buscaEstados(function (response) {
      ctrl.estados = response;
      if (ctrl.cliente.estado == null) {
        ctrl.estados.forEach(function (item, index) {
          if (item.sigla == 'RS') {
            ctrl.estado.selecionado = item;
          }
        });
      } else {
        ctrl.estados.forEach(function (item, index) {
          if (item.sigla == ctrl.cliente.estado.sigla) {
            ctrl.estado.selecionado = item;
          }
        });
      }
    });

    ctrl.salvarCliente = function () {
      var banco = ctrl.banco.nome;
      ctrl.cliente.idPessoa = ctrl.tipoPessoa.selecionado.id;
      ctrl.cliente.listaIndustriaCliente = ctrl.listaIndustriaCliente;
      ctrl.cliente.listaRepresentacoesCliente = ctrl.listaRepresentacoesCliente;
      ctrl.cliente.estado = ctrl.estado.selecionado;
      ctrl.cliente.nomeBanco = ctrl.banco.nome;

      if (AuthenticationService.isVendedor()) {
        ctrl.cliente.pendenteRegistro = true
        salvar()
      } else {
        if (ctrl.cliente.pendenteRegistro == true) {
          var modalOptions = {
            closeButtonText: 'Não',
            actionButtonText: 'Sim',
            headerText: 'Confirmar',
            bodyText: 'O cliente ' + ctrl.cliente.razaoSocial + ' está mardo como pendente de cadastro. Deseja remover esta marcação?'
          };

          ModalService.showModal({}, modalOptions).then(function (result) {
            ctrl.cliente.pendenteRegistro = false
            salvar()
          }, function (result) {
            salvar()
          });
        } else {
          salvar()
        }
      }
    }

    ctrl.adicionaIndustriaCliente = function () {
      if (!ctrl.listaIndustriaCliente) {
        ctrl.listaIndustriaCliente = [];
      }
      let atualizou = false
      ctrl.listaIndustriaCliente.forEach(function (item, index) {
        if (item.id == ctrl.industriaCliente.id && item.removido) {
          ctrl.listaIndustriaCliente[index].removido = false
          atualizou = true
        }
      })
      if (!atualizou) {
        ctrl.listaIndustriaCliente.push(ctrl.industriaCliente);
      }
    }

    ctrl.adicionaRepresentcaoVendedor = function () {
      if (!ctrl.listaRepresentacoesCliente) {
        ctrl.listaRepresentacoesCliente = [];
      }
      ctrl.listaRepresentacoesCliente.push(ctrl.representacaoCliente)
      ctrl.bloqueiaSalvar = (AuthenticationService.isVendedor() && ctrl.listaRepresentacoesCliente.length < 1)
    }

    ctrl.adicionaIndustriaClienteRepresentacaoVendedor = function () {
      ctrl.adicionaIndustriaCliente();
      ctrl.adicionaRepresentcaoVendedor();
    }

    ctrl.validaDocumento = function (cpfCnpj) {
      if (cpfCnpj.length == 14) {
        return service.validarCnpj(cpfCnpj);
      } else {
        return false;
      }
    }

    ctrl.removeRepresentacao = function (representacao) {
      $.each(ctrl.listaRepresentacoesCliente, function (i) {
        if (ctrl.listaRepresentacoesCliente[i].id === representacao.id) {
          ctrl.listaRepresentacoesCliente.splice(i, 1);
          ctrl.bloqueiaSalvar = (AuthenticationService.isVendedor() && ctrl.listaRepresentacoesCliente.length < 1)
          return false;
        }
      });
    }

    ctrl.removerIndustriaCliente = function (industriaCliente) {
      $.each(ctrl.listaIndustriaCliente, function (i) {
        if (ctrl.listaIndustriaCliente[i].id === industriaCliente.id) {
          if (industriaCliente.id === undefined) {
            ctrl.listaIndustriaCliente.splice(i, 1);
          } else {
            ctrl.listaIndustriaCliente[i].removido = true;
          }
          return false;
        }
      });
    }

    ctrl.voltar = function () {
      window.history.back();
    }

    ctrl.podeSalvar = function () {
      if (AuthenticationService.isVendedor()) {
        if (ctrl.listaRepresentacoesCliente && ctrl.listaRepresentacoesCliente.length > 0) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    }

    ctrl.selecionaIndustriaPrazo = (item) => {
      let industriaClientePrazo = {
        id: undefined,
        idIndustriaCliente: undefined,
        idIndustriaPrazo: item.id,
        descricaoIndustriaPrazo: item.descricao,
        padrao: undefined,
      }
      ctrl.industriaCliente.listaIndustriaClientePrazo.push(industriaClientePrazo)
    }

    ctrl.removeIndustriaPrazo = (item) => {

      const itemRemovido = $.grep(ctrl.industriaCliente.listaIndustriaClientePrazo, (e) => {
        return e.idIndustriaPrazo === item.id;
      })

      ctrl.industriaCliente.listaIndustriaClientePrazo = $.grep(ctrl.industriaCliente.listaIndustriaClientePrazo, (e) => {
        return e.idIndustriaPrazo !== item.id;
      })

      if (itemRemovido[0] && itemRemovido[0].padrao) {
        ctrl.industriaClientePrazoPadrao.selecionado = undefined
      }

      if (itemRemovido[0] && itemRemovido[0].id) {
        ctrl.industriaCliente.listaIndustriaClientePrazoParaRemover.push(itemRemovido[0])
      }
    }

    ctrl.removerPadrao = () => {
      ctrl.industriaCliente.listaIndustriaClientePrazo.forEach((e, i, arr) => {
        e.padrao = undefined
        ctrl.industriaClientePrazoPadrao.selecionado = undefined
      })
    }

    ctrl.buscaDescricaoResumidaPrazo = (industriaCliente) => {
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

    ctrl.selecionaIndustriaPrazoPadrao = function () {
      ctrl.industriaCliente.listaIndustriaClientePrazo.forEach((e, i, arr) => {
        if (e.id == ctrl.industriaClientePrazoPadrao.selecionado.id && e.idIndustriaPrazo == ctrl.industriaClientePrazoPadrao.selecionado.idIndustriaPrazo) {
          e.padrao = true
        } else {
          e.padrao = false
        }
      })
    }

    ctrl.uploadArquivoCliente = function () {
      var files = ctrl.arquivoCliente;
      if (!files) {
        NotificationService.alert("Nenhum arquivo selecionado")
      }
      blockUI.start('Carregando Arquivo, Aguarde...');
      service.uploadArquivoCliente(files, ctrl.cliente.cpfCnpj, function (result) {
        adicionaArquivosCliente(result)
        ctrl.arquivoCliente = null
        blockUI.stop();
      }, function (error) {
        console.log('ERR')
        blockUI.stop();
      });
    }

    function adicionaArquivosCliente(arquivosEnviados) {
      if (arquivosEnviados) {
        if (!ctrl.cliente.arquivos) {
          ctrl.cliente.arquivos = []
        }
        arquivosEnviados.forEach((item, index) => {
          const arquivoClienteDto = {
            id: null,
            idCliente: ctrl.cliente.id,
            nomeArquivo: item.nomeArquivo
          }
          ctrl.cliente.arquivos.push(arquivoClienteDto)
        })
      }
    }

    function salvar() {
      service.salvarCliente(ctrl.cliente, function (result) {
        NotificationService.success(`Cliente ${result.razaoSocial} cadastrado com sucesso!`);
        $location.path('/listaClientes');
      })
    }

    this.$onInit = function () {
      ctrl.auth = $scope.$parent.$resolve.auth;
      ctrl.listaRepresentacoesVendedor = [];
      ctrl.listaRepresentacoesCliente = [];
      ctrl.listaIndustriaCliente = [];
      ctrl.industriaPrazo = {
        selecionado: undefined,
      }

      if (ctrl.cliente) {
        ctrl.listaRepresentacoesCliente = ctrl.cliente.listaRepresentacoesCliente;
        ClienteService.buscaIndustriaCliente(cliente.id).then((response) => {
          ctrl.listaIndustriaCliente = response;
        });
        if (ctrl.cliente.excluido) {
          NotificationService.alert('Este cliente está excluído. Efetue as alterações e salve o cadastro para reativá-lo.')
        }
      } else {
        ctrl.cliente = {
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

      ctrl.banco = {
        nome: null
      };

      ctrl.arquivoCliente = undefined

      ctrl.representacaoVendedor = {
        selecionado: null
      };

      ctrl.industria = {
        selecionado: null
      };

      ctrl.estado = {
        selecionado: null
      }

      ctrl.industriaCliente = {
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

      ctrl.representacaoCliente = {
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

      ctrl.bloqueiaSalvar = (AuthenticationService.isVendedor() && ctrl.listaRepresentacoesCliente.length < 1)

      ctrl.tipoPessoa = {
        selecionado: null
      };

      ctrl.industriaClientePrazoPadrao = {
        selecionado: undefined,
      }

      ctrl.usuario = $rootScope.globals.currentUser.user;
    };
  }
});