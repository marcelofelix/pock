'use strict';

angular
  .module('pockApp', [
    'ngRoute',
    'ngMaterial',
    'ui-notification',
    'ui.utils.masks',
    'ngFileUpload',
    'templates'
  ]).config(function($routeProvider){
    $routeProvider
    .when('/', {
      templateUrl: 'home/home.html'
    })
    .when('/product', {
      templateUrl: 'product/product-list.html',
      controller: 'ProductListController',
      controllerAs: 'vm',
      resolve: {
        products: function(ProductService){
          return ProductService.list();
        }
      }
    })
    .when('/product/new', {
      templateUrl: 'product/product.html',
      controller: 'ProductController',
      controllerAs: 'vm',
      resolve: {
        product: function($route){
          return {};
        }
      }
    })
    .when('/product/:code', {
      templateUrl: 'product/product.html',
      controller: 'ProductController',
      controllerAs: 'vm',
      resolve: {
        product: function($route, ProductService){
          return ProductService.get($route.current.params.code);
        }
      }
    })
    .when('/purchase', {
      templateUrl: 'buy/purchase-list.html',
      controller: 'PurchaseListController',
      controllerAs: 'vm',
      resolve: {
        purchases: function(PurchaseService){
          return PurchaseService.list();
        }
      }
    });
  });
