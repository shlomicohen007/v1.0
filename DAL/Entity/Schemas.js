var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schemas = [];

schemas['Oparator'] = new Schema({
  name: { type:'String',form:{displayName:'Name',input:'text'}},
  password: { type:'String',form:{displayName:'Password',input:'password'}},
  email:   { type:'String',form:{displayName:'Email',input:'text'}}
});


module.exports.Schemas = schemas;


