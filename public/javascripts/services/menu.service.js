(function(){
  'use strict'

  angular.module('pockApp').factory('Menu', Menu);

  function Menu(){
    console.log('MenuAction');
    return {
      action: 'Lista de produtos'
    }
  }
})();
