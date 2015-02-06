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
          cb(amonalies);
        })
        .error(function(err){
          Logger.error('Errori nel caricamento delle amonalie', JSON.stringify(err));
        });
    }

    return {
      get: getAmonalies
    }
  }]);
