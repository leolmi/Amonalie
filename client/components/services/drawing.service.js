/**
 * Created by Leo on 04/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .factory('drawing', [function() {

    var drawLine = function(ctx, p1, p2, color, width) {
      color = color ? color : 'black';
      width = width ? width : 1;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.stroke();
    };

    var drawRect = function(ctx, p, size, color, width, linecolor) {
      color = color ? color : 'orange';
      ctx.lineWidth=0;
      linecolor = linecolor ? linecolor : 'black';
      ctx.beginPath();
      ctx.rect(p.x,p.y,size.w,size.h);
      ctx.fillStyle = color;
      ctx.fill();
      if (width>0) {
        ctx.lineWidth = width;
        ctx.strokeStyle = linecolor;
      }
      ctx.stroke();
    };

    var fillRect = function(ctx, p, size, color) {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.fillRect(p.x,p.y,size.w,size.h);
      ctx.stroke();
    };

    var drawText = function(ctx, text, p, font, color) {
      ctx.beginPath();
      ctx.font = font ? font : '12pt Calibri';
      ctx.fillStyle = color ? color : 'black';
      ctx.fillText(text, p.x, p.y);
      ctx.stroke();
    };

    var mesi = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
    var getMonth = function(m) {
      return mesi[m];
    };

    /**
     * il mese: (gennaio=1, ...., dicembre=12)
     * @param m
     * @param y
     * @returns {number}
     */
    var getDaysInMonth = function(m,y) {
      return new Date(y, m, 0).getDate();
    };

    return {
      getMonth: getMonth,
      getDaysInMonth: getDaysInMonth,
      drawLine: drawLine,
      drawRect: drawRect,
      drawText: drawText,
      fillRect: fillRect
    }
  }]);
