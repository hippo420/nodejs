//인덱스
// UserSchema = mongoose.Schema({
//     id : {type: String, required :true, unique : true},
//     name : {type: String, index : 'hashed'},
//     password : {type: String, unique : true}
// });



const express= require('express');
const http= require('http');
const path= require('path');
const bodyParser = require('body-parser');
const static = require('serve-static');
const errorHandler = require('errorhandler');
const expressErrorHandler = require('express-error-handler');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const crypto = require('crypto');

var app = express();
app.set('port',process.env.PORT || 3000);
app.use(static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
    secret :'key',
    resave : true,
    saveUninitialized: true
}));

var database;
var UserSchema;
var UserModel;



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

        createSchema();
        test();
        database.on('disconnected',function(){
                console.log('DB연결이 중단.....5초후 재연결');
                setInterval(connectDB,5000);
        });
    });
}

function test(){
    let user = new UserModel({'info': 'test01 개밥자'});

    user.save(function(err){
        if(err) {throw err;}
        console.log('사용자 데이터베이스 추가');

        findAll();
        console.log('info 속성에 값 할당');
        console.log('');
    })
}

function findAll(){
    UserModel.find({},function(err,results){
        if(err) {throw err;}
        
        if(results.length>0){
            for(i=0;i<results.length;i++)
                console.log('조회된 사용자 ====> # id: %s , name : %s',results[i]._doc.id,results[i]._doc.name);

        }else{
            console.log('조회된 사용자 없으뮤ㅠㅠㅠㅠㅠ');
            callback(null,null);
        }
    });
}

function createSchema(){
    UserSchema = mongoose.Schema({
        id : {type: String, required :true, unique : true},
        password : {type: String, unique : true},
        name : {type: String, index : 'hashed'},
        created_ymd : {type : Date, index :{unique:false}, 'default':Date.now},
        updated_ymd : {type : Date, index :{unique:false}, 'default':Date.now},
        
    });

     UserSchema
        .virtual('info')
        .set(function(info){
            let splitted = info.split(' ');
            this.id=splitted[0];
            this.name = splitted[1];
            console.log('virtual 속성 설정함=====>%s : %s',this.id, this.name);
        })
        .get(function(){
            return this.id+ ' '+ this.name;
        });

        console.log('스키마 정의함');
        UserModel = mongoose.model('users2',UserSchema);

}

let authUser = function(database, id,password,callback){
    console.log('몽구스...authUser');
    UserModel.findById(id,function (err,results){
        if(err){
            callback(err,null);
            return;
        }
        console.log('아이디[%s], 비밀번호[%s]로 검색한 결과가 존재',id,password);
        console.log(results);

        if(results.length>0){
            console.log('일치하는 사용자 찾음!');
            
            if(results[0]._doc.password === password){
                console.log('비밀번호 일치함');
                callback(null,results);
            }else{
                console.log('비밀번호 일치하지 않음!!');
                callback(null,null);
            }
        }else{
            console.log('일치하는 사용자 없음');
            callback(err,null);
        }
    });
};


let addUser = function(database, id, password,name, callback){
    console.log('몽구스...addUser');
    let user = new UserModel({"id":id,"password": password,"name": name});

    user.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
    console.log('사용자 추가완료');
    callback(err,user);
    });
};



var router = express.Router();

router.route('/action/listuser').post(function(req,res){
    console.log('listuser 호출');
    
    if(database){
        UserModel.findAll(function(err,results){
            if(err){
                console.log('조회중 오류발생..');

                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용지 리스트 조회중 오류발생.....</h2>');
                res.write('<p>'+err.stack+'</p>');
                res.end();
                return;
            }
            if(results){
                console.dir(results);
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용지 리스트</h2>');
                res.write('<div><ul>');

                for(let i=0;i<results.length;i++){
                    let curId = results[i]._doc.id;
                    let curName = results[i]._doc.name;
                    console.log('id : '+curId);
                    console.log('name : '+curName);
                    res.write('    <li>#'+i+' : '+ curId+', '+curName+'</li>');
                }
                res.write('</ul></div>');
                res.end();

            }else{
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>데이터베이스 연결 실패</h2>');
                res.end();
            }
        });
    }
});

app.use('/',router);

http.createServer(app).listen(app.get('port'),function(){
    console.log('express 서버 실행중.............',app.get('port'));
    connectDB();
});