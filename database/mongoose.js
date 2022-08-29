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

var authUser = function(database, id,password,callback){
    console.log('몽구스...authUser');
    userModel.find({"id":id, "password": password},function (err,results){
        if(err){
            callback(err,null);
            return;
        }
        console.log('아이디[%s], 비밀번호[%s]로 검색한 결과가 존재',id,password);
        console.log(results);

        if(results.length>0){
            console.log('일치하는 사용자 찾음!');
            callback(err,results);
        }else{
            console.log('일치하는 사용자 없음');
            callback(err,null);
        }
    });
};


var addUser = function(database, id, password,name, callback){
    console.log('몽구스...addUser');
    let user = new userModel({"id":id,"password": password,"name": name});

    user.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
    console.log('사용자 추가완료');
    callback(err,user);
    });
};

//인덱스
// userSchema = mongoose.Schema({
//     id : {type: String, required :true, unique : true},
//     name : {type: String, index : 'hashed'},
//     password : {type: String, unique : true}
// });

//method 
//static(name, fn) => 모델 객체에서 사용할 수 있는 함수를 등록, 함수의 이름과 함수 객체를 파라미터로 
//method(name, fn) => 모델 인스턴스 객체에서 사용할 수 있는 함수를 등록, 함수의 이름과 함수 객체를 파라미터로
console.log('userSchema static정의함.');
userSchema.static('findById', function(id, callback){
    return this.find({id:id},callback);
});

userSchema.static('findAll',function(callback){
    return this.find({},callback);
});


console.log('userModel 정의함.');
userModel = mongoose.model("users2",userSchema);