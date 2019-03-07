'use strict';

var ClienteModulo = angular.module('cliente.module');

ClienteModulo.component('cadastroBasicoClienteComponent', {
  templateUrl: 'modules/cliente/components/cadastroBasico/cadastroBasicoCliente.html',
  bindings: {
    cliente: '<',
    janela: '<',
    listaRepresentacoes: '<'
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

    $scope.forms = {};

    /*VERIFICA SE O CLIENTE EXISTE APÓS ADICIONAR O CNPJ */
    ctrl.verificaCliente = function () {
      const cpfCnpj = ctrl.cliente.cpfCnpj
      if (!cpfCnpj) {
        return;
      }
      ClienteService.getClientePorCnpj(cpfCnpj, null, null, null, null, false).then(response => {
        if (response) {
          if (!ctrl.cliente.id) {
            NotificationService.alert('Cliente já cadastrado! Entre em contato com a administração.');
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

    // ADICIONA UM REGISTRO REPRESENTACAO - CLIENTE
    ctrl.adicionaRepresentacaoVendedor = function () {
      // CRIAR ASSOCIACAO A PARTIR DE ctrl.representacaoIndustria E ctrl.representacaoVendedor
      if (!ctrl.listaRepresentacoesCliente) {
        ctrl.listaRepresentacoesCliente = [];
      }
      let representacao = {
        industria : ctrl.representacaoIndustria,
        usuario : ctrl.representacaoVendedor.usuario
      }
      ctrl.listaRepresentacoesCliente.push(representacao)
    }

    ctrl.salvarRepresentacaoCliente = function() {
      ctrl.cliente.listaRepresentacoesCliente = ctrl.listaRepresentacoesCliente;
      ClienteService.salvarRepresentacaoCliente(ctrl.cliente).then(function(response) {
        NotificationService.alert('Representantes atualizados com sucesso.');
      })
    }

    ctrl.selecionaIndustria = function () {
      let listaEncontrados = $.grep(ctrl.listaIndustriaCliente, function (e, i) {
        return e.idIndustria == ctrl.industria.selecionado.id;
      });
      ctrl.industriaPrazo = {
        selecionado: undefined
      }
      ctrl.industriaClientePrazoPadrao = {
        selecionado: undefined
      }

      if (listaEncontrados.length == 0) {
        ctrl.industriaCliente = {
          idCliente: ctrl.cliente.id,
          idIndustria: ctrl.industria.selecionado.id,
          codigo: null,
          limiteCredito: null,
          ativo: true,
          bloqueioVenda: false,
          nomeIndustria: ctrl.industria.selecionado.nome,
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
        /*
        IndustriaClientePrazoService.getIndustriaClientePrazoPorIdIndustriaCliente(ctrl.industriaCliente.id).then((result) => {
          ctrl.industriaClientePrazo = result
        })
        */
      }

      buscaRepresentacoesIndustria(ctrl.industria.selecionado.id)

      geraListaPrazosExistentes(ctrl.industria.selecionado.id)
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
        $state.go('main.cliente.edicao',  {'cnpj':response.cpfCnpj, 'janela':ABA_CADASTRO_CLIENTE.DADOS_PESSOAIS})
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

    ctrl.alteraSelecaoIndustria = function (industria) {
      if (industria.selecionado) {
        adicionaIndustria(industria);
      } else {
        removeIndustria(industria);
      }
    }

    ctrl.salvarCliente = function () {
      ctrl.cliente.idPessoa = ctrl.tipoPessoa.selecionado.id;
      ctrl.cliente.listaIndustriaCliente = ctrl.listaIndustriaCliente;
      ctrl.cliente.listaRepresentacoesCliente = ctrl.listaRepresentacoesCliente;
      ctrl.cliente.estado = ctrl.estado.selecionado;
      ctrl.cliente.nomeBanco = ctrl.banco.nome;
      if (isFormCadastroClienteValido()) {
        ctrl.cliente.pendenteRegistro = true
        salvar()
      } else {
        NotificationService.alert('Dados necessários não foram preenchidos');
        ctrl.trySubmit = true;
      }
    }

    ctrl.adicionaIndustriaCliente = function () {
      if (!ctrl.listaIndustriaCliente) {
        ctrl.listaIndustriaCliente = [];
      }
      let adicionar = true
      ctrl.listaIndustriaCliente.forEach(function (item) {
        if (item.idIndustria == ctrl.industriaCliente.idIndustria) {
          adicionar = false
        }
      })
      if (adicionar) {
        ctrl.listaIndustriaCliente.push(ctrl.industriaCliente);
      } else {
        NotificationService.alert('Indústria já adicionada. Pressione SALVAR para salvar as alterações.');
      }
    }

    ctrl.adicionaIndustriaClienteRepresentacaoVendedor = function () {
      ctrl.adicionaIndustriaCliente();
    }

    $scope.validaDocumento = function (cpfCnpj) {
      if (cpfCnpj.length == 14) {
        return ClienteService.validarCnpj(cpfCnpj);
      } else {
        return false;
      }
    }

    ctrl.removerIndustriaCliente = function (industriaCliente) {
      // Se industria cliente possuir id deve remover na base
      if (industriaCliente.id) {
        ClienteService.excluirIndustriaCliente(industriaCliente).then(function () {
          removeItemIndustriaClienteLista(industriaCliente);
        })
      } else {
        removeItemIndustriaClienteLista(industriaCliente);
      }
    }

    function removeItemIndustriaClienteLista(industriaCliente) {
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

    ctrl.salvarIndustriaCliente = function () {
      ClienteService.salvarIndustriaCliente(ctrl.listaIndustriaCliente).then(function (result) {
        NotificationService.success('Indústrias atualizadas com sucesso!');
        $state.go('main.cliente.edicao', { 'cnpj': ctrl.cliente.cpfCnpj, 'janela': ABA_CADASTRO_CLIENTE.ASSOCIAR_VENDEDOR }, {reload: true});
      })
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

    function isFormCadastroClienteValido() {
      let form = $scope.forms.formCadastroCliente;
      return form.$valid;
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
        result.listaRepresentacoesCliente = adicionaRepresentacoes(result)
        ClienteService.salvarRepresentacaoCliente(result).then(function() {
          NotificationService.success(`Cliente ${result.razaoSocial} cadastrado com sucesso!`);
          $state.go('main.cliente.edicao', { 'cnpj': ctrl.cliente.cpfCnpj, 'janela': ABA_CADASTRO_CLIENTE.ASSOCIAR_INDUSTRIA }, {reload: true});
        })
      })
    }

    function adicionaRepresentacoes (cliente) {
      let listaRepresentacoesCliente = []
      ctrl.listaRepresentacoes.representacoes.forEach(function(item) {
        listaRepresentacoesCliente.push({
          industria : {'idIndustria' : item.idIndustria},
          usuario : {'idUsuario' : item.idUsuario}
        });
      })
      return listaRepresentacoesCliente
    }

    ctrl.updateActiveTab = function () {
      ctrl.active = ctrl.janela;
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
      ctrl.updateActiveTab();

      if (ctrl.cliente) {
        ctrl.listaRepresentacoesCliente = ctrl.cliente.listaRepresentacoesCliente;
        ClienteService.buscaIndustriaCliente(ctrl.cliente.id).then((response) => {
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

      ctrl.tipoPessoa = {
        selecionado: null
      };

      ctrl.industriaClientePrazoPadrao = {
        selecionado: undefined,
      }

      if (ctrl.cliente.nomeBanco != null) {
        ctrl.banco.nome = ctrl.cliente.nomeBanco;
      }

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