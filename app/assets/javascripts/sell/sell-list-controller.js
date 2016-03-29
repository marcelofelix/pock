'use strict';

angular.module('pockApp').
  controller('SellListController', function(sells, SellService, $location){
    var self = this;
    self.sells = sells;
    self.date = moment().toDate();
    self.total = 0;

    self.list = function(){
      SellService.list(self.date).
        then(function(data){
          self.sells = data;
        },{});
    };

    self.total = function(){
      return _.reduce(self.sells, function(sum, n){return sum + n.total}, 0);
    };

    self.edit = function(id){
      $location.path('/sell/'+id);
    };

    self.newSell = function(){
      SellService.newSell().
        then(function(data){
          $location.path('/sell/'+data.id);
        },{});
    };
    return this;
  });
