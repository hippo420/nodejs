const crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose){

    let userSchema = mongoose.Schema({
        id : {type: String, required : true, unique : true, 'default' : ''},
        hashed_password : {type : String, required : true, 'default' : ''},
        salt : {type: String, required : true},
        name : {type : String, index : 'hashed', 'default' : ''},
        age : {type: Number, 'default' : -1},
        create_at : {type :Date, index: {unique : false}, 'default': Date.now},
        update_at : {type :Date, index: {unique : false}, 'default': Date.now}
    });

    console.log('userschema.js ====> UserSchema 정의');
    return userSchema;
};
    
module.exports = Schema;
