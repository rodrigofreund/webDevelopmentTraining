angular.module('app').component('hello', {
  templateUrl: './hello.html',
  controller: controller
})

function controller() {
  var vm = this;

  vm.text = 'Hello Word!'
}