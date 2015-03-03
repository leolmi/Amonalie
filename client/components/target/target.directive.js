/**
 * Created by Leo on 10/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .directive('target', ['$http','$timeout','drawing','Modal','Amonalies','Gantt', function ($http,$timeout,drawing,Modal,Amonalies,Gantt) {
    return {
      restrict: 'E',
      scope: { target: '=ngModel', amonalies:'='},
      templateUrl: 'components/target/target.html',
      link: function (scope, elm, atr) {

        scope.isCollapsed = true;

        var rows = [];

        Amonalies.getUsers(function(users){
          // ordina gli utenti per nome
          users.sort(function(u1, u2){return u1.name.localeCompare(u2.name)});
          // aggiunge (come primo) l'utente "non assegnato"
          users.unshift({_id:0, name:'non assegnate'});
          // costruisce le righe
          users.forEach(function(u){
            rows.push({user:u});
          });
          //alert('rows: '+rows.length+'   amonalies:'+scope.amonalies.length);
          // cerca i task nelle anomalie
          scope.amonalies.forEach(function(a){
            a.tasks.forEach(function(t){
              // se il task è assegnato a questo obiettivo...
              if (t.target==scope.target._id){
                var uid = t.owner ? t.owner : 0;
                var rres = $.grep(rows, function(r) { return r.user._id==uid; });
                if (rres.length) {
                  if (!rres[0].tasks)
                    rres[0].tasks = [];
                  // aggiunge il task
                  var tw = Amonalies.getTaskWrapper(t, a);
                  rres[0].tasks.push(tw);
                }
              }
            });

            scope.detailrows = rows;
          });
        });





        scope.getDate = function() {
          return (new Date(scope.target.date)).toLocaleString();
        };
        scope.toggle = function() {
          scope.isCollapsed = !scope.isCollapsed;
        };
        var value = Math.floor((Math.random() * 100) + 1);
        var type;

        if (value < 25) {
          type = 'danger';
        } else if (value < 50) {
          type = 'warning';
        } else if (value < 85) {
          type = 'info';
        } else {
          type = 'success';
        }

        scope.dynamic = value;
        scope.type = type;
        scope.info = {
          w:100,
          h:100,
          color:'#222',
          value:value,
          i_color:drawing.colors(type),
          i_size:'15'
        };



        $timeout(function() {
          scope.$broadcast("TARGET_REFRESH", scope.info);
          var bg_color = (scope.target.active) ? scope.info.i_color.background : '#aaa';
          var br_color = (scope.target.active) ? scope.info.i_color.line : '#666';

          elm.css('background-color', bg_color);
          elm.css('border-color', br_color);
        });

        var modalDelete = Modal.confirm.delete(function(target) {
          Amonalies.deleteTarget(target);
        });

        if (!scope.target.author_name) {
          $http.get('/api/users/name/' + scope.target.author)
            .success(function (name) {
              scope.target.author_name = name;
            })
            .error(function(err){
              scope.target.author_name = 'sconosciuto';
            });
        }

        scope.getDueDays = function() {
          var now = (new Date()).getTime();
          var _MS_PER_DAY = 1000 * 60 * 60 * 24;
          var timeDiff = scope.target.date - now;
          return Math.floor(timeDiff / _MS_PER_DAY)+1;
        };

        scope.delete = function() {
          modalDelete(scope.target.name, scope.target);
        };

        scope.edit = function() {
          Amonalies.editTarget(scope.target);
        };

        scope.openTask = function(t) { Gantt.showTaskDetail(t); };
      }
    }
  }]);
