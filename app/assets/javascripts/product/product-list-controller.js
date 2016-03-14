'use strict';

angular.module('pockApp').
  controller('ProductListController', function(products, $location){
    var self = this;
    self.products = products;
    self.edit = function(p){
      $location.path('product/' + p.ean);
    };

    return self;
  });
