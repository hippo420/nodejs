//npm install express-session --save
const express= require('express');
const http= require('http');
const path= require('path');
const bodyParser = require('body-parser');
const static = require('serve-static');
const rrorHandler = require('errorhandler');
const expressErrorHandler = require('express-error-handler');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

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

var MongoClient = require('mongodb').MongoClient;

var database;

function connectDB(){
    //연결Url : mongodb:[IP]:[port]/[db명] 
    var databaseUrl ='mongodb://localhost:27017/local';

    MongoClient.connect(databaseUrl,function(err,db){
        if(err) throw err;
        console.log('DB연결 완료....');
        database=db.db('local');
    });
}


//login process
var authUser = function(database, id, password,callback){
    console.log('id,password 검증중...');
    let users  = database.collection('users');
    
    users.find({"id":id,"password":password}).toArray(function(err,docs){
        if(err){
            callback(err,null);
            return;
        }
        if(docs.length>0){
            console.log('아이디 [%s] 일치 정보 찾음!!!',id);
            callback(err,docs);
        }else{
            console.log('아이디 일치 정보 업음');
            callback(err,null);
        }
    });
};


var addUser = function(database,id,password,name,callback){
    console.log('addUser ====> id: %s, password : %s, name: %s',id,password,name);

    let users = database.collection('users');
    var checkUser="false";

    users.insertMany([{"id":id, "name": name, "password":password}],function(err,result){
        if(err){
            callback(err,null);
            return;
        }

        if(result.insertedCount >0 ){
            console.dir(result);
            console.log('[%s]사용자 추가됨.',id);
        }else{
            console.log('사용자 추가 안됨.');
        }
        callback(err,result);
    }); 

}
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