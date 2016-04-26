// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
// Bower packages
//= require moment
//= require lodash/dist/lodash.js
//= require angular
//= require angular-rails-templates
//= require angular-route
//= require angular-animate
//= require angular-aria
//= require angular-material
//= require angular-messages
//= require angular-ui-notification
//= require angular-input-masks
//= require ng-file-upload
//= require main.js
//= require_tree .

'use strict';
angular.module('pockApp', [
  'ngRoute',
  'ngMaterial',
  'ui-notification',
  'ui.utils.masks',
  'ngFileUpload',
  'templates'
]).config([
  '$routeProvider',
  '$httpProvider',
  '$mdThemingProvider',
  function ($routeProvider, $httpProvider, $mdThemingProvider) {
    $httpProvider.interceptors.push('httpLoading');
    $routeProvider.when('/', { templateUrl: 'home/home.html' }).when('/product', {
      templateUrl: 'product/product-list.html',
      controller: 'ProductListController',
      controllerAs: 'vm',
      resolve: {
        products: function (ProductService) {
          return ProductService.list();
        }
      }
    }).when('/product/new', {
      templateUrl: 'product/product.html',
      controller: 'ProductController',
      controllerAs: 'vm',
      resolve: {
        product: function ($route) {
          return {};
        }
      }
    }).when('/product/:code', {
      templateUrl: 'product/product.html',
      controller: 'ProductController',
      controllerAs: 'vm',
      resolve: {
        product: function ($route, ProductService) {
          return ProductService.get($route.current.params.code);
        }
      }
    }).when('/purchase', {
      templateUrl: 'purchase/purchase-list.html',
      controller: 'PurchaseListController',
      controllerAs: 'vm',
      resolve: {
        purchases: function (PurchaseService) {
          return PurchaseService.list();
        }
      }
    }).when('/purchase/:id', {
      templateUrl: 'purchase/purchase.html',
      controller: 'PurchaseController',
      controllerAs: 'vm',
      resolve: {
        purchase: function ($route, PurchaseService) {
          return PurchaseService.get($route.current.params.id);
        }
      }
    }).when('/sell', {
      templateUrl: 'sell/sell-list.html',
      controller: 'SellListController',
      controllerAs: 'vm',
      resolve: {
        sells: function (SellService) {
          return SellService.list(moment().startOf('month').toDate(), moment().endOf('month').toDate());
        }
      }
    }).when('/sell/:id', {
      templateUrl: 'sell/sell.html',
      controller: 'SellController',
      controllerAs: 'vm',
      resolve: {
        sell: function (SellService, $route) {
          return SellService.get($route.current.params.id);
        },
        products: function (ProductService) {
          return ProductService.list();
        }
      }
    });
  }
]);
'use strict';
angular.module('pockApp').directive('currency', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function (value) {
        return '' + value;
      });
      ngModel.$formatters.push(function (value) {
        return parseFloat(value, 10);
      });
    }
  };
});
'use strict';
angular.module('pockApp').controller('PurchaseListController', [
  'purchases',
  'Upload',
  '$location',
  'PurchaseService',
  'Menu',
  function (purchases, Upload, $location, PurchaseService, Menu) {
    Menu.action = 'Compras';
    var self = this;
    self.purchases = purchases;
    self.uploadFiles = function (file, errFile) {
      if (file) {
        file.upload = Upload.upload({
          url: 'purchase/import',
          data: { file: file }
        });
        file.upload.then(PurchaseService.list().then(function (data) {
          self.purchases = data;
        }));
      }
    };
    self.show = function (purchase) {
      $location.path('/purchase/' + purchase.id);
    };
    return self;
  }
]);
'use strict';
angular.module('pockApp').factory('PurchaseService', [
  '$http',
  function ($http) {
    return {
      list: function () {
        return $http({
          url: 'purchase',
          method: 'GET'
        }).then(function (response) {
          return response.data;
        }, {});
      },
      get: function (id) {
        return $http({
          url: 'purchase/' + id,
          method: 'GET'
        }).then(function (response) {
          return response.data;
        }, {});
      }
    };
  }
]);
'use strict';
var app = angular.module('pockApp');
app.controller('PurchaseController', [
  'purchase',
  'Menu',
  function (purchase, Menu) {
    Menu.action = 'Compras';
    var self = this;
    self.purchase = purchase;
    return self;
  }
]);
'use strict';
angular.module('pockApp').factory('httpLoading', [
  '$rootScope',
  function ($rootScope) {
    return {
      request: function (config) {
        $rootScope.loading = true;
        return config;
      },
      response: function (response) {
        $rootScope.loading = false;
        return response;
      }
    };
  }
]);
(function () {
  'use strict';
  angular.module('pockApp').controller('HomeController', Home);
  function Home($scope, Menu) {
    var self = this;
    self.menu = Menu;
  }
}());
'use strict';
angular.module('pockApp').controller('ProductListController', [
  'products',
  '$location',
  'Menu',
  function (products, $location, Menu) {
    Menu.action = 'Produtos';
    var self = this;
    self.products = products;
    self.edit = function (p) {
      $location.path('product/' + p.ean);
    };
    self.search = function (query) {
      return _.filter(self.products, function (e) {
        return angular.lowercase(e.name).indexOf(angular.lowercase(query)) > -1;
      });
    };
    return self;
  }
]);
(function () {
  'use strict';
  angular.module('pockApp').controller('ProductController', ProductController);
  function ProductController($scope, product, $location, ProductService, Notification, Menu) {
    Menu.action = 'Novo produto';
    var self = this;
    self.product = product;
    self.save = save;
    activate();
    function activate() {
      ProductService.suppliers().then(function (data) {
        self.suppliers = data;
      });
    }
    function save() {
      if (!$scope.productForm.$invalid) {
        ProductService.save(self.product).then(function () {
          $location.path('product');
          Notification('Produto salvo com sucesso');
        });
      }
    }
  }
}());
(function () {
  'use strict';
  angular.module('pockApp').factory('ProductService', ProductService);
  function ProductService($http) {
    return {
      get: get,
      list: list,
      save: save,
      suppliers: getSuppliers
    };
    function get(code) {
      return $http.get('/products/' + code).then(function (response) {
        return response.data;
      });
    }
    function list() {
      return $http.get('products').then(function (response) {
        return response.data;
      });
    }
    function save(product) {
      if (product.id) {
        return $http.put('products/' + product.id, product);
      } else {
        return $http.post('products', product);
      }
    }
    function getSuppliers() {
      return $http.get('supplier').then(function (response) {
        return response.data;
      });
    }
  }
}());
'use strict';
angular.module('pockApp').controller('SellListController', [
  '$scope',
  'sells',
  'SellService',
  '$location',
  'Menu',
  function ($scope, sells, SellService, $location, Menu) {
    Menu.action = 'Vendas';
    var self = this;
    self.sells = sells;
    self.startDate = moment().startOf('month').toDate();
    self.endDate = moment().endOf('month').toDate();
    self.total = 0;
    self.list = function () {
      SellService.list(self.startDate, self.endDate).then(function (data) {
        self.sells = data;
      }, {});
    };
    self.total = function () {
      return _.reduce(self.sells, function (sum, n) {
        return sum + parseFloat(n.total);
      }, 0);
    };
    self.edit = function (id) {
      $location.path('/sell/' + id);
    };
    self.newSell = function () {
      SellService.newSell().then(function (data) {
        $location.path('/sell/' + data.id);
      }, {});
    };
    return this;
  }
]);
(function () {
  'use strict';
  angular.module('pockApp').controller('SellController', SellController);
  function SellController(sell, products, SellService, $mdSidenav, $location, Menu) {
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
    function cancel() {
      SellService.cancel(self.sell.id).then(function () {
        $location.path('/sell');
      });
    }
    function search(query) {
      return _.filter(self.products, function (e) {
        return angular.lowercase(e.name).indexOf(angular.lowercase(query)) > -1;
      });
    }
    ;
    function add(p) {
      if (p) {
        SellService.add(self.sell.id, p.id).then(function (data) {
          updateItem(data);
        });
        self.searchText = '';
      }
    }
    ;
    function total(item) {
      if (item) {
        var discount = item.discount ? item.price * item.discount / 100 : 0;
        return (item.price - discount) * item.count;
      }
    }
    function openItem(item) {
      self.item = _.clone(item);
      $mdSidenav(menu).toggle();
    }
    ;
    function updateItem(item) {
      SellService.updateItem(self.sell.id, item).then(function (data) {
        var item = _.find(self.itens, { product_id: data.product_id });
        if (item) {
          _.assign(item, data);
        } else {
          self.itens.unshift(data);
        }
        self.closeItem();
      }, {});
    }
    ;
    function openPayment() {
      self.totalSell();
      $mdSidenav(payment).toggle();
    }
    ;
    function closeItem() {
      $mdSidenav(menu).close();
    }
    ;
    function closePayment() {
      $mdSidenav(payment).close();
    }
    ;
    function totalSell() {
      var value = _.reduce(self.itens, function (sum, e) {
          return sum + self.total(e);
        }, 0);
      var discount = self.sell.discount ? value * self.sell.discount / 100 : 0;
      return value - discount;
    }
    ;
    function remove(item) {
      SellService.removeItem(item.id).then(function () {
        _.remove(self.itens, { id: item.id });
        self.closeItem();
      }, {});
    }
    ;
    function charge() {
      if (self.sell.payment > self.totalSell()) {
        return self.sell.payment - self.totalSell();
      } else {
        return 0;
      }
    }
    ;
    function close() {
      var sell = _.clone(self.sell);
      sell.status = 'close';
      SellService.update(sell).then(function (data) {
        sell.status = 'close';
        $location.path('/sell');
      }, {});
    }
    ;
    function update() {
      self.sell.created_at = self.date;
      SellService.update(self.sell);
    }
    ;
  }
  ;
}());
(function () {
  'use strict';
  angular.module('pockApp').factory('SellService', [
    '$http',
    function ($http) {
      return {
        list: list,
        get: get,
        newSell: newSell,
        add: add,
        updateItem: updateItem,
        removeItem: removeItem,
        update: update,
        cancel: cancel
      };
      function list(start, end) {
        return $http({
          url: 'sell',
          method: 'GET',
          params: {
            start: start,
            end: end
          }
        }).then(function (response) {
          return response.data;
        }, {});
      }
      function get(id) {
        return $http({
          url: 'sell/' + id,
          method: 'GET'
        }).then(function (response) {
          return response.data;
        }, {});
      }
      function newSell() {
        return $http({
          url: 'sell',
          method: 'POST'
        }).then(function (response) {
          return response.data;
        }, {});
      }
      function add(id, product_id) {
        return $http({
          url: 'sell/' + id + '/item',
          method: 'POST',
          params: { product_id: product_id }
        }).then(function (response) {
          return response.data;
        }, {});
      }
      function updateItem(id, item) {
        return $http({
          url: '/sell/' + id + '/item/',
          method: 'PUT',
          data: { item: item }
        }).then(function (response) {
          return response.data;
        }, {});
      }
      function removeItem(id) {
        return $http({
          url: 'sell/item/' + id,
          method: 'DELETE'
        });
      }
      function update(sell) {
        return $http({
          url: 'sell/' + sell.id,
          method: 'PUT',
          data: { sell: sell }
        }).then(function (response) {
          return response.data;
        }, {});
      }
      function cancel(id) {
        return $http({
          url: 'sell/' + id,
          method: 'DELETE'
        });
      }
    }
  ]);
}());
(function () {
  'use strict';
  angular.module('pockApp').factory('Menu', Menu);
  function Menu() {
    console.log('MenuAction');
    return { action: 'Lista de produtos' };
  }
}());
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
// Bower packages
//= require moment
//= require lodash/dist/lodash.js
//= require angular
//= require angular-rails-templates
//= require angular-route
//= require angular-animate
//= require angular-aria
//= require angular-material
//= require angular-messages
//= require angular-ui-notification
//= require angular-input-masks
//= require ng-file-upload
//= require main.js
//= require_tree .

