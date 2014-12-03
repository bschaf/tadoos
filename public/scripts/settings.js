(function() {
  var app = angular.module('settings', []);

  app.controller('SettingsCtrl', function($scope, $filter, $firebase) {
    var settings = new Firebase('https://blazing-torch-1878.firebaseio.com/settings'),
      syncSettings = $firebase(settings);

    $scope.settings = syncSettings.$asObject();

    $scope.save = function(settings) {
      $scope.settings.$save({
        phone: settings.phone
      }).then(function() {
        //
      });
    };
  });

  app.directive('settings', function() {
    return {
      restrict: 'E',
      templateUrl: 'settings.html'
    }
  });
})();
