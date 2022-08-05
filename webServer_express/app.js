const express = require('express');
const http = require('http');
const { userInfo } = require('os');

let app = express();

app.set('port', process.env.PORT||3000);

http.createServer(app).listen(app.get('port'),function(){
    console.log('express 서버 실행중.............',app.get('port'));
});

//미들웨어 사용하기
// app.use(function(req,res,next){
//     console.log("첫 번째 미들웨어!!!!");
//     res.writeHead(200,{'Content-Type':'text/html;charset=utf8'});
//     res.end('<h1>Express 서버에서 응답한 결과......</h1>');
// });

//다수의 미들웨어 사용하기
// app.use(function(req,res,next){
//     console.log("첫 번째 미들웨어!!!!");
//     req.msg='첫 번째 미들웨어!!!!';
//     res.send({name :'우우우우',address:'집집집'});
//     next();
// });

// app.use('/',function(req,res,next){
//     console.log('두 번째 미들웨어!!!!');
//     res.writeHead(200,{'Content-Type':'text/html;charset=utf8'});
//     res.end('<h1>Express 서버에서 응답한 결과...... '+req.msg+'</h1>');
// });

//요청,응답메소드
// app.use(function(req,res,next){ 
//     res.send({name :'우우우우',address:'집집집'});
// });

// app.use(function(req,res,next){ 
//     res.redirect('http://www.naver.com');
// });


app.use(function(req,res,next){
    console.log('첫번째 미들웨어');

    let userAgent = req.header('User-Agent');
    let paramName = req.query.name;

    res.writeHead(200,{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Epress서버 응답 결과......</h1>');
    res.write('<div><p></div>User-Agent: '+userAgent+'<p></div>');
    res.write('<div><p></div>Param name: '+paramName+'<p></div>');
    res.end();
});