'use strict';

angular.module('amonalieApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      link: '/',
      icon: 'fa-home'
    },{
      link: '/gantt',
      icon: 'fa-calendar'
    }];
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


  });
