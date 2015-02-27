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
    }

    function init(cb) {
      Auth.isLoggedInAsync(function(islogged) {
        if (islogged) {
          var uid = Auth.getCurrentUser()._id;
          if (_uid!=uid) {
            _uid = uid;
            reset();
            refresh(cb);
          }
        }
        else reset(true);
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
      init:init,
      refresh:refresh,
      flush:flush,
      context:_context
    }
  }]);
