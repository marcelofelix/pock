'use strict';

angular.module('pockApp').
  factory('PurchaseService', function($http){
    return {
      list: function(){
        return $http({
          url: 'purchase',
          method: 'GET'
        }).then(function(response){
          return response.data;
        },{});
      }
    }
  });
