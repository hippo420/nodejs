/*Router 활용하기
*URL파라미터 활용하기
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
router.route('/action/login/:name').post(function(req,res){
    console.log('Router............process/login {URL Parameter: name}=> login.html');

    let pName = req.params.name;
    let pId = req.body.id;
    let PPassword = req.body.password;

    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버기동중......Router-response.....</h1>');
    res.write('<div><p>name :'+pName+'</p></div>');
    res.write('<div><p>id :'+pId+'</p></div>');
    res.write('<div><p>password :'+PPassword+'</p></div>');
    res.end();
});

app1.all('*',function(req,res){
    res.status(404).send('<h1>ERROR PAGE....잘못된 패스입니다.</h1>');
});

app1.use('/',router);

http.createServer(app1).listen(app1.get('port'),function(){
    console.log('express 서버 실행중.............',app1.get('port'));
});