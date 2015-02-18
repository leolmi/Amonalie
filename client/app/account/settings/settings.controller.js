'use strict';

angular.module('amonalieApp')
  .controller('SettingsCtrl', function ($scope, $http, User, Auth, Logger) {
    $scope.errors = {};

    $scope.c_user = Auth.getCurrentUser();
    $scope.userdata = {
      name: $scope.c_user.name,
      email: $scope.c_user.email
    };
    $scope.assistant = $scope.c_user.assistant.length ? $scope.c_user.assistant[0] : { username:'', password:'' } ;

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};

    $scope.updateAssistant = function() {
      $http.post('/api/users/assistant/'+$scope.c_user._id, $scope.assistant)
        .success(function(){
          $scope.c_user.assistant = [{username:$scope.assistant.username,password:$scope.assistant.password}];
          Logger.ok('Account assistant aggiornato correttamente!');
        })
        .error(function(err){
          Logger.error('Errori nell\'aggiornamento dell\'account assistant!', JSON.stringify(err));
        });
    };

    $scope.updateUser = function() {
      $http.post('/api/users/data/'+$scope.c_user._id, $scope.userdata)
        .success(function(){
          $scope.c_user.name = $scope.userdata.name;
          $scope.c_user.email = $scope.userdata.email;
          Logger.ok('Account utente aggiornato correttamente!');
        })
        .error(function(err){
          Logger.error('Errori nell\'aggiornamento dell\'account utente!', JSON.stringify(err));
        });
    };
  });
