/*Router 활용하기
라우터객체 활용
const router = express.Router();

라우팅함수 등록

*router.route(요청패스).get(실행될 함수);

router.route('/access/login').get(()=>{

});
router.route('/access/login').post(()=>{
    
});

라우터를 app에 등록
app.use('/',router);
*/

//npm install body-parser --save
const express= require('express');
const http= require('http');
const path= require('path');
const bodyParser = require('body-parser');
const static = require('serve-static');

var app1 = express();
var router = express.Router();


app1.set('port',process.env.PORT || 3000);
app1.use(static(path.join(__dirname,'public')));


app1.use(bodyParser.urlencoded({extended: true}));
app1.use(bodyParser.json());

//register Router
router.route('/action/login').post(function(req,res){
    console.log('Router............process/login => login.html');

    let pId = req.body.id;
    let PPassword = req.body.password;

    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버기동중......Router-response.....</h1>');
    res.write('<div><p>id :'+pId+'</p></div>');
    res.write('<div><p>password :'+PPassword+'</p></div>');
    res.end();
});


app1.use('/',router);

http.createServer(app1).listen(app1.get('port'),function(){
    console.log('express 서버 실행중.............',app1.get('port'));
});