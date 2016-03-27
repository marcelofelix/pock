'use strict';

angular.module('pockApp').
  controller('SellController', function(sell, products, SellService, $mdSidenav){
    var menu = 'right';
    var self = this;
    self.sell = sell;
    self.itens = sell.sell_items;
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

    self.closeItem = function(){
      $mdSidenav(menu).close();
    };

    self.totalSell = function(){
      return _.reduce(self.itens, function(sum, e){
        return sum + self.total(e);
      }, 0);
    };

    self.remove = function(item){
      SellService.removeItem(item.id).
        then(function(){
          _.remove(self.itens, {id: item.id});
          self.closeItem();
        },{});
    };

    self.update = function(item){
      SellService.updateItem(self.sell.id, item).
        then(function(data){
          updateItem(data);
          self.closeItem();
        },{});
    };

    function updateItem(data){
      var item = _.find(self.itens, {product_id: data.product_id});
      if(item){
        _.assign(item, data);
      }else{
        self.itens.push(data);
      }
    }
  });
