/**
 * Created by Leo on 03/02/2015.
 */
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var TaskSchema = new Schema({
  owner:String,
  start:Number,
  end:Number,
  work:String,
  notes:String,
  target:String
});

var ParamSchema = new Schema({
  name: String,
  value: String
});

var AmonalieSchema = new Schema({
  code:String,
  app:String,
  obj:String,
  desc:String,
  state:String,
  note:String,
  tasks: [TaskSchema],
  params: [ParamSchema]
});

/**
 * Genera l'anomalia
 * @param params
 * @param columns
 * @returns {AmonalieSchema}
 */
AmonalieSchema.statics.generate = function generate(params, columns) {
  var amonalia = {
    code:'',
    app:'',
    obj:'',
    desc:'',
    state:undefined,
    tasks: [],
    params: []
  };
  for(var pn in columns) {
    if (columns[pn]=='Codice') amonalia.code=params[pn];
    if (columns[pn]=='Funzione') amonalia.app=params[pn];
    if (columns[pn]=='Oggetto') amonalia.obj=params[pn];
    if (columns[pn]=='Descrizione') amonalia.desc=params[pn];
    amonalia.params.push({name:columns[pn], value:params[pn]})
  }
  return amonalia;
};


module.exports = mongoose.model('Amonalie', AmonalieSchema);
