'use strict';

angular.module('pockApp').
  factory('httpLoading', function($rootScope){
    return {
      request: function(config){
        $rootScope.loading = true;
        return config;
      },

      response: function(response){
        $rootScope.loading = false;
        return response;
      }
    }
  });
