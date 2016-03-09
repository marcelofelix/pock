'use strict';

angular
  .module('pockApp', [
    'ngRoute',
    'ngMaterial',
    'templates'
  ]).config(function($routeProvider){
    $routeProvider
    .when('/', {
      templateUrl: 'home/home.html'
    })
    .when('/product', {
      templateUrl: 'product/product.html',
      controller: 'ProductController'
    });
  });
