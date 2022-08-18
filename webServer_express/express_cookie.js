//npm install cookie-parser --save
const express= require('express');
const http= require('http');
const path= require('path');
const bodyParser = require('body-parser');
const static = require('serve-static');
const expressErrorHandler = require('express-error-handler');
const cookieParser = require('cookie-parser');

var app1 = express();
var router = express.Router();


app1.set('port',process.env.PORT || 3000);
app1.use(static(path.join(__dirname,'public')));


app1.use(bodyParser.urlencoded({extended: true}));
app1.use(bodyParser.json());
app1.use(cookieParser());

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


app1.use('/',router);

http.createServer(app1).listen(app1.get('port'),function(){
    console.log('express 서버 실행중.............',app1.get('port'));
});