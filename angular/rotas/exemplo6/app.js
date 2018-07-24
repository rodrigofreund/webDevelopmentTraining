var app = angular.module('app', ['ui.router'])

/*
app.run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$on('$stateChangeError', (evt, to, toParams, from, fromParams, error) => {
        if(error.redirectTo) {
            $state.go(error.redirectTo);
        } else {
            $state.go('error', {status: error.status})
        }
    })
}])
*/

app.run(($transitions, $state) => {
    $transitions.onBefore({}, ($transition$) => {
        console.log('to before: ', $transition$.$to())
    });
	$transitions.onError({}, ($transition$) => {
        console.log('to error: ', $transition$.$to())
    });
});



app.controller('controller', controller)

controller.$inject = ['$http', '$state']

function controller($http, $state) {
    var vm = this
    $state.go('usuario-lista')
}
