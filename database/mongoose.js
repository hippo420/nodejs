const express= require('express');
const http= require('http');
const path= require('path');
const bodyParser = require('body-parser');
const static = require('serve-static');
const errorHandler = require('errorhandler');
const expressErrorHandler = require('express-error-handler');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const mongoose = require('mongoose');

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

        UserSchema = mongoose.Schema({
            id : String,
            name : String,
            password : String
        });

        UserModel = mongoose.Model("users", UserSchema);

        database.on('disconnected',function(){
                console.log('DB연결이 중단.....5초후 재연결');
                setInterval(connectDB,5000);
        });
    });
}

var authUser = function(database, id,password,callback){
    console.log('몽구스...authUser');
    UserModel.find({"id":id, "password": password},function (err,results){
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

router.route('/action/adduser').post(function(req,res){
    console.log('adduser....');

    var pId = req.body.id || req.query.id;
    var pPassword = req.body.password || req.query.password;
    var pName = req.body.name || req.query.name;

    if(database){
        addUser(database,pId,pPassword,pName,function(err,result){
            console.log(pId+'====> 사용자추가');
            if(err) throw err;
            console.log('err:'+ err);
            if(result && result.insertedCount>0){
                console.dir(result);

                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1> 사용자 추가 성공!!!! </h1>');
                res.write('<div><p>사용자 추가 성공했습니다. </p></div>');
                res.write("<div><p><a href = '/public/login.html'>로그인 하기</a></p></div>");
                res.end();
            }else{
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1> 사용자 추가 실패!!!! </h1>');
                res.write('<div><p>사용자 추가 실패했습니다. </p></div>');
                res.end();
            }
        });
    }else{
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h1> DB연결 실패!!!! </h1>');
        res.write('<div><p>DB에 연결하지 못했습니다.</p></div>');
        res.end();
    }
});

router.route('/action/login').post(function(req,res){
    console.log('login....');

    var pId = req.body.id || req.query.id;
    var pPassword = req.body.password || req.query.password;

    //로그인구현
    if(database){
        authUser(database,pId,pPassword,function(err,docs){

            console.log(pId+'----로그인 성공!!!');
            if(err) throw err;
            console.log(pId+'----err--- !!!'+err);
            if(docs){
                console.dir(docs);
                let username = docs[0].name;
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1> 로그인 성공!!!! </h1>');
                res.write('<div><p>id :'+pId+'</p></div>');
                res.write('<div><p>password :'+pPassword+'</p></div>');
                res.write("<div><p><a href = '/action/adduser'>사용자추가 하기</a></p></div>");
                res.write("<br><br><a href='/action/mypage'>마이페이지로 이동</a>");
                res.end();
            }else{
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1> 로그인 실패!!!! </h1>');
                res.write('<div><p>로그인에 실패했습니다. </p></div>');
                res.write("<br><br><a href='login.html'>다시 로그인 하기 </a>");
                res.end();
            }
        });
    }else{
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h1> DB연결 실패!!!! </h1>');
        res.write('<div><p>DB에 연결하지 못했습니다.</p></div>');
        res.end();
    }

    if(req.session.user){
        console.log('이미 로그인되어있습니다.');
        res.redirect('/mypage.html');
    }else{
        //세션저장
        req.session.user={
            id: pId,
            name : '개밥자',
            authorized: true
        };

    }
});

router.route('/action/logout').get(function(req,res){
    console.log('logout....');

    if(req.session.user){
        console.log('로그아웃....');
        req.session.destroy(function(err){
            if(err) throw err;

            console.log('세션제거....');
            res.redirect('login2.html');
        });
    }else{
        console.log('로그인 필요!!');
        res.redirect('/login2.html');
    }
});

//register Router
router.route('/action/showCookie').get(function(req,res){
    console.log('showCookie......');
    console.log(req.cookies);
    res.send(req.cookies);
});

router.route('/action/setUserCookie').get(function(req,res){
    console.log('setUserCookie......');
    res.cookie('user',{
            id:'gaebabaja',
            name: '개밥자',
            job : 'developer',
            authorized: true
        });

    res.redirect('/action/showCookie');
});

router.route('/action/mypage').get(function(req,res){
    console.log('mypage.....');

    
    if(req.session.user){
        res.redirect('/mypage.html');
    }else{
        res.redirect('/login2.html');
    }
});

app.use('/',router);

http.createServer(app).listen(app.get('port'),function(){
    console.log('express 서버 실행중.............',app.get('port'));
    connectDB();
});
//인덱스
// UserSchema = mongoose.Schema({
//     id : {type: String, required :true, unique : true},
//     name : {type: String, index : 'hashed'},
//     password : {type: String, unique : true}
// });

//method 
//static(name, fn) => 모델 객체에서 사용할 수 있는 함수를 등록, 함수의 이름과 함수 객체를 파라미터로 
//method(name, fn) => 모델 인스턴스 객체에서 사용할 수 있는 함수를 등록, 함수의 이름과 함수 객체를 파라미터로
// console.log('UserSchema static정의함.');
// UserSchema.static('findById', function(id, callback){
//     return this.find({id:id},callback);
// });

// UserSchema.static('findAll',function(callback){
//     return this.find({},callback);
// });

// console.log('UserModel 정의함.');
// UserModel = mongoose.model("users2",UserSchema);




