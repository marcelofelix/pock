'use strict';

angular.module('pockApp').
  controller('PurchaseListController', function(purchases, Upload, $location, PurchaseService){
    var self = this;
    self.purchases = purchases;
    self.uploadFiles = function(file, errFile){
      if(file){
        file.upload = Upload.upload({
          url: 'purchase/import',
          data: {file: file}
        });

        file.upload.
          then(PurchaseService.list().
              then(function(data){
                self.purchases = data;
              }));
      }
    };

    self.show = function(purchase){
      $location.path('/purchase/'+purchase.id);
    };
    return self;
  });

