/**
 * Created by Leo on 04/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .factory('Amonalies', ['$http','Logger', function($http,Logger) {
    //var getAmonalies = function() {
    //  return [
    //    {
    //      code:'263514',
    //      app:'DataPainter',
    //      desc:'asdfaf sdf asdfasdfasdfs',
    //      state: 'fando',
    //      tasks: [
    //        {owner:'leo', start:3231546, end:0, work:''}],
    //      params: [
    //        {name:'priority',value:'3'},
    //        {name:'stima',value:'6'},
    //        {name:'ref. tech',value:'zanella'}]
    //    },{
    //      code:'263115',
    //      app:'WikiReports',
    //      desc:'asdfaf sdf asdfasdfasdfs',
    //      state: 'dafare',
    //      tasks: [
    //        {owner:'yuri', start:0, end:0, work:''}
    //      ],
    //      params: [
    //        {name:'priority',value:'3'},
    //        {name:'stima',value:'6'},
    //        {name:'ref. tech',value:'zanella'}]
    //    },{
    //      code:'262555',
    //      app:'QueryBuilder',
    //      desc:'asdfaf sdf asdfasdfasdfs',
    //      state: undefined,
    //      tasks: [],
    //      params: [
    //        {name:'priority',value:'3'},
    //        {name:'stima',value:'6'},
    //        {name:'ref. tech',value:'zanella'}]
    //    }
    //  ];
    //};

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
          });
          cb(amonalies);
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
      get: getAmonalies,
      milk:milk
    }
  }]);
