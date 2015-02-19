'use strict';

angular.module('amonalieApp')
  .controller('AdminCtrl', ['$scope', '$http', 'Auth', 'User', 'Modal', 'Logger', function ($scope, $http, Auth, User, Modal, Logger) {
    // Use the User $resource to fetch all users
    $scope.users = User.query();

    var modalDelete = Modal.confirm.delete(function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
      Logger.ok('Utente '+ user.name+' eliminato correttamente!');
    });

    $scope.delete = function(user) {
      modalDelete(user.name, user);
    };

    $scope.isme = function(user) {
      return user._id == Auth.getCurrentUser()._id;
    };
  }]);
