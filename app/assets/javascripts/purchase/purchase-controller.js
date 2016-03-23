'use strict';

var app = angular.module('pockApp');
app.controller('PurchaseController', function(purchase){
  var self = this;
  self.purchase = purchase;
  return self;
});
