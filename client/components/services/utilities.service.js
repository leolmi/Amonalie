/**
 * Created by Leo on 02/03/2015.
 */
'use strict';

angular.module('amonalieApp')
  .factory('Utilities', ['Logger', function (Logger) {
    /**
     * Restituisce l'indice dell'oggetto con il valore della proprietà
     * @param array
     * @param attr
     * @param value
     * @returns {number}
     */
    function indexOfByValue(array, attr, value) {
      for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] == value) {
          return i;
        }
      }
      return -1;
    }
    /**
     * Restituisce una data dalla stringa
     * @param dt
     * @returns {Date}
     */
    function getDateByString(dt) {
      var d = new Date();
      var v = dt.split('/');
      if (v && v.length>2){
        d = new Date(v[2],v[1],v[0]);
      }
      return d;
    };
    /**
     * Restituisce una data dal valore numerico
     * @param dt
     * @returns {number|*}
     */
    function getDateNum(dt) {
      if (typeof dt=='string')
        dt = getDateByString(dt);
      if (!dt.getTime)
        dt = new Date();
      return dt.getTime();
    };
    return {
      indexOfByValue:indexOfByValue,
      getDateByString:getDateByString,
      getDateNum:getDateNum
    }
  }]);
