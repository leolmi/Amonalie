'use strict';

angular.module('amonalieApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, $location, Auth, Amonalies) {
    $scope.menu = [
      { link: '/', icon: 'fa-table' },
      { link: '/trella', icon: 'fa-trello' },
      { link: '/gantt', icon: 'fa-calendar' },
      { link: '/targets', icon: 'fa-tachometer' }
      //,{ link: '/test', icon: 'fa-bug' }
    ];

    $scope.version = '1.0.0';
    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;


    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
    $scope.doAction = function(action) {
      if (typeof action=='function')
        action();
    };

    $scope.isAssistant = function() {
      return Auth.isAssistant();
    };

    $scope.milk = function() {
      Amonalies.milk();
    };

    $scope.milking = Amonalies.milking();

    $scope.$on('MILKING', function() {
      $scope.milking = Amonalies.milking();
    });
  });
