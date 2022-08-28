//npm install express-session --save
const express= require('express');
const http= require('http');
const path= require('path');
const bodyParser = require('body-parser');
const static = require('serve-static');
const expressErrorHandler = require('express-error-handler');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

var app1 = express();
var router = express.Router();


app1.set('port',process.env.PORT || 3000);
app1.use(static(path.join(__dirname,'public')));


app1.use(bodyParser.urlencoded({extended: true}));
app1.use(bodyParser.json());
app1.use(cookieParser());
app1.use(expressSession({
    secret :'key',
    resave : true,
    saveUninitialized: true
}));

router.route('/action/login').post(function(req,res){
    console.log('login....');

    var pId = req.body.id || req.query.id;
    var pPassword = req.body.password || req.query.password;

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

        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>Express 서버기동중......Router-response.....</h1>');
        res.write('<div><p>id :'+pId+'</p></div>');
        res.write('<div><p>password :'+pPassword+'</p></div>');
        res.write("<br><br><a href='/action/mypage'>마이페이지로 이동</a>");
        res.end();
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

app1.use('/',router);

http.createServer(app1).listen(app1.get('port'),function(){
    console.log('express 서버 실행중.............',app1.get('port'));
});