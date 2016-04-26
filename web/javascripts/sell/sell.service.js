(function(){
  'use strict';

  angular.module('pockApp').
    factory('SellService', function($http){
      return {
        list: list,
        get: get,
        newSell: newSell,
        add: add,
        updateItem: updateItem,
        removeItem: removeItem,
        update: update,
        cancel: cancel
      }

      function list(start, end){
        return $http({
          url: 'sell',
          method: 'GET',
          params: {
            start: start,
            end: end
          }
        }).then(function(response){
          return response.data;
        },{});
      }

      function get(id){
        return $http({
          url: 'sell/'+id,
          method: 'GET'
        }).then(function(response){
          return response.data;
        },{});
      }

      function newSell(){
        return $http({
          url: 'sell',
          method: 'POST'
        }).then(function(response){
          return response.data;
        },{});
      }

      function add(id, product_id){
        return $http({
          url: 'sell/'+id+'/item',
          method: 'POST',
          params: {
            product_id: product_id
          }
        }).then(function(response){
          return response.data;
        },{});
      }

      function updateItem(id, item){
        return $http({
          url: '/sell/'+id+'/item/',
          method: 'PUT',
          data:{
            item: item
          }
        }).then(function(response){
          return response.data;
        },{});
      }

      function removeItem(id){
        return $http({
          url: 'sell/item/' + id,
          method: 'DELETE'
        });
      }

      function update(sell){
        return $http({
          url: 'sell/'+sell.id,
          method: 'PUT',
          data: {
            sell: sell
          }
        }).then(function(response){
          return response.data;
        },{});
      }

      function cancel(id){
        return $http({
          url: 'sell/'+id,
          method: 'DELETE'
        });
      }
    });
})();
