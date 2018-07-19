angular.module('app').component('hello', {
  templateUrl: 'compHello/hello.html',
  controller: helloController
})

function helloController() {
  var vm = this;

  vm.text = 'Hello!'
}