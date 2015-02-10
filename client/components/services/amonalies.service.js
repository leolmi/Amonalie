/**
 * Created by Leo on 04/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .factory('Amonalies', ['$http','Logger', function($http,Logger) {
    var getAmonalies = function(cb) {
      cb = cb || angular.noop;
      $http.get('/api/amonalie')
        .success(function(amonalies){
          //inserisce le info sui targets
          getTargets(function(targets) {
            amonalies.forEach(function (a) {
              if (a.tasks.length)
                a.tasks.forEach(function (t) {
                  if (t.target) {
                    var result = $.grep(targets, function (target) {
                      return (target._id == t.target);
                    });
                    if (result.length)
                      t.target_info = result[0];
                  }
                });
            });
            cb(amonalies, targets);
          });
        })
        .error(function(err){
          Logger.error(JSON.stringify(err), 'Errori nel caricamento delle amonalie');
        });
    };

    var getTargets = function(cb) {
      cb = cb || angular.noop;
      $http.get('/api/targets')
        .success(function(targets){
          cb(targets);
        })
        .error(function(err){
          Logger.error(JSON.stringify(err), 'Errori nel caricamento dei targets');
        });
    };

    var deleteTarget = function(target, cb) {
      cb = cb || angular.noop;
      $http.delete('/api/targets/' + target._id)
        .success(function(){
          Logger.ok(target.name+' eliminato correttamente.');
          cb();
        })
        .error(function(err){
          Logger.error(JSON.stringify(err), 'Errori durante l\'eliminazione del target');
        });
    };

    var milk = function() {
      var options = {
        user: 'testuser',
        password: 'testpsw'
      };
      $http.post('/api/amonalie/assistant', options)
        .success(function(result){
          Logger.ok(JSON.stringify(result), 'Ricevuto');
        })
        .error(function(err){
          Logger.error(JSON.stringify(err), 'Errori nel caricamento delle amonalie');
        });
    };

    return {
      useTargets:getTargets,
      deleteTarget:deleteTarget,
      get: getAmonalies,
      milk:milk
    }
  }]);
