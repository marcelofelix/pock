'use strict';

angular.module('pockApp').
  factory('SellService', function($http){
    return {
      list: function(start, end){
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
      },

      get: function(id){
        return $http({
          url: 'sell/'+id,
          method: 'GET'
        }).then(function(response){
          return response.data;
        },{});
      },

      newSell: function(){
        return $http({
          url: 'sell',
          method: 'POST'
        }).then(function(response){
          return response.data;
        },{});
      },

      add: function(id, product_id){
        return $http({
          url: 'sell/'+id+'/item',
          method: 'POST',
          params: {
            product_id: product_id
          }
        }).then(function(response){
          return response.data;
        },{});
      },

      updateItem: function(id, item){
        return $http({
          url: '/sell/'+id+'/item/',
          method: 'PUT',
          data:{
            item: item
          }
        }).then(function(response){
          return response.data;
        },{});
      },

      removeItem: function(id){
        return $http({
          url: 'sell/item/' + id,
          method: 'DELETE'
        });
      },

      update: function(sell){
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
    }
  });
