var app = angular.module('tadoos', ['settings', 'firebase']);

  app.controller('TadoosCtrl', function($scope, $filter, $firebase, $http) {
    var tadoos = new Firebase('https://blazing-torch-1878.firebaseio.com/tadoos'),
      settings = new Firebase('https://blazing-torch-1878.firebaseio.com/settings'),
      syncTadoos = $firebase(tadoos),
      syncSettings = $firebase(settings);

    $scope.settings = syncSettings.$asObject();

    $scope.tadoos = syncTadoos.$asArray();
    $scope.tadoos.loading = true;

    $scope.tadoos.$loaded(function() {
      $scope.tadoos.loading = false;
    });

    $scope.$watch('tadoos', function () {
      $scope.remainingCount = $filter('filter')($scope.tadoos, { isComplete: false }).length;
    }, true);

    $scope.create = function(newTadoo) {
      $scope.tadoos.$add({
        name: newTadoo.name,
        isComplete: false,
        createdOn: Firebase.ServerValue.TIMESTAMP
      }).then(function() {
        $scope.newTadoo.name = '';
      });
    };

    $scope.update = function(tadoo) {
      $scope.tadoos.$save(tadoo);
    };

    $scope.delete = function(tadoo) {
      $scope.tadoos.$remove(tadoo);
    };

    $scope.markComplete = function(tadoo) {
      if (tadoo.isComplete) {
        var sendMsg = true;
        tadoo.completedOn = Firebase.ServerValue.TIMESTAMP;
      }

      $scope.tadoos.$save(tadoo).then(function() {
        tadoo.phone = $scope.settings.phone;

        if (sendMsg) {
          $http.post('/sms', tadoo)
            .success(function(data) {
              console.log('Message sent: ' + data.body);
            })
            .error(function(err) {
              // error
          });
        }
      });
    };

    $scope.edit = function(tadoo) {
      $scope.isEditing = tadoo;
    };

    $scope.focus = function(tadoo) {
      $scope.isEditing = '';
    };
  });

  app.directive('tadoos', function() {
    return {
      restrict: 'E',
      templateUrl: 'templates/tadoos.html'
    }
  })

  app.directive('tadooForm', function() {
    return {
      restrict: 'E',
      templateUrl: 'templates/tadoo-form.html'
    }
  })

  app.directive('tadooFocus', function tadooFocus($timeout) {
    return function (scope, elem, attrs) {
      scope.$watch(attrs.tadooFocus, function (value) {
        if (value) {
          $timeout(function () {
            elem[0].focus();
          }, 0, false);
        }
      });
    };
  });
