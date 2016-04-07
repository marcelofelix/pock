(function(){

  'use strict';

  angular.module('pockApp')
    .controller('ProductController', ProductController );

  function ProductController($scope, product, $location, ProductService, Notification, Menu){
    Menu.action = 'Novo produto';
    var self = this;
    self.product = product;
    self.save = save;

    activate();

    function activate(){
      ProductService.suppliers().
        then(function(data){
          self.suppliers = data;
        });
    }

    function save(){
      if(!$scope.productForm.$invalid){
        ProductService.save(self.product).
          then(function(){
            $location.path('product');
            Notification('Produto salvo com sucesso');
          });
      }
    }
  }
})();
