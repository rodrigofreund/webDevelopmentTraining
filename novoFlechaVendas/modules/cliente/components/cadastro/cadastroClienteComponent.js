'use strict';

var ClienteModulo = angular.module('cliente.module');

ClienteModulo.component('cadastroClienteComponent', {
  templateUrl: 'modules/cliente/components/cadastro/cadastroCliente.html',
  bindings: {
    cliente: '<',
    listaIndustriaCliente: '<'
  },
  controllerAs: 'ctrl',
  controller: function ($scope,
                        NotificationService,
                        ModalService,
                        ClienteService,
                        FileService,
                        UsuarioService,
                        $log,
                        IndustriaService,
                        IndustriaPrazoService,
                        $sce,
                        $state,
                        $window) {

    var ctrl = this;

    ctrl.verificaCliente = function () {
      const cpfCnpj = ctrl.cliente.cpfCnpj
      if (!cpfCnpj) {
        return;
      }
      ClienteService.getClientePorCnpj(cpfCnpj, null, null, null, null, false).then(response => {
        if (response) {
          if (ctrl.auth.isVendedor && !ctrl.cliente.id) {
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
      let listaEncontrados = $.grep(ctrl.listaIndustriaCliente, function (e, i) {
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
          idIndustria: ctrl.industria.selecionado.idIndustria,
          codigo: null,
          limiteCredito: null,
          ativo: true,
          bloqueioVenda: false,
          nomeIndustria: ctrl.industria.selecionado.nomeIndustria,
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

      buscaRepresentacoesIndustria(ctrl.industria.selecionado.idIndustria)

      geraListaPrazosExistentes(ctrl.industria.selecionado.idIndustria)
    }

    ctrl.downloadArquivo = function (nomeArquivo) {
      ClienteService.downloadArquivoCliente(ctrl.cliente.cpfCnpj, nomeArquivo).then(data => {
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var blob = FileService.b64toBlob(data, 'image/jpg');
        let url = $window.webkitURL.createObjectURL(blob);
        a.href = url;
        a.download = nomeArquivo;
        a.click();
        $window.webkitURL.revokeObjectURL(url);
      })
    }

    function exibeModalConfirmacaoCliente(response) {
      var modalOptions = {
        closeButtonText: 'Não',
        actionButtonText: 'Sim',
        headerText: 'Confirmar',
        bodyText: 'O cliente com CNPJ ' + response.cpfCnpj + ' já possui cadastro! Deseja carregar seus dados?'
      };
      ModalService.showModal({}, modalOptions).then(() => {
        $state.go('main.cliente.edicao', {})
      }, function (result) {
        return
      });
    }

    function buscaRepresentacoesIndustria(idIndustria) {
      IndustriaService.buscaRepresentacoesIndustria(idIndustria).then(function (response) {
        ctrl.listaRepresentacoesVendedor = response;

        if (ctrl.auth.isVendedor) {
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

    function geraListaPrazosExistentes(idIndustria) {
      IndustriaPrazoService.getIndustriaPrazo(idIndustria).then(result => {
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
    ctrl.salvarCliente = function () {
      var banco = ctrl.banco.nome;
      ctrl.cliente.idPessoa = ctrl.tipoPessoa.selecionado.id;
      ctrl.cliente.listaIndustriaCliente = ctrl.listaIndustriaCliente;
      ctrl.cliente.listaRepresentacoesCliente = ctrl.listaRepresentacoesCliente;
      ctrl.cliente.estado = ctrl.estado.selecionado;
      ctrl.cliente.nomeBanco = ctrl.banco.nome;

      if (validate) {
        if (ctrl.auth.isVendedor) {
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
      } else {
        NotificationService.alert('Dados necessários não foram preenchidos');
        ctrl.trySubmit = true;
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
      ctrl.bloqueiaSalvar = (ctrl.auth.isVendedor && ctrl.listaRepresentacoesCliente.length < 1)
    }

    ctrl.adicionaIndustriaClienteRepresentacaoVendedor = function () {
      ctrl.adicionaIndustriaCliente();
      ctrl.adicionaRepresentcaoVendedor();
    }

    $scope.validaDocumento = function (cpfCnpj) {
      if (cpfCnpj.length == 14) {
        return ClienteService.validarCnpj(cpfCnpj);
      } else {
        return false;
      }
    }

    ctrl.removeRepresentacao = function (representacao) {
      $.each(ctrl.listaRepresentacoesCliente, function (i) {
        if (ctrl.listaRepresentacoesCliente[i].id === representacao.id) {
          ctrl.listaRepresentacoesCliente.splice(i, 1);
          ctrl.bloqueiaSalvar = (ctrl.auth.isVendedor && ctrl.listaRepresentacoesCliente.length < 1)
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
      if (ctrl.auth.isVendedor) {
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
      ClienteService.uploadArquivoCliente(files, ctrl.cliente.cpfCnpj).then(function (result) {
        adicionaArquivosCliente(result)
        NotificationService.success("Arquivo adicionado com sucesso!");
        ctrl.arquivoCliente = null
      }, function (error) {
        NotificationService.error("Nenhum arquivo selecionado")
      });
    }

    function validate() {
      return !$scope.formDadosPedido.$invalid;
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
      ClienteService.salvarCliente(ctrl.cliente).then(function (result) {
        NotificationService.success(`Cliente ${result.razaoSocial} cadastrado com sucesso!`);
        $state.go('main.cliente.pesquisa');
      })
    }

    ctrl.listaNomeBancos = ClienteService.buscaNomesBancos();

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

      ctrl.bloqueiaSalvar = (ctrl.auth.isVendedor && ctrl.listaRepresentacoesCliente.length < 1)

      ctrl.tipoPessoa = {
        selecionado: null
      };

      ctrl.industriaClientePrazoPadrao = {
        selecionado: undefined,
      }

      let usuario = ctrl.auth;

      if (ctrl.cliente.nomeBanco != null) {
        ctrl.banco.nome = ctrl.cliente.nomeBanco;
      }

      UsuarioService.buscaUsuarioCadastroDto(usuario.id).then((response) => {
        ctrl.listaRepresentacoes = response.representacoes;
        $log.log('response.representacoes: ', response.representacoes)
      });

      UsuarioService.buscaUsuarios().then((response) => {
        ctrl.vendedores = response;
      });

      ClienteService.buscaListaTipoPessoa().then(function (response) {
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

      ClienteService.buscaEstados().then(function (response) {
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
    };
  }
});