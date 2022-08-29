var database;
var userSchema;
var userModel;

var init = function(db, schema, model){
    console.log('users.js ====> init 호출');

    database = db;
    userSchema = schema;
    userModel = model;
}

var login = function(req,res){
    console.log('users.js ====> login 호출');
}

var adduser = function(req,res){
    console.log('users.js ====> adduser 호출');
}

var listuser = function(req,res){
    console.log('users.js ====> listuser 호출');
}

module.exports.init = init;
module.exports.login = login;
module.exports.adduser = adduser;
module.exports.listuser = listuser;
