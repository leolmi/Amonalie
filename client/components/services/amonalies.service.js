/**
 * Created by Leo on 04/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .factory('Amonalies', ['$http','$rootScope','$location','Logger','Auth','Modal', function($http, $rootScope, $location, Logger, Auth, Modal) {
    var _amonalies = [];
    var states = ['dafare','fando','fatto'];

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

    var modalEditTask = Modal.confirm.edittask(function(info){
      //alert('argomenti: '+JSON.stringify(info));
      if (info.history) {
        //TODO: Storicizzazione dell'attività
        alert('Storicizza l\'attività [da implementare]!');
        if (info.def)
          info.def.reject();
        return;
      }
      if (info.state)
        info.a.state = info.state;
      if (info.def && info.def.resolve)
        info.def.resolve();
    });

    var editTask = function(amonalia, opt){
      if (opt) {
        switch(opt.state) {
          //fatte
          case states[2]:
            //TODO: verifica la chiusura di tutti i task dell'anomalia
            break;
          //fando
          case states[1]:
            //TODO: se non esiste un task aperto ne crea uno nuovo
            break;
          //da fare
          case states[0]:
            break;
        }
      }

      var info = {
        title: 'Anomalia '+ amonalia.code,
        a: amonalia,
        obj: {
          state: opt ? opt.state : amonalia.state,
          note: amonalia.note
        },
        readonly: opt ? opt.readonly : false,
        def: opt ? opt.def : undefined
      };
      modalEditTask(info);
    };

    var modalEditTarget = Modal.confirm.edittarget(function(info){
      if (info.history) {
        //TODO: Storicizzazione dell'obiettivo
        alert('Storicizza l\'obiettivo [da implementare]!');
        if (info.def)
          info.def.reject();
        return;
      }

      info.target.name = info.obj.title;
      info.target.info = info.obj.desc;
      info.target.active = info.obj.active;
      info.target.date = getDateNum(info.obj.date);



      if (info.target._id){
        $http.put('/api/targets/'+info.target._id, info.target)
          .success(function(){
            Logger.ok('Obiettivo "'+ info.target.name+'" aggiornato correttamente!');
          })
          .error(function(err){
            Logger.error('Errori nell\'aggiornamento dell\'obiettivo "'+ info.target.name+'"', JSON.stringify(err));
          });
      }
      else {
        $http.post('/api/targets', info.target)
          .success(function(){
            Logger.ok('Obiettivo "'+ info.target.name+'" creato correttamente!');
          })
          .error(function(err){
            Logger.error('Errori nella creazione dell\'obiettivo "'+ info.target.name+'"', JSON.stringify(err));
          });
      }
    });

    var editTarget = function(target){
      var info = {
        title: target._id ? 'modifica Obiettivo' :  'Nuovo Obiettivo',
        target: target,
        obj: {
          title:target.name,
          desc: target.info,
          active: target.active,
          date: target.date
        }
      };

      modalEditTarget(info);
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
      $rootScope.$broadcast('MILKING');
      options = options || {};

      $http.post('/api/amonalie/assistant/'+user._id, options)
        .success(function(result){
          var report = 'Aggiunte:'+result.added.length+'; Aggiornate:'+result.updated.length+'; Scartate:'+result.discards.length+';';
          Logger.ok('Milk Terminato!', report);
        })
        .error(function(err){
          Logger.error('Errori nel caricamento delle amonalie', JSON.stringify(err));
        })
        .then(function() {
          _milking = false;
          $rootScope.$broadcast('MILKING');
        });
    };

    var dragging = {};

    var getDateStr = function(dt){
      if (typeof dt=='string')
        return dt;
      if (typeof dt =='number')
        dt = new Date(dt);
      if (!dt)
        dt = new Date();
      if (dt.getDate)
        return dt.getDate()+'/'+(dt.getMonth()+1)+'/'+dt.getFullYear();
    };

    var getDateByString = function(dt) {
      var d = new Date();
      var v = dt.split('/');
      if (v && v.length>2){
        d = new Date(v[2],v[1],v[0]);
      }
      alert('trasforma da: '+dt+'    a: '+ d.toLocaleString());
      return d;
    };

    var getDateNum = function(dt) {
      if (typeof dt=='string')
        dt = getDateByString(dt);
      if (!dt.getTime)
        dt = new Date();
      return dt.getTime();
    };

    return {
      editTask:editTask,
      editTarget:editTarget,
      getDateStr:getDateStr,
      deleteAmonalia:deleteAmonalia,
      updateAmonalia:updateAmonalia,
      useTargets:getTargets,
      deleteTarget:deleteTarget,
      get: getAmonalies,
      milk:milk,
      milking:function(){return _milking;},
      checkKnown:checkKnown,
      dragging:dragging
    }
  }]);
