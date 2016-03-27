'use strict';

angular.module('pockApp').
  controller('PurchaseListController', function(purchases, Upload, $location){
    var self = this;
    self.purchases = purchases;
    self.uploadFiles = function(file, errFile){
      if(file){
        file.upload = Upload.upload({
          url: 'purchase/import',
          data: {file: file}
        });

        file.upload.then(function(response){
          console.log('ok');
        },{});
      }
    };

    self.show = function(purchase){
      $location.path('/purchase/'+purchase.id);
    };
    return self;
  });

