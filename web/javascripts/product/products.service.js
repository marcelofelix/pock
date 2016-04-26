(function(){
  'use strict';

  angular.module('pockApp').factory('ProductService', ProductService);

  function ProductService($http){
      return {
        get: get,
        list: list,
        save: save,
        suppliers: getSuppliers
      }

      function get(code){
        return $http.get('/products/'+code).
          then(function(response){
            return response.data;
          });
      }

      function list(){
        return $http.get('products').
          then(function(response){
            return response.data;
          });
      }

      function save(product){
        if(product.id){
          return $http.put('products/'+product.id, product);
        }else{
          return $http.post('products', product);
        }
      }

      function getSuppliers(){
        return $http.get('supplier').
          then(function(response){
            return response.data;
          });
      }
  }
})();
