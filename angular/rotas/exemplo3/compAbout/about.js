angular.module('app').component('about', {
  templateUrl: 'compAbout/about.html',
  controller: aboutController,
  bindings: {
    title :'<'
  }
})

function aboutController() {
  var vm = this;

  vm.text = 'About!'
}