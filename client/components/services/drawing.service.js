/**
 * Created by Leo on 04/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .factory('drawing', [function() {
    var colors = function(name) {
      var line_c = '#285e8e';
      var background_c = '#3276b1';
      var text_c = '#fff';

      switch(name) {
        case('primary'): line_c='#285e8e'; background_c='#3276b1'; text_c='#fff'; break;
        case('success'): line_c='#398439'; background_c='#47a447'; text_c='#fff'; break;
        case('warning'): line_c='#d58512'; background_c='#ed9c28'; text_c='#fff'; break;
        case('danger'): line_c='#ac2925'; background_c='#d2322d'; text_c='#fff'; break;
      }
      return { line:line_c, background:background_c,text:text_c };
    };

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
    var drawLineRect = function(ctx, p, size, color, width){
      color = color ? color : 'black';
      width = width ? width : 1;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x+size.w, p.y);
      ctx.lineTo(p.x+size.w, p.y+size.h);
      ctx.lineTo(p.x, p.y+size.h);
      ctx.lineTo(p.x, p.y);
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.stroke();
    }
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

    /**
     * Disegna un cerchio
     * @param ctx (contesto)
     * @param c (coordinate del centro: c.x c.y)
     * @param r (raggio)
     * @param [color] (colore interno)
     * @param [width] (spessore linea)
     * @param [linecolor] (colore linea)
     */
    var drawCircle = function(ctx, c, r, color, width, linecolor){
      color = color ? color : 'white';
      width = width ? width : 0;
      linecolor = linecolor ? linecolor : 'transparent';

      ctx.beginPath();
      ctx.arc(c.x, c.y, r, 0, 2 * Math.PI, false);
      ctx.fillStyle = color;
      ctx.fill();
      if (width>0) {
        ctx.lineWidth = width;
        ctx.strokeStyle = linecolor;
      }
      ctx.stroke();
    };

    /**
     * Disegna un arco in senso orario (0=asse x)
     * @param ctx (contesto)
     * @param c (coordinate del centro: c.x c.y)
     * @param r (raggio)
     * @param a (angoli: a.start (0pi-2pi) / a.end(0pi-2pi))
     * @param color (colore linea)
     * @param width (spessore linea)
     */
    var drawArc = function(ctx, c, r, a, color, width) {
      color = color ? color : 'white';
      width = width ? width : 1;

      ctx.beginPath();
      ctx.arc(c.x, c.y, r, a.start, a.end);
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
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
      colors: colors,
      getMonth: getMonth,
      getDaysInMonth: getDaysInMonth,
      drawLine: drawLine,
      drawRect: drawRect,
      drawLineRect:drawLineRect,
      drawText: drawText,
      fillRect: fillRect,
      drawCircle:drawCircle,
      drawArc:drawArc
    }
  }]);
