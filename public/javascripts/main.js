'use strict';

angular
  .module('pockApp', [
    'ngRoute',
    'ngMaterial',
    'ui-notification',
    'ui.utils.masks',
    'ngFileUpload'
  ]).config(function($routeProvider, $httpProvider, $mdThemingProvider){
    $httpProvider.interceptors.push('httpLoading')
    $routeProvider
    // .when('/', {
    //   templateUrl: 'javascripts/home/home.html'
    // })
    .when('/product', {
      templateUrl: 'javascripts/product/product-list.html',
      controller: 'ProductListController',
      controllerAs: 'vm',
      resolve: {
        products: function(ProductService){
          return ProductService.list();
        }
      }
    })
    .when('/product/new', {
      templateUrl: 'javascripts/product/product.html',
      controller: 'ProductController',
      controllerAs: 'vm',
      resolve: {
        product: function($route){
          return {};
        }
      }
    })
    .when('/product/:code', {
      templateUrl: 'javascripts/product/product.html',
      controller: 'ProductController',
      controllerAs: 'vm',
      resolve: {
        product: function($route, ProductService){
          return ProductService.get($route.current.params.code);
        }
      }
    })
    .when('/purchase', {
      templateUrl: 'javascripts/purchase/purchase-list.html',
      controller: 'PurchaseListController',
      controllerAs: 'vm',
      resolve: {
        purchases: function(PurchaseService){
          return PurchaseService.list();
        }
      }
    })
    .when('/purchase/:id', {
      templateUrl: 'javascripts/purchase/purchase.html',
      controller: 'PurchaseController',
      controllerAs: 'vm',
      resolve: {
        purchase: function($route, PurchaseService){
          return PurchaseService.get($route.current.params.id);
        }
      }
    })
    .when('/sell', {
      templateUrl: 'javascripts/sell/sell-list.html',
      controller: 'SellListController',
      controllerAs: 'vm',
      resolve: {
        sells: function(SellService){
          return SellService.list(moment().startOf('month').toDate(), moment().endOf('month').toDate());
        }
      }
    })
    .when('/sell/:id', {
      templateUrl: 'javascripts/sell/sell.html',
      controller: 'SellController',
      controllerAs: 'vm',
      resolve: {
        sell: function(SellService, $route){
          return SellService.get($route.current.params.id);
        },
        products: function(ProductService){
          return ProductService.list();
        }
      }
    });
  });
