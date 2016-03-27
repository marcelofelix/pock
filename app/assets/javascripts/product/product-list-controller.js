'use strict';

angular.module('pockApp').
  controller('ProductListController', function(products, $location){
    var self = this;
    self.products = products;
    self.edit = function(p){
      $location.path('product/' + p.ean);
    };

    self.search = function(query){
      return _.filter(self.products, function(e){
        return angular.lowercase(e.name).indexOf(angular.lowercase(query)) > -1;
      });
    };

    return self;
  });
