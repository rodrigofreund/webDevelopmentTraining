var app = angular.module('app', ['ui.router'])

app.controller('controller', controller)

controller.$inject = ['$http']

function controller($http) {
    var vm = this
}
