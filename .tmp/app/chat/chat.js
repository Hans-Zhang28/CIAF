'use strict';

angular.module('eWebApp').config(function ($stateProvider) {
  $stateProvider.state('chat', {
    url: '/chat',
    templateUrl: 'app/chat/index.html',
    controller: 'ChatCtrl'
  });
});
//# sourceMappingURL=chat.js.map
