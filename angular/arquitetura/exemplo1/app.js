var module = angular.module('app.module', ['ui.router', 'pedido.module'])

module.run(['$rootScope', '$state', '$transitions', 'UsuarioService', function($rootScope, $state, $transitions, UsuarioService) {
    $transitions.onBefore({to:'app'}, function(transition) {
        console.log('Transacao onBefore: ', transition.to())
        if(!UsuarioService.getLogged()) {
            return transition.router.stateService.target('login');
        }
    })

    $transitions.onStart({}, function(transition) {
        console.log('Transacao onstart: ', transition.to())
    })
}])
