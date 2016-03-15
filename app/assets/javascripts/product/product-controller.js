'use strict';

angular.module('pockApp')
  .controller('ProductController', function($scope, product, $location, ProductService, Notification){
    var self = this;
    self.product = product;

    self.save = function(){
      if(!$scope.productForm.$invalid){
        ProductService.save(self.product).
          then(function(){
            $location.path('product');
            Notification('Produto salvo com sucesso');
          },{});
      }
    };
  });
