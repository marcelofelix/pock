(function(){
  'use strict';

  angular.module('pockApp').  controller('SellController', SellController);

  function SellController(sell, products, SellService, $mdSidenav, $location, Menu){
    Menu.action = 'Nova Venda';
    var menu = 'item';
    var payment = 'payment';
    var self = this;
    self.sell = sell;
    self.itens = sell.sell_items;
    self.date = moment(sell.created_at).toDate();
    self.products = products;
    self.search = search;
    self.add = add;
    self.total = total;
    self.openItem = openItem;
    self.openPayment = openPayment;
    self.closeItem = closeItem;
    self.closePayment = closePayment;
    self.totalSell = totalSell;
    self.remove = remove;
    self.charge = charge;
    self.updateItem = updateItem;
    self.close = close;
    self.update = update;
    self.cancel = cancel;

    function cancel(){
      SellService.cancel(self.sell.id).
        then(function(){
          $location.path('/sell');
        });
    }

    function search(query){
      return _.filter(self.products, function(e){
        return angular.lowercase(e.name).indexOf(angular.lowercase(query)) > -1;
      });
    };

    function add(p){
      if(p){
        SellService.add(self.sell.id, p.id).
          then(function(data){
            updateItem(data);
          });
        self.searchText = '';
      }
    };

    function total(item){
      if(item){
        var discount = item.discount ? item.price * item.discount / 100 : 0;
        return (item.price - discount) * item.count;
      }
    }

    function openItem(item){
      self.item = _.clone(item);
      $mdSidenav(menu).toggle();
    };

    function openPayment(){
      self.totalSell();
      $mdSidenav(payment).toggle();
    };

    function closeItem(){
      $mdSidenav(menu).close();
    };

    function closePayment(){
      $mdSidenav(payment).close();
    };

    function totalSell(){
      var value = _.reduce(self.itens, function(sum, e){
        return sum + self.total(e);
      }, 0);
      var discount = self.sell.discount ? value * self.sell.discount / 100 : 0;
      return value - discount;
    };

    function remove(item){
      SellService.removeItem(item.id).
        then(function(){
          _.remove(self.itens, {id: item.id});
          self.closeItem();
        },{});
    };

    function charge(){
      if(self.sell.payment > self.totalSell()){
        return self.sell.payment - self.totalSell();
      }else{
        return 0;
      }
    };

    function updateItem(item){
      SellService.updateItem(self.sell.id, item).
        then(function(data){
          updateItem(data);
          self.closeItem();
        },{});
    };

    function close(){
      var sell = _.clone(self.sell);
      sell.status = 'close';
      SellService.update(sell).
        then(function(data){
          sell.status = 'close';
          $location.path('/sell');
        },{});
    };

    function update(){
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

  };
})();
