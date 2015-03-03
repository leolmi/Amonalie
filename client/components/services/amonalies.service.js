/**
 * Created by Leo on 04/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .factory('Amonalies', ['$http','$rootScope','$location','Utilities','Logger','Auth','Modal', function($http,$rootScope,$location,Utilities,Logger,Auth,Modal) {
    var _states = ['dafare','fando','fatto'];
    var _amonalies = [];
    var _colors = [
      "#FE2E2E", "#FE642E", "#FE2E64", "#FE9A2E", "#FE2E9A", "#FACC2E", "#FE2EC8", "#F7FE2E",
      "#FE2EF7", "#C8FE2E", "#CC2EFA", "#9AFE2E", "#9A2EFE", "#64FE2E", "#642EFE", "#2EFE2E",
      "#2E2EFE", "#2EFE64", "#2E64FE", "#2EFE9A", "#2E9AFE", "#2EFEC8", "#2ECCFA", "#2EFEF7"
    ];
    var _users = [];
    var _apps = [];
    var _milking = false;
    var dragging = {};




    /**
     * Verifica le amonalie note all'utente
     * @param amonalies
     */
    var checkKnown = function(amonalies) {
      if (amonalies && amonalies.length) {
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
     * Restituisce il colore associato all'app
     * @param app
     * @returns {string}
     */
    var getAppColor = function(app){
      var lng = _colors.length;
      var pos = _apps.indexOf(app);
      var idx = pos % lng;
      return (idx<0) ? 'white' : _colors[idx];
    };

    /**
     * Restituisce l'elenco degli obiettivi
     * @param cb
     */
    var getTargets = function(cb) {
      cb = cb || angular.noop;
      $http.get('/api/targets')
        .success(function(targets){
          cb(targets);
        })
        .error(function(err){
          Logger.error('Errori nel caricamento dei targets', JSON.stringify(err));
          cb();
        });
    };

    /**
     * Restituisce l'elenco delle amonalie
     * @param cb
     */
    var getAmonalies = function(cb) {
      cb = cb || angular.noop;
      _apps = [];
      $http.get('/api/amonalie')
        .success(function(amonalies){
          //inserisce le info sui targets
          getTargets(function(targets) {
            amonalies.forEach(function (a) {
              if (_apps.indexOf(a.app)<0)
                _apps.push(a.app);
              if (targets && a.tasks.length && targets.length)
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
            cb(undefined, amonalies, targets);
          });
        })
        .error(function(err){
          cb(err);
          Logger.error('Errori nel caricamento delle amonalie', JSON.stringify(err));
        });
    };

    /**
     * Apre l'editor modale per modificare l'amonalia
     * @type {Function}
     */
    var modalEditAmonalia = Modal.confirm.editamonalia(function(info){
      if (info.history && !info.a.archived && !confirm('Attenzione, l\'anomalia sarà archiviata negli storici, continuare?')) {
        info.def.reject();
        return;
      }
      if (info.a.tasks.length) {
        info.a.tasks.forEach(function (t) {
          if (t.dates) {
            t.start = (t.dates.start) ? Utilities.getDateNum(t.dates.start) : null;
            t.end = (t.dates.end) ? Utilities.getDateNum(t.dates.end) : null;
          }
        });
      }
      if (info.obj.state)
        info.a.state = info.obj.state;
      if (info.def && info.def.resolve)
        info.def.resolve();
      if (info.history) {
        info.a.archived = info.a.archived ? false : true;
      }

      update('amonalie',info.a,'Amonalia','code');
    });
    /**
     * Modifica un'amonalia
     * @param amonalia
     * @param opt
     */
    var editAmonalia = function(amonalia, opt){
      if (opt) {
        switch(opt.state) {
          //fatte
          case _states[2]:
            //TODO: verifica la chiusura di tutti i task dell'anomalia
            break;
          //fando
          case _states[1]:
            //TODO: se non esiste un task aperto ne crea uno nuovo
            break;
          //da fare
          case _states[0]:
            break;
        }
      }

      if (!amonalia.state && !opt)
        opt = { state:'dafare' };

      var info = {
        title: '<strong>'+amonalia.code+'</strong> - '+amonalia.app,
        a: amonalia,
        t: opt ? opt.task : undefined,
        obj: {
          state: opt ? opt.state : amonalia.state,
          note: amonalia.note
        },
        readonly: opt ? opt.readonly : false,
        def: opt ? opt.def : undefined
      };
      modalEditAmonalia(info);
    };

    var createAmonalia = function() {
      //TODO: Crea una nuova amonalia
      Logger.info('Crea una nuova amonalia','(da implementare)');
    };
    /**
     * Apre l'editor modale per modificare l'elenco delle amonalie selezionate
     * @type {Function}
     */
    var modalEditSelection = Modal.confirm.editlist(function(args){
      var userid = Auth.getCurrentUser()._id;
      switch(args.action) {
        //Assegna lo stato alle anomalie selezionate
        case 0:
          ona(args.list, function(a) {
            var tofando = args.o.state=='fando';
            a.state = args.o.state;
            onActiveTasks(a, tofando, function(t){
              if (args.o.task) {
                if (args.o.owner && !t.owner) t.owner = args.o.owner;
                if (args.o.target && !t.target) t.target = args.o.target;
                if (args.o.start && !t.start) t.start = args.o.start;
              }
              if (!t.owner)
                t.owner = userid;
            });
            updateAmonalia(a);
          });
          break;
        //Imposta l'obiettivo scelto alle amonalie selezionate
        case 1:
          if (!args.o.target)
            Logger.warning('Nessun obiettivo selezionato!');
          else {
            ona(args.list, function(a) {
              a.tasks.forEach(function(t){
                if (!t.end)
                  t.target = args.o.target;
              });
              updateAmonalia(a);
            });
          }
          break;
        //Archivia le amonalie selezionate chiudendo tutte le attività in corso
        case 2:
          ona(args.list, function(a) {
            a.archived = true;
            a.tasks.forEach(function(t){
              if (!t.start)
                t.start = (new Date()).getTime();
              if (!t.end)
                t.end = (new Date()).getTime();
            });
            updateAmonalia(a);
          });
          break;
      }
    });

    /**
     * Modifica l'elenco delle amonalie selezionate
     * @param selection
     */
    var handleSelection = function(selection) {
      if (!selection || selection.length<=0) {
        Logger.warning('Nessun elemento selezionato');
        return;
      }
      var args = {
        title: 'Modifica '+selection.length+(selection.length>1 ? ' amonalie' : 'amonalia'),
        list: selection,
        action: 0,
        o: {
          task: false,
          state:'dafare',
          owner:Auth.getCurrentUser()._id,
          target:'',
          date:null
        }
      };
      modalEditSelection(args);
    };

    /**
     * Scorre la lista delle amonalie ed esegue per ciascuna il metodo passato
     * @param list
     * @param action
     */
    function ona(list, action){
      while(list.length) {
        var a = list.pop();
        action(a);
      }
    }
    /**
     * Restituisce un nuovo task
     * @param {String} [userid]
     * @returns {{owner: *, start: null, end: null, work: string, notes: string, target: string}}
     */
    var getNewTask = function(userid) {
      return {
        owner:userid ? userid : '',
        start:null,
        end:null,
        work:'',
        notes:'',
        target:''
      };
    };
    /**
     * restituisce vero se il task è attivo
     * @param t
     */
    var isActive = function(t) {
      return !t.end;
    };
    /**
     * Permette di lavorare sui task attivi
     * @param a
     * @param {Boolean} create
     * @param {Function} h
     */
    function onActiveTasks(a, create, h) {
      var actives = 0;
      a.tasks.forEach(function(t) {
        if (isActive(t)){
          actives++;
          h(t);
        }
      });
      if (create && actives<1) {
        var t = getNewTask();
        a.tasks.push(t);
        h(t);
      }
    }


    var modalEditTarget = Modal.confirm.edittarget(function(info){
      if (info.history && !info.target.archived && !confirm('Attenzione, l\'obiettivo sarà archiviato negli storici, continuare?')) {
        info.def.reject();
        return;
      }

      info.target.name = info.obj.title;
      info.target.info = info.obj.desc;
      info.target.active = info.obj.active;
      info.target.date = Utilities.getDateNum(info.obj.date);
      if (info.history) {
        info.target.archived = info.target.archived ? false : true;
      }

      update('targets',info.target,'Obiettivo');
    });

    function update(dest, obj, typedesc, namep) {
      namep = namep || 'name';
      if (obj._id){
        $http.put('/api/'+dest+'/'+obj._id, obj)
          .success(function(){
            Logger.ok(typedesc+' "'+ obj[namep]+'" aggiornato correttamente!');
          })
          .error(function(err){
            Logger.error('Errori nell\'aggiornamento di ('+typedesc+'): "'+ obj[namep]+'"', JSON.stringify(err));
          });
      }
      else {
        $http.post('/api/'+dest, obj)
          .success(function(){
            Logger.ok(typedesc+' "'+ obj[namep]+'" creato correttamente!');
          })
          .error(function(err){
            Logger.error('Errori nella creazione dell\'elemento di tipo '+typedesc, JSON.stringify(err));
          });
      }
    }

    var createNewTarget = function() {
      Auth.isLoggedInAsync(function(islogged) {
        if (islogged) {
          var target = {
            name: 'Nuovo obiettivo',
            info: '',
            author: Auth.getCurrentUser()._id,
            active: true,
            archived: false,
            date: (new Date()).getTime()
          };
          editTarget(target);
        }
      });
    };

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

    /**
     * Restituisce l'elenco degli utente registrati
     * @param {Function} cb
     * @param {Boolean} [refresh]
     */
    var getUsers = function(cb, refresh) {
      if (refresh || _users.length<=0) {
        $http.get('/api/users/list/')
          .success(function (users) {
            _users = users;
            cb(_users);
          })
          .error(function (err) {
            Logger.error('Errori durante l\'enumerazione degli utenti', JSON.stringify(err));
            cb();
          });
      }
      else cb(_users);
    };

    var getUserName = function(users, uid) {
      var result = $.grep(users, function (u) { return (u._id==uid); });
      return (result.length) ? result[0].name : '';
    };


    var milk = function(options) {
      var user = Auth.getCurrentUser();
      if (!user.assistant.length || !user.assistant[0].username || !user.assistant[0].password) {
        $location.path('/settings').search('message=assistant');
        return;
      }
      if (_milking) {
        Logger.warning('Mungitura in corso!','attendere...');
        return;
      }
      _milking = true;
      $rootScope.$broadcast('MILKING');
      options = options || {};

      $http.post('/api/amonalie/assistant/'+user._id, options)
        .success(function(result){
          var report = 'Aggiunte:'+result.added.length+'; Aggiornate:'+result.updated.length+'; Scartate:'+result.discards.length+';';
          _milking = false;
          Logger.ok('Milk Terminato!', report);
        })
        .error(function(err){
          _milking = false;
          Logger.error('Errori nella mungitura di assistant!', JSON.stringify(err));
        })
        .then(function() {
          _milking = false;
          $rootScope.$broadcast('MILKING');
        });
    };

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

    var getTaskWrapper = function(t,a) {
      var style = 'primary';
      switch (a.state){
        case('dafare'): style='danger'; break;
        case('fando'): style='warning'; break;
        case('fatto'): style='success'; break;
      }
      return {
        a:a,
        t:t,
        style:style,
        user_id: t.owner
      }
    };

    return {
      states:function() { return _states; },
      apps:function(){return _apps;},
      milking:function(){return _milking;},
      createAmonalia:createAmonalia,
      editAmonalia:editAmonalia,
      handleSelection:handleSelection,
      getAppColor:getAppColor,
      createNewTarget:createNewTarget,
      editTarget:editTarget,
      getDateStr:getDateStr,
      deleteAmonalia:deleteAmonalia,
      updateAmonalia:updateAmonalia,
      deleteTarget:deleteTarget,
      get: getAmonalies,
      getUsers:getUsers,
      getUserName:getUserName,
      getNewTask:getNewTask,
      getTaskWrapper:getTaskWrapper,
      milk:milk,
      checkKnown:checkKnown,
      dragging:dragging
    }
  }]);