'use strict';
angular.module('pockApp', [
  'ngRoute',
  'ngMaterial',
  'ui-notification',
  'ui.utils.masks',
  'ngFileUpload',
  'templates'
]).config([
  '$routeProvider',
  '$httpProvider',
  '$mdThemingProvider',
  function ($routeProvider, $httpProvider, $mdThemingProvider) {
    $httpProvider.interceptors.push('httpLoading');
    $routeProvider.when('/', { templateUrl: 'home/home.html' }).when('/product', {
      templateUrl: 'product/product-list.html',
      controller: 'ProductListController',
      controllerAs: 'vm',
      resolve: {
        products: function (ProductService) {
          return ProductService.list();
        }
      }
    }).when('/product/new', {
      templateUrl: 'product/product.html',
      controller: 'ProductController',
      controllerAs: 'vm',
      resolve: {
        product: function ($route) {
          return {};
        }
      }
    }).when('/product/:code', {
      templateUrl: 'product/product.html',
      controller: 'ProductController',
      controllerAs: 'vm',
      resolve: {
        product: function ($route, ProductService) {
          return ProductService.get($route.current.params.code);
        }
      }
    }).when('/purchase', {
      templateUrl: 'purchase/purchase-list.html',
      controller: 'PurchaseListController',
      controllerAs: 'vm',
      resolve: {
        purchases: function (PurchaseService) {
          return PurchaseService.list();
        }
      }
    }).when('/purchase/:id', {
      templateUrl: 'purchase/purchase.html',
      controller: 'PurchaseController',
      controllerAs: 'vm',
      resolve: {
        purchase: function ($route, PurchaseService) {
          return PurchaseService.get($route.current.params.id);
        }
      }
    }).when('/sell', {
      templateUrl: 'sell/sell-list.html',
      controller: 'SellListController',
      controllerAs: 'vm',
      resolve: {
        sells: function (SellService) {
          return SellService.list(moment().startOf('month').toDate(), moment().endOf('month').toDate());
        }
      }
    }).when('/sell/:id', {
      templateUrl: 'sell/sell.html',
      controller: 'SellController',
      controllerAs: 'vm',
      resolve: {
        sell: function (SellService, $route) {
          return SellService.get($route.current.params.id);
        },
        products: function (ProductService) {
          return ProductService.list();
        }
      }
    });
  }
]);
'use strict';
angular.module('pockApp').directive('currency', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function (value) {
        return '' + value;
      });
      ngModel.$formatters.push(function (value) {
        return parseFloat(value, 10);
      });
    }
  };
});
(function () {
  'use strict';
  angular.module('pockApp').controller('HomeController', Home);
  function Home($scope, Menu) {
    var self = this;
    self.menu = Menu;
  }
}());
'use strict';
angular.module('pockApp').factory('httpLoading', [
  '$rootScope',
  function ($rootScope) {
    return {
      request: function (config) {
        $rootScope.loading = true;
        return config;
      },
      response: function (response) {
        $rootScope.loading = false;
        return response;
      }
    };
  }
]);
'use strict';
angular.module('pockApp').controller('ProductListController', [
  'products',
  '$location',
  'Menu',
  function (products, $location, Menu) {
    Menu.action = 'Produtos';
    var self = this;
    self.products = products;
    self.edit = function (p) {
      $location.path('product/' + p.ean);
    };
    self.search = function (query) {
      return _.filter(self.products, function (e) {
        return angular.lowercase(e.name).indexOf(angular.lowercase(query)) > -1;
      });
    };
    return self;
  }
]);
(function () {
  'use strict';
  angular.module('pockApp').controller('ProductController', ProductController);
  function ProductController($scope, product, $location, ProductService, Notification, Menu) {
    Menu.action = 'Novo produto';
    var self = this;
    self.product = product;
    self.save = save;
    activate();
    function activate() {
      ProductService.suppliers().then(function (data) {
        self.suppliers = data;
      });
    }
    function save() {
      if (!$scope.productForm.$invalid) {
        ProductService.save(self.product).then(function () {
          $location.path('product');
          Notification('Produto salvo com sucesso');
        });
      }
    }
  }
}());
(function () {
  'use strict';
  angular.module('pockApp').factory('ProductService', ProductService);
  function ProductService($http) {
    return {
      get: get,
      list: list,
      save: save,
      suppliers: getSuppliers
    };
    function get(code) {
      return $http.get('/products/' + code).then(function (response) {
        return response.data;
      });
    }
    function list() {
      return $http.get('products').then(function (response) {
        return response.data;
      });
    }
    function save(product) {
      if (product.id) {
        return $http.put('products/' + product.id, product);
      } else {
        return $http.post('products', product);
      }
    }
    function getSuppliers() {
      return $http.get('supplier').then(function (response) {
        return response.data;
      });
    }
  }
}());
'use strict';
angular.module('pockApp').controller('PurchaseListController', [
  'purchases',
  'Upload',
  '$location',
  'PurchaseService',
  'Menu',
  function (purchases, Upload, $location, PurchaseService, Menu) {
    Menu.action = 'Compras';
    var self = this;
    self.purchases = purchases;
    self.uploadFiles = function (file, errFile) {
      if (file) {
        file.upload = Upload.upload({
          url: 'purchase/import',
          data: { file: file }
        });
        file.upload.then(PurchaseService.list().then(function (data) {
          self.purchases = data;
        }));
      }
    };
    self.show = function (purchase) {
      $location.path('/purchase/' + purchase.id);
    };
    return self;
  }
]);
'use strict';
angular.module('pockApp').factory('PurchaseService', [
  '$http',
  function ($http) {
    return {
      list: function () {
        return $http({
          url: 'purchase',
          method: 'GET'
        }).then(function (response) {
          return response.data;
        }, {});
      },
      get: function (id) {
        return $http({
          url: 'purchase/' + id,
          method: 'GET'
        }).then(function (response) {
          return response.data;
        }, {});
      }
    };
  }
]);
'use strict';
var app = angular.module('pockApp');
app.controller('PurchaseController', [
  'purchase',
  'Menu',
  function (purchase, Menu) {
    Menu.action = 'Compras';
    var self = this;
    self.purchase = purchase;
    return self;
  }
]);
'use strict';
angular.module('pockApp').controller('SellListController', [
  '$scope',
  'sells',
  'SellService',
  '$location',
  'Menu',
  function ($scope, sells, SellService, $location, Menu) {
    Menu.action = 'Vendas';
    var self = this;
    self.sells = sells;
    self.startDate = moment().startOf('month').toDate();
    self.endDate = moment().endOf('month').toDate();
    self.total = 0;
    self.list = function () {
      SellService.list(self.startDate, self.endDate).then(function (data) {
        self.sells = data;
      }, {});
    };
    self.total = function () {
      return _.reduce(self.sells, function (sum, n) {
        return sum + parseFloat(n.total);
      }, 0);
    };
    self.edit = function (id) {
      $location.path('/sell/' + id);
    };
    self.newSell = function () {
      SellService.newSell().then(function (data) {
        $location.path('/sell/' + data.id);
      }, {});
    };
    return this;
  }
]);
(function () {
  'use strict';
  angular.module('pockApp').controller('SellController', SellController);
  function SellController(sell, products, SellService, $mdSidenav, $location, Menu) {
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
    function cancel() {
      SellService.cancel(self.sell.id).then(function () {
        $location.path('/sell');
      });
    }
    function search(query) {
      return _.filter(self.products, function (e) {
        return angular.lowercase(e.name).indexOf(angular.lowercase(query)) > -1;
      });
    }
    ;
    function add(p) {
      if (p) {
        SellService.add(self.sell.id, p.id).then(function (data) {
          updateItem(data);
        });
        self.searchText = '';
      }
    }
    ;
    function total(item) {
      if (item) {
        var discount = item.discount ? item.price * item.discount / 100 : 0;
        return (item.price - discount) * item.count;
      }
    }
    function openItem(item) {
      self.item = _.clone(item);
      $mdSidenav(menu).toggle();
    }
    ;
    function updateItem(item) {
      SellService.updateItem(self.sell.id, item).then(function (data) {
        var item = _.find(self.itens, { product_id: data.product_id });
        if (item) {
          _.assign(item, data);
        } else {
          self.itens.unshift(data);
        }
        self.closeItem();
      }, {});
    }
    ;
    function openPayment() {
      self.totalSell();
      $mdSidenav(payment).toggle();
    }
    ;
    function closeItem() {
      $mdSidenav(menu).close();
    }
    ;
    function closePayment() {
      $mdSidenav(payment).close();
    }
    ;
    function totalSell() {
      var value = _.reduce(self.itens, function (sum, e) {
          return sum + self.total(e);
        }, 0);
      var discount = self.sell.discount ? value * self.sell.discount / 100 : 0;
      return value - discount;
    }
    ;
    function remove(item) {
      SellService.removeItem(item.id).then(function () {
        _.remove(self.itens, { id: item.id });
        self.closeItem();
      }, {});
    }
    ;
    function charge() {
      if (self.sell.payment > self.totalSell()) {
        return self.sell.payment - self.totalSell();
      } else {
        return 0;
      }
    }
    ;
    function close() {
      var sell = _.clone(self.sell);
      sell.status = 'close';
      SellService.update(sell).then(function (data) {
        sell.status = 'close';
        $location.path('/sell');
      }, {});
    }
    ;
    function update() {
      self.sell.created_at = self.date;
      SellService.update(self.sell);
    }
    ;
  }
  ;
}());
(function () {
  'use strict';
  angular.module('pockApp').factory('SellService', [
    '$http',
    function ($http) {
      return {
        list: list,
        get: get,
        newSell: newSell,
        add: add,
        updateItem: updateItem,
        removeItem: removeItem,
        update: update,
        cancel: cancel
      };
      function list(start, end) {
        return $http({
          url: 'sell',
          method: 'GET',
          params: {
            start: start,
            end: end
          }
        }).then(function (response) {
          return response.data;
        }, {});
      }
      function get(id) {
        return $http({
          url: 'sell/' + id,
          method: 'GET'
        }).then(function (response) {
          return response.data;
        }, {});
      }
      function newSell() {
        return $http({
          url: 'sell',
          method: 'POST'
        }).then(function (response) {
          return response.data;
        }, {});
      }
      function add(id, product_id) {
        return $http({
          url: 'sell/' + id + '/item',
          method: 'POST',
          params: { product_id: product_id }
        }).then(function (response) {
          return response.data;
        }, {});
      }
      function updateItem(id, item) {
        return $http({
          url: '/sell/' + id + '/item/',
          method: 'PUT',
          data: { item: item }
        }).then(function (response) {
          return response.data;
        }, {});
      }
      function removeItem(id) {
        return $http({
          url: 'sell/item/' + id,
          method: 'DELETE'
        });
      }
      function update(sell) {
        return $http({
          url: 'sell/' + sell.id,
          method: 'PUT',
          data: { sell: sell }
        }).then(function (response) {
          return response.data;
        }, {});
      }
      function cancel(id) {
        return $http({
          url: 'sell/' + id,
          method: 'DELETE'
        });
      }
    }
  ]);
}());
(function () {
  'use strict';
  angular.module('pockApp').factory('Menu', Menu);
  function Menu() {
    console.log('MenuAction');
    return { action: 'Lista de produtos' };
  }
}());