angular.module('app').component('about', {
  templateUrl: './about.html',
  controller: controller
})

function controller() {
  var vm = this;

  vm.text = 'Its the UI-Router hello world app!'
}