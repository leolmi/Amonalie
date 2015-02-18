/**
 * Created by Leo on 04/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .factory('Amonalies', ['$http','Logger','Auth', function($http, Logger, Auth) {
    /**
     * Restituisce l'elenco delle amonalie
     * @param cb
     */
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
    /**
     * Elimina l'amonalia
     * @param a
     * @param cb
     */
    var deleteAmonalia = function(a, cb) {
      cb = cb || angular.noop;
      var args = {
        action: 'remove',
        a: a
      };
      return manageAmonalia(args, cb)
    };

    var updateAmonalia = function(a, cb) {
      cb = cb || angular.noop;
      $http.put('/api/amonalie/'+ a._id, a)
        .success(function(a){
          cb(a);
        })
        .error(function(err){
          Logger.error(JSON.stringify(err), 'Errori nell\'aggiornamento dell\'anomalia '+ a.code);
        });
    };

    /**
     * Gestisce l'amonalia
     * @param args
     * @param cb
     */
    var manageAmonalia = function(args, cb) {
      cb = cb || angular.noop;
      $http.post('/api/amonalie/manage', args)
        .success(function(a){
          cb(a);
        })
        .error(function(err){
          Logger.error(JSON.stringify(err), 'Errori nella gestione dell\'anomalia '+ a.code);
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

    var milk = function(options) {
      var user = Auth.getCurrentUser();
      if (!user.assistant.length || !user.assistant[0].username || !user.assistant[0].password) {
        alert('Impostare un account assistant valido e riprovare!')
        return;
      };

      options = options || {};

      $http.post('/api/amonalie/assistant/'+user._id, options)
        .success(function(result){
          Logger.ok(JSON.stringify(result), 'Ricevuto');
        })
        .error(function(err){
          Logger.error(JSON.stringify(err), 'Errori nel caricamento delle amonalie');
        });
    };

    var dragging = {};

    return {
      deleteAmonalia:deleteAmonalia,
      updateAmonalia:updateAmonalia,
      useTargets:getTargets,
      deleteTarget:deleteTarget,
      get: getAmonalies,
      milk:milk,
      dragging:dragging
    }
  }]);
