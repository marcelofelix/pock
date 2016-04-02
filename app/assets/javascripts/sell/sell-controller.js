'use strict';

angular.module('pockApp').
  controller('SellController', function(sell, products, SellService, $mdSidenav, $location){
    var menu = 'item';
    var payment = 'payment';
    var self = this;
    self.sell = sell;
    self.itens = sell.sell_items;
    self.date = moment(sell.created_at).toDate();
    self.products = products;

    self.search = function(query){
      return _.filter(self.products, function(e){
        return angular.lowercase(e.name).indexOf(angular.lowercase(query)) > -1;
      });
    };

    self.add = function(p){
      if(p){
        SellService.add(self.sell.id, p.id).
          then(function(data){
            updateItem(data);
          });
        self.searchText = '';
      }
    };

    self.total = function(item){
      if(item){
        var discount = item.discount ? item.price * item.discount / 100 : 0;
        return (item.price - discount) * item.count;
      }
    }

    self.openItem = function(item){
      self.item = _.clone(item);
      $mdSidenav(menu).toggle();
    };

    self.openPayment = function(){
      self.totalSell();
      $mdSidenav(payment).toggle();
    };

    self.closeItem = function(){
      $mdSidenav(menu).close();
    };

    self.closePayment = function(){
      $mdSidenav(payment).close();
    };

    self.totalSell = function(){
      var value = _.reduce(self.itens, function(sum, e){
        return sum + self.total(e);
      }, 0);
      var discount = self.sell.discount ? value * self.sell.discount / 100 : 0;
      return value - discount;
    };

    self.remove = function(item){
      SellService.removeItem(item.id).
        then(function(){
          _.remove(self.itens, {id: item.id});
          self.closeItem();
        },{});
    };

    self.charge = function(){
      if(self.sell.payment > self.totalSell()){
        return self.sell.payment - self.totalSell();
      }else{
        return 0;
      }
    };

    self.updateItem = function(item){
      SellService.updateItem(self.sell.id, item).
        then(function(data){
          updateItem(data);
          self.closeItem();
        },{});
    };

    self.close = function(){
      var sell = _.clone(self.sell);
      sell.status = 'close';
      SellService.update(sell).
        then(function(data){
          sell.status = 'close';
          $location.path('/sell');
        },{});
    };

    self.update = function(){
      self.sell.created_at = self.date;
      SellService.update(self.sell);
    };

    function updateItem(data){
      var item = _.find(self.itens, {product_id: data.product_id});
      if(item){
        _.assign(item, data);
      }else{
        self.itens.unshift(data);
      }
    };

  });
