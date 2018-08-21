'use strict'

angular.module('CadastroClientes').factory('CadastroClientesService', [ '$http', 'NetworkService', 'NotificationService', function($http, NetworkService, NotificationService) {
	var service = {};
	
	service.salvarCliente = (cliente, callback) => {
		NetworkService.httpPost('/salvarCliente', cliente, (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao salvar o cliente', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.buscaEstados = function(callback) {
		NetworkService.httpGet('/buscaEstados', (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar os estados', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.buscaVendedores = function(callback) {
		NetworkService.httpGet('/buscaUsuarios', (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar vendedores', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.buscaListaTipoPessoa = function(callback) {
		NetworkService.httpGet('/buscaListaTipoPessoa', (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar tipos de pessoa', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.getIndustriasCliente = function(idCliente, callback) {
		NetworkService.httpPost(`/buscaIndustriaCliente`, idCliente, (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar industrias do cliente', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.getRepresentacoesIndustria = function(idIndustria, callback) {
		NetworkService.httpPost(`/buscaRepresentacoesIndustria`, idIndustria, (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar representacoes industrias', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.getRepresentacoesUsuario = function(idUsuario, callback) {
		NetworkService.httpPost(`/buscaRepresentacoesUsuario`, idUsuario, (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar representacoes industrias', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.downloadArquivo = function(cpfCnpj, nomeArquivo, callback) {
		NetworkService.httpGet(`/downloadArquivoCliente?nomeArquivo=${nomeArquivo}&cpfCnpj=${cpfCnpj}`, (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar arquivo', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})		
	}

	service.compactarArquivos = function (files, callback) {
		var fd = new FormData()
		let cont = 0
		for (var i in files) {
			if (IMAGE_FILE_TYPE.indexOf(files[i].type) > -1) {
				new ImageCompressor(files[i], {
					quality: .8,
					minWidth: 1024,
					maxWidth: 1440 ,
					minHeight: 768,
					maxHeight: 900,
					success(result) {
						fd.append("files", result, result.name);
						cont++
						if (cont == files.length) {
							callback(fd)
						}
					},
					error(e) {
						NotificationService.error(error);
						callback(null)
					}
				})
			} else {
				fd.append("files", files[i]);
				cont++
				if (cont == files.length) {
					callback(fd)
				}
			}
		}
	}

	service.uploadArquivoCliente = function (files, cpfCnpj, callback, callbackError) {
		service.compactarArquivos(files, (mFileDescriptor) => {
			if (mFileDescriptor) {
				mFileDescriptor.append('cpfCnpj', cpfCnpj)
				$http.post(MODO_HTTP + URL + '/uploadArquivoCliente', mFileDescriptor, {
					transformRequest: angular.identity,
					headers: { 'Content-Type': undefined }
				})
					.success(function (result) {
						NotificationService.success('Arquivo enviado com sucesso!')
						callback(result);
					})
					.error(function (error) {
						NotificationService.error(error);
						callbackError(error);
					});
			} else {
				NotificationService.error("Não foi possível enviar os arquivos");
			}
		});
	}

	service.validarCpf = function(cpf) {
	    cpf = cpf.replace(/[^\d]+/g,'');    
	    if(cpf == '') return false; 
	    // Elimina CPFs invalidos conhecidos    
	    if (cpf.length != 11 || 
	        cpf == "00000000000" || 
	        cpf == "11111111111" || 
	        cpf == "22222222222" || 
	        cpf == "33333333333" || 
	        cpf == "44444444444" || 
	        cpf == "55555555555" || 
	        cpf == "66666666666" || 
	        cpf == "77777777777" || 
	        cpf == "88888888888" || 
	        cpf == "99999999999")
	            return false;       
	    // Valida 1o digito 
	    var add = 0;    
	    for (var i=0; i < 9; i ++)       
	        add += parseInt(cpf.charAt(i)) * (10 - i);  
	     var rev = 11 - (add % 11);  
	     if (rev == 10 || rev == 11)     
	    	 rev = 0;    
	     if (rev != parseInt(cpf.charAt(9)))     
	    	 return false;       
	    // Valida 2o digito 
	    add = 0;
	    for (var i = 0; i < 10; i ++)        
	        add += parseInt(cpf.charAt(i)) * (11 - i);  
	    rev = 11 - (add % 11);  
	    if (rev == 10 || rev == 11) 
	        rev = 0;    
	    if (rev != parseInt(cpf.charAt(10)))
	        return false;       
	    return true;   
	}
	
	service.validarCnpj = function (cnpj) {
	    cnpj = cnpj.replace(/[^\d]+/g,'');
	    
	    if(cnpj == '') {
			return false;
		}
	     
	    if (cnpj.length != 14) {
	        return false;
		}
	 
	    // Elimina CNPJs invalidos conhecidos
	    if (cnpj == "00000000000000" || 
	        cnpj == "11111111111111" || 
	        cnpj == "22222222222222" || 
	        cnpj == "33333333333333" || 
	        cnpj == "44444444444444" || 
	        cnpj == "55555555555555" || 
	        cnpj == "66666666666666" || 
	        cnpj == "77777777777777" || 
	        cnpj == "88888888888888" || 
	        cnpj == "99999999999999") {
	        return false;
		}
	         
	    // Valida DVs
	    var tamanho = cnpj.length - 2
	    var numeros = cnpj.substring(0,tamanho);
	    var digitos = cnpj.substring(tamanho);
	    var soma = 0;
	    var pos = tamanho - 7;
		
	    for (var i = tamanho; i >= 1; i--) {
	      soma += numeros.charAt(tamanho - i) * pos--;
	      if (pos < 2)
	            pos = 9;
	    }
	    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
	    if (resultado != digitos.charAt(0)) {
	        return false;
		}
	         
	    tamanho = tamanho + 1;
	    numeros = cnpj.substring(0,tamanho);
	    soma = 0;
	    pos = tamanho - 7;
	    for (var i = tamanho; i >= 1; i--) {
	      soma += numeros.charAt(tamanho - i) * pos--;
	      if (pos < 2)
	            pos = 9;
	    }
	    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
	    if (resultado != digitos.charAt(1)) {
	          return false;
		}
	    return true;
	}
	
	service.buscaNomesBancos = function(callback) {
		var nomes = [
			'Alvorada Banco de Investimento',
			'654 | Banco A.J.Renner S.A.',
			'246 | Banco ABC Brasil S.A.',
			'75 | Banco ABN AMRO S.A.',
			'Banco Alfa de Investimentos SA',
			'25 | Banco Alfa S.A.',
			'641 | Banco Alvorada S.A.',
			'65 | Banco AndBank (Brasil) S.A.',
			'213 | Banco Arbi S.A.',
			'19 | Banco Azteca do Brasil S.A.',
			'Banco Bandeirantes de Investimentos SA',
			'24 | Banco BANDEPE S.A.',
			'29 | Banco Banerj S.A.',
			'0 | Banco Bankpar S.A.',
			'740 | Banco Barclays S.A.',
			'107 | Banco BBM S.A.',
			'31 | Banco Beg S.A.',
			'122-8 | Banco BERJ S.A.',
			'96 | Banco BM&FBOVESPA de Serviços de Liquidação e Custódia S.A',
			'318 | Banco BMG S.A.',
			'752 | Banco BNP Paribas Brasil S.A.',
			'248 | Banco Boavista Interatlântico S.A.',
			'218 | Banco Bonsucesso S.A.',
			'Banco BPI Investimentos SA',
			'36 | Banco Bradesco BBI S.A.',
			'204 | Banco Bradesco Cartões S.A.',
			'394 | Banco Bradesco Financiamentos S.A.',
			'237 | Banco Bradesco S.A.',
			'225 | Banco Brascan S.A.',
			'Banco BRJ S.A.',
			'208 | Banco BTG Pactual S.A.',
			'44 | Banco BVA S.A.',
			'263 | Banco Cacique S.A.',
			'473 | Banco Caixa Geral - Brasil S.A.',
			'412 | Banco Capital S.A.',
			'40 | Banco Cargill S.A.',
			'Banco Caterpillar S.A.',
			'266 | Banco Cédula S.A.',
			'739 | Banco Cetelem S.A.',
			'233 | Banco Cifra S.A.',
			'745 | Banco Citibank S.A.',
			'0 | Banco Citicard S.A.',
			'241 | Banco Clássico S.A.',
			'0 | Banco CNH Industrial Capital S.A.',
			'215 | Banco Comercial e de Investimento Sudameris S.A.',
			'Banco Commercial Investment Trus do Brasil S.A.',
			'95 | Banco Confidence de Câmbio S.A.',
			'756 | Banco Cooperativo do Brasil S.A. - BANCOOB',
			'748 | Banco Cooperativo Sicredi S.A.',
			'721 | Banco Credibel S.A.',
			'222 | Banco Credit Agricole Brasil S.A.',
			'505 | Banco Credit Suisse (Brasil) S.A.',
			'229 | Banco Cruzeiro do Sul S.A.',
			'Banco CSF S.A.',
			'3 | Banco da Amazônia S.A.',
			'083-3 | Banco da China Brasil S.A.',
			'0 | Banco Daimlerchrysler S.A.',
			'707 | Banco Daycoval S.A.',
			'BANCO DE INVEST TENDENCIA S.A.',
			'BANCO DE INVESTIMENTOS CREDIT SUISSE BRASIL S A - CREDIT SUISSE',
			'300 | Banco de La Nacion Argentina',
			'495 | Banco de La Provincia de Buenos Aires',
			'494 | Banco de La Republica Oriental del Uruguay',
			'0 | Banco de Lage Landen Brasil S.A.',
			'456 | Banco de Tokyo-Mitsubishi UFJ Brasil S.A.',
			'214 | Banco Dibens S.A.',
			'1 | Banco do Brasil S.A.',
			'47 | Banco do Estado de Sergipe S.A.',
			'37 | Banco do Estado do Pará S.A.',
			'39 | Banco do Estado do Piauí S.A. - BEP',
			'41 | Banco do Estado do Rio Grande do Sul S.A.',
			'4 | Banco do Nordeste do Brasil S.A.',
			'265 | Banco Fator S.A.',
			'0 | Banco Fiat S.A.',
			'224 | Banco Fibra S.A.',
			'626 | Banco Ficsa S.A.',
			'Banco Fidis S.A.',
			'Banco Finasa de Investimentos SA',
			'0 | Banco Ford S.A.',
			'Banco Geração Futuro de Investimentos',
			'Banco Gerador S.A.',
			'734 | Banco Gerdau S.A.',
			'0 | Banco GMAC S.A.',
			'612 | Banco Guanabara S.A.',
			'0 | Banco Honda S.A.',
			'63 | Banco Ibi S.A. Banco Múltiplo',
			'0 | Banco IBM S.A.',
			'604 | Banco Industrial do Brasil S.A.',
			'320 | Banco Industrial e Comercial S.A.',
			'653 | Banco Indusval S.A.',
			'630 | Banco Intercap S.A.',
			'77 | Banco Intermedium S.A.',
			'249 | Banco Investcred Unibanco S.A.',
			'Banco Investimentos BMC SA',
			'184 | Banco Itaú BBA S.A.',
			'479 | Banco ItaúBank S.A',
			'Banco Itaucard S.A.',
			'0 | Banco Itaucred Financiamentos S.A.',
			'Banco ITAULEASING S.A.',
			'376 | Banco J. P. Morgan S.A.',
			'74 | Banco J. Safra S.A.',
			'217 | Banco John Deere S.A.',
			'76 | Banco KDB S.A.',
			'757 | Banco KEB do Brasil S.A.',
			'600 | Banco Luso Brasileiro S.A.',
			'243 | Banco Máxima S.A.',
			'0 | Banco Maxinvest S.A.',
			'BANCO MERCANTIL DE INVESTIMENTOS SA',
			'389 | Banco Mercantil do Brasil S.A.',
			'Banco Mercedes-Benz S.A.',
			'370 | Banco Mizuho do Brasil S.A.',
			'746 | Banco Modal S.A.',
			'0 | Banco Moneo S.A.',
			'738 | Banco Morada S.A.',
			'Banco Morada SA',
			'66 | Banco Morgan Stanley S.A.',
			'45 | Banco Opportunity S.A.',
			'79 | Banco Original do Agronegócio S.A.',
			'212 | Banco Original S.A.',
			'Banco Ourinvest',
			'712-9 | Banco Ourinvest S.A.',
			'623 | Banco PAN S.A.',
			'611 | Banco Paulista S.A.',
			'613 | Banco Pecúnia S.A.',
			'094-2 | Banco Petra S.A.',
			'643 | Banco Pine S.A.',
			'Banco Porto Real de Investimentos S.A.',
			'724 | Banco Porto Seguro S.A.',
			'735 | Banco Pottencial S.A.',
			'638 | Banco Prosper S.A.',
			'0 | Banco PSA Finance Brasil S.A.',
			'747 | Banco Rabobank International Brasil S.A.',
			'088-4 | Banco Randon S.A.',
			'356 | Banco Real S.A.',
			'633 | Banco Rendimento S.A.',
			'741 | Banco Ribeirão Preto S.A.',
			'0 | Banco Rodobens S.A.',
			'Banco Rural de Investimentos SA',
			'72 | Banco Rural Mais S.A.',
			'453 | Banco Rural S.A.',
			'422 | Banco Safra S.A.',
			'33 | Banco Santander (Brasil) S.A.',
			'743 | Banco Semear S.A.',
			'749 | Banco Simples S.A.',
			'366 | Banco Société Générale Brasil S.A.',
			'637 | Banco Sofisa S.A.',
			'12 | Banco Standard de Investimentos S.A.',
			'Banco Sudameris Investimento SA',
			'464 | Banco Sumitomo Mitsui Brasileiro S.A.',
			'082-5 | Banco Topázio S.A.',
			'0 | Banco Toyota do Brasil S.A.',
			'634 | Banco Triângulo S.A.',
			'18 | Banco Tricury S.A.',
			'0 | Banco Volkswagen S.A.',
			'0 | Banco Volvo (Brasil) S.A.',
			'655 | Banco Votorantim S.A.',
			'610 | Banco VR S.A.',
			'119 | Banco Western Union do Brasil S.A.',
			'Banco Woori Bank do Brasil S.A.',
			'Banco Yamaha Motor S.A.',
			'21 | BANESTES S.A. Banco do Estado do Espírito Santo',
			'Banif Brasil BI SA',
			'719 | Banif-Banco Internacional do Funchal (Brasil)S.A.',
			'755 | Bank of America Merrill Lynch Banco Múltiplo S.A.',
			'744 | BankBoston N.A.',
			'BB BANCO DE INVESTIMENTO S A - BB',
			'73 | BB Banco Popular do Brasil S.A.',
			'081-7 | BBN Banco Brasileiro de Negócios S.A.',
			'250 | BCV - Banco de Crédito e Varejo S.A.',
			'78 | BES Investimento do Brasil S.A.-Banco de Investimento',
			'BMW Financeira',
			'BNY Mellon Banco S.A.',
			'69 | BPN Brasil Banco Múltiplo S.A.',
			'BR PARTNERS BANCO DE INVESTIMENTO S A',
			'125 | Brasil Plural S.A. - Banco Múltiplo',
			'70 | BRB - Banco de Brasília S.A.',
			'BRB - Crédito',
			'092-2 | Brickell S.A. Crédito',
			'BV Financeira S.A. - CFI',
			'104 | Caixa Econômica Federal',
			'114-7 | Central das Coop. de Economia e Crédito Mutuo do Est. do ES',
			'477 | Citibank S.A.',
			'Companhia de Crédito',
			'136 | CONFEDERACAO NACIONAL DAS COOPERATIVAS CENTRAIS UNICREDS',
			'097-3 | Cooperativa Central de Crédito Noroeste Brasileiro Ltda.',
			'085-x | Cooperativa Central de Crédito Urbano-CECRED',
			'099-x | Cooperativa Central de Economia e Credito Mutuo das Unicreds',
			'090-2 | Cooperativa Central de Economia e Crédito Mutuo das Unicreds',
			'089-2 | Cooperativa de Crédito Rural da Região de Mogiana',
			'087-6 | Cooperativa Unicred Central Santa Catarina',
			'098-1 | CREDIALIANÇA COOPERATIVA DE CRÉDITO RURAL',
			'487 | Deutsche Bank S.A. - Banco Alemão',
			'Finamax S/A C. F. I.',
			'64 | Goldman Sachs do Brasil Banco Múltiplo S.A.',
			'62 | Hipercard Banco Múltiplo S.A.',
			'399 | HSBC Bank Brasil S.A. - Banco Múltiplo',
			'168 | HSBC Finance (Brasil) S.A. - Banco Múltiplo',
			'ICBC DO BRASIL BANCO MULTIPLO S A - ICBC DO BRASIL',
			'492 | ING Bank N.V.',
			'652 | Itaú Unibanco Holding S.A.',
			'341 | Itaú Unibanco S.A.',
			'J. Malucelli',
			'488 | JPMorgan Chase Bank',
			'14 | Natixis Brasil S.A. Banco Múltiplo',
			'753 | NBC Bank Brasil S.A. - Banco Múltiplo',
			'086-8 | OBOE Crédito Financiamento e Investimento S.A.',
			'Omni SA Crédito Financiamento Investimento',
			'254 | Paraná Banco S.A.',
			'Santana S.A. Crédito',
			'Scania Banco S.A.',
			'751 | Scotiabank Brasil S.A. Banco Múltiplo',
			'Standard Chartered Bank (Brasil) S/A–Bco Invest.',
			'Sul Financeira S/A - Crédito',
			'UAM - Assessoria e Gestão',
			'UBS Brasil Banco de Investimento S.A.',
			'409 | UNIBANCO - União de Bancos Brasileiros S.A.',
			'230 | Unicard Banco Múltiplo S.A.',
			'091-4 | Unicred Central do Rio Grande do Sul'
			];
		return nomes;
	}
	
	return service;
}]);