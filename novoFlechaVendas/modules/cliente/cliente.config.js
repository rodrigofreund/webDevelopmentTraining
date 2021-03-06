'use strict';

var ClienteModulo = angular.module('cliente.module');

ClienteModulo.config(function ($stateProvider) {
  var cliente = {
    name: 'main.cliente',
    abstract: true,
    url: '/cliente',
  };
  var pesquisaCliente = {
    name: 'main.cliente.pesquisa',
    url: '/pesquisa',
    component: 'pesquisaClienteComponent',
    params: {
      pendenteRegistro: false
    },
    resolve: {
      listaVendedor: (auth, UsuarioService) => {
        let vendedores = []
        if (auth.vendedor) {
          vendedores.push(auth);
          return vendedores;
        } else {
          return UsuarioService.buscaUsuarios();
        }
      },
      filter: (auth, $stateParams) => {
        let filter = {
          newPage: 1,
          pageSize: 20,
          idUsuario: auth.id,
          pendenteRegistro: $stateParams.pendenteRegistro
        }
        return filter
      }
    }
  }
  var cadastroCliente = {
    name: 'main.cliente.cadastro',
    url: 'cadastro',
    component: 'cadastroClienteComponent',
    resolve: {
      janela: function () {
        return ABA_CADASTRO_CLIENTE.DADOS_PESSOAIS;
      },
      listaRepresentacoes: function (UsuarioService, auth) {
        
      }
    }
  };
  var cadastroBasicoCliente = {
    name: 'main.cliente.cadastrobasico',
    url: 'cadastroBasico',
    component: 'cadastroBasicoClienteComponent',
    resolve: {
      janela: function () {
        return ABA_CADASTRO_CLIENTE.DADOS_PESSOAIS;
      },
      listaRepresentacoes: function (UsuarioService, auth) {
        return UsuarioService.buscaUsuarioCadastroDto(auth.id)
      }
    }
  };
  var edicaoCliente = {
    name: 'main.cliente.edicao',
    url: '/edicao/:cnpj/:janela',
    component: 'cadastroClienteComponent',
    resolve: {
      cliente: function ($q, ClienteService, $stateParams) {
        const deferred = $q.defer();
        ClienteService.getClientePorCnpj($stateParams.cnpj).then(function (clienteDto) {
          deferred.resolve(clienteDto);
        }, function (error) {
          deferred.reject("Cliente não encontrado!");
        })
        return deferred.promise;
      },
      janela: function ($stateParams) {
        return !!$stateParams.janela ? parseInt($stateParams.janela) : ABA_CADASTRO_CLIENTE.DADOS_PESSOAIS;
      },
      listaRepresentacoes: function (auth, IndustriaService, $q) {
        const deferred = $q.defer();
        if (auth.vendedor) {
          IndustriaService.getIndustriasByIdUsuario(auth.id).then(function (result) {
            deferred.resolve(result);
          },
            function (error) {
              deferred.reject(error);
            });
        }
        if (auth.administrador) {
          IndustriaService.getIndustrias().then(function (result) {
            deferred.resolve(result);
          },
            function (error) {
              deferred.reject(error);
            })
        }
        return deferred.promise;
      }
    }
  };
  var edicaoBasicoCliente = {
    name: 'main.cliente.edicaobasico',
    url: '/edicaobasico/:cnpj/:janela',
    component: 'cadastroBasicoClienteComponent',
    resolve: {
      cliente: function ($q, ClienteService, $stateParams) {
        const deferred = $q.defer();
        ClienteService.getClientePorCnpj($stateParams.cnpj).then(function (clienteDto) {
          deferred.resolve(clienteDto);
        }, function (error) {
          deferred.reject("Cliente não encontrado!");
        })
        return deferred.promise;
      },
      janela: function ($stateParams) {
        return !!$stateParams.janela ? parseInt($stateParams.janela) : ABA_CADASTRO_CLIENTE.DADOS_PESSOAIS;
      },
      listaRepresentacoes: function (auth, IndustriaService, $q) {
        const deferred = $q.defer();
        if (auth.vendedor) {
          IndustriaService.getIndustriasByIdUsuario(auth.id).then(function (result) {
            deferred.resolve(result);
          },
            function (error) {
              deferred.reject(error);
            });
        }
        if (auth.administrador) {
          IndustriaService.getIndustrias().then(function (result) {
            deferred.resolve(result);
          },
            function (error) {
              deferred.reject(error);
            })
        }
        return deferred.promise;
      }
    }
  };
  $stateProvider.state(cliente);
  $stateProvider.state(pesquisaCliente);
  $stateProvider.state(cadastroCliente);
  $stateProvider.state(cadastroBasicoCliente);
  $stateProvider.state(edicaoCliente);
  $stateProvider.state(edicaoBasicoCliente);
});