'use strict';

angular.module('pockApp')
  .factory('ProductService', function($http){
    return {
      get: function(code){
        return $http.get('/products/'+code).
          then(function(response){
            return response.data;
          },{});
      },

      list: function(){
        return $http.get('products').
          then(function(response){
            return response.data;
          },{});
      },

      save: function(product){
        if(product.id){
          return $http.put('products/'+product.id, product);
        }else{
          return $http.post('products', product);
        }
      }
    }
  });
