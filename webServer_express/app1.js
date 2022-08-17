//npm install body-parser --save
const express= require('express');
const http= require('http');
const path= require('path');
const bodyParser = require('body-parser');
const static = require('serve-static');

let app1 =express();
console.log('시작....');
app1.set('port',process.env.PORT || 3000);
app1.use(static(path.join(__dirname,'public')));

http.createServer(app1).listen(app1.get('port'),function(){
    console.log('express 서버 실행중.............',app1.get('port'));

    
});

app1.use(bodyParser.urlencoded({extended: false}));

app1.use(bodyParser.json());



app1.use(function(req,res,next){
    console.log('First MiddleWare.....');

    let pId = req.body.id;
    let PPassword = req.body.password;

    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버기동중......First MiddleWare-response.....</h1>');
    res.write('<div><p>id :'+pId+'</p></div>');
    res.write('<div><p>password :'+PPassword+'</p></div>');
    res.end();
});