/**
 * Created by Leo on 04/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .factory('Amonalies', ['$http','$location','Logger','Auth', function($http, $location, Logger, Auth) {
    var _amonalies = [];

    var checkKnown = function(amonalies) {
      if (amonalies && amonalies.length) {
        //alert('amonalies:  nuove:'+amonalies.length+'  viste:'+_amonalies.length);
        if (_amonalies.length) {
          amonalies.forEach(function (a) {
            a.new = !$.grep(_amonalies, function (exa) { return exa.code == a.code; }).length;
          });
        }
        else if (!_amonalies.length)
          _amonalies = amonalies;
      }
    };

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
            checkKnown(amonalies);
            cb(amonalies, targets);
          });
        })
        .error(function(err){
          Logger.error('Errori nel caricamento delle amonalie', JSON.stringify(err));
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
          Logger.error('Errori nell\'aggiornamento dell\'anomalia '+ a.code, JSON.stringify(err));
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
          Logger.error('Errori nella gestione dell\'anomalia '+ a.code, JSON.stringify(err));
        });
    };

    var getTargets = function(cb) {
      cb = cb || angular.noop;
      $http.get('/api/targets')
        .success(function(targets){
          cb(targets);
        })
        .error(function(err){
          Logger.error('Errori nel caricamento dei targets', JSON.stringify(err));
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
          Logger.error('Errori durante l\'eliminazione del target', JSON.stringify(err));
        });
    };

    var _milking = false;
    var milk = function(options) {
      var user = Auth.getCurrentUser();
      if (!user.assistant.length || !user.assistant[0].username || !user.assistant[0].password) {
        $location.path('/settings').search('message=assistant');
        return;
      };
      if (_milking) {
        alert('Mungitura già in corso, attendere...');
        return;
      }
      _milking = true;
      options = options || {};

      $http.post('/api/amonalie/assistant/'+user._id, options)
        .success(function(result){
          var report = 'Aggiunte:'+result.added.length+'; Aggiornate:'+result.updated.length+'; Scartate:'+result.discards.length+';';
          Logger.ok('Milk Terminato!', report);
          _milking = false;
        })
        .error(function(err){
          Logger.error('Errori nel caricamento delle amonalie', JSON.stringify(err));
          _milking = false;
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
      checkKnown:checkKnown,
      dragging:dragging
    }
  }]);
