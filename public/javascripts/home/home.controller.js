(function(){
  'use strict'
  angular.module('pockApp').controller('HomeController', Home);
  function Home($scope, Menu){
    var self = this;
    self.menu = Menu;
  }
})();
