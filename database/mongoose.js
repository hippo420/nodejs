const mongoose = require('mongoose');

var database;

var userSchema;
var userModel;



function connectDB(){
    //연결Url : mongodb:[IP]:[port]/[db명] 
    var databaseUrl ='mongodb://localhost:27017/local';

    console.log('DB연결 시작....');

    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);

    database = mongoose.connection;
    database.on('error',function(){
        console.error.bind(console,'mongoose connection error');
    });
    database.on('open', function(){
        console.log('DB연결 연결 ==> '+databaseUrl);

        userSchema = mongoose.Schema({
            id : String,
            name : String,
            password : String
        });

        userModel = mongoose.Model("users", userSchema);

        database.on('disconnected',function(){
                console.log('DB연결이 중단.....5초후 재연결');
                setInterval(connectDB,5000);
        });
    });
}