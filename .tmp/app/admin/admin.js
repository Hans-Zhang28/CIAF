'use strict';

angular.module('eWebApp').config(function ($stateProvider) {
  $stateProvider.state('admin', {
    url: '/admin',
    templateUrl: 'app/admin/admin.html',
    controller: 'AdminCtrl'
  });
});
//# sourceMappingURL=admin.js.map
