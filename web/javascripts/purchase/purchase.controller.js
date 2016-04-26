'use strict';

var app = angular.module('pockApp');
app.controller('PurchaseController', function(purchase, Menu){
  Menu.action = 'Compras';
  var self = this;
  self.purchase = purchase;
  return self;
});
