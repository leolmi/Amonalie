/**
 * Created by Leo on 24/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .factory('cache', ['socket','Auth','Amonalies',function(socket,Auth,Amonalies) {
    var _uid = undefined;
    var _context = {
      amonalies: [],
      targets: [],
      idle: false,
      o:{
        selection: [],
        table:{
          filter: {code:'', app:'', obj:'', desc:''},
          mine: false,
          rev: false,
          exp: '',
          col: undefined
        },
        gantt: {
          date: new Date()
        },
        targets: {
          mine:false
        },
        filters: {
          amonalies: '',
          dafare: '',
          fando: '',
          fatto: '',
          actions: ''
        }
      }
    };

    function reset(collections) {
      if (collections) {
        _context.amonalies = [];
        _context.targets = [];
      }

      _context.o.selection = [];

      _context.o.gantt.date = new Date();

      _context.o.targets.mine = false;

      _context.o.filters.amonalies = '';
      _context.o.filters.dafare = '';
      _context.o.filters.fando = '';
      _context.o.filters.fatto = '';
      _context.o.filters.actions = '';

      _context.o.table.filter = {code:'', app:'', obj:'', desc:''};
      _context.o.table.mine = false;
      _context.o.table.rev = false;
      _context.o.table.exp = '';
      _context.o.table.col = undefined;
    }

    /**
     * Seleziona l'elemento, se notoggle è falso e l'oggetto è già selezionato lo deseleziona
     * @param a
     * @param {Boolean} [notoggle]
     */
    var select = function(a, notoggle) {
      if (!a) return;
      var idx = _context.o.selection.indexOf(a);
      if (idx<0)
        _context.o.selection.push(a);
      else if (!notoggle)
        _context.o.selection.splice(idx,1);
    };

    function check(cb) {
      cb = cb || angular.noop;
      Auth.isLoggedInAsync(function(islogged) {
        if (islogged) {
          var uid = Auth.getCurrentUser()._id;
          if (_uid!=uid) {
            _uid = uid;
            reset();
            if (!_context.amonalies || !_context.amonalies.length)
              refresh(cb);
            else cb();
          }
          else cb();
        }
        else {
          reset(true);
          cb();
        }
      });
    }

    function refresh(cb){
      if (_context.idle) return;
      _context.idle = true;
      cb = cb || angular.noop;
      Amonalies.get(function(err, a, t) {
        if (!err) {
          _context.amonalies = a;
          _context.targets = t;
          socket.syncUpdates('amonalie', _context.amonalies);
          socket.syncUpdates('target', _context.targets);
        }
        _context.idle = false;
        cb(_context);
      })
    }

    function flush(){
      socket.unsyncUpdates('amonalie');
      socket.unsyncUpdates('target');
    }

    return {
      select:select,
      check:check,
      refresh:refresh,
      flush:flush,
      context:_context
    }
  }]);
