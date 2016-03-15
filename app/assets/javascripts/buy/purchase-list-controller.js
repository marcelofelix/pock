'use strict';

angular.module('pockApp').
  controller('PurchaseListController', function(purchases, Upload){
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
    return self;
  });

