angular.module('ModalApp', ['ui.bootstrap']).service('ModalService', ['$uibModal',
    function ($uibModal) {
        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'modules/modal/modal.html'
        };

        var modalOptions = {
            closeButtonText: 'Cancelar',
            actionButtonText: 'Confirmar',
            headerText: 'Continua?',
            bodyText: 'Executar esta ação?',
            bodyDataList: [],
            showCloseButton: true
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $uibModalInstance) {
                    $scope.selectedOption = null //Item atualmente selecionado
                    $scope.selectedElement = null //Elemento atualmente selecionado
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $uibModalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.selecionaTodos = false
                    $scope.selectLine = function ($event) {
                        let element = $event.currentTarget
                        if (!element) {
                            return
                        }
                        if (!$scope.selectedElement) {
                            selectLine(element)
                        } else {
                            if ($scope.selectedElement == element) {
                                desselectLine($scope.selectedElement)
                            } else {
                                desselectLine()
                                selectLine(element)
                            }
                        }
                    }
                    $scope.pesquisa = null
                    $scope.filtroClientes = function (item) {
                        if ($scope.pesquisa) {
                            return item.nome.indexOf($scope.pesquisa.toUpperCase()) !== -1
                        } else {
                            return true
                        }
                    }
                    $scope.getStatusPedido = function (pedido) {
                        switch (pedido.status) {
                            case 0:
                                return "Indefinido";
                            case 1:
                                return "Criado";
                            case 2:
                                return "Salvo";
                            case 3:
                                return "Enviado";
                            case 4:
                                return "Negado";
                            case 5:
                                return "Colocado";
                            case 6:
                                return "Cancelado";
                        }
                    }
                    function selectLine(element) {
                        $scope.selectedElement = element
                        $scope.selectedOption = element.dataset.item;
                        element.style.backgroundColor = 'rgb(255,200,200)';
                    }
                    function desselectLine() {
                        $scope.selectedElement.style.backgroundColor = null
                        $scope.selectedElement = null
                        $scope.selectedOption = null
                    }

                    $scope.marcarTodos = function () {
                        $scope.selecionaTodos = !$scope.selecionaTodos
                        $scope.modalOptions.bodyDataList.forEach(element => {
                            element.listaCliente.forEach(cliente => {
                                cliente.importar = $scope.selecionaTodos
                            })
                        });
                    }
                }
            }
            return $uibModal.open(tempModalDefaults).result;
        };

    }]);