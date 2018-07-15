var app = angular.module('app', [])

app.controller('controller', controller)

controller.$inject('$http')

function controller($http) {
    var vm = this
    vm.text = "Git";

    vm.repositories = []

    $http({
        'method':'GET',
        'url':'https://api.github.com/search/repositories?q=angular'
    }).then((response) => {
        vm.repositories = response.data.items
    })
}