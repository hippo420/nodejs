const express = require('express');
const http = require('http');

let app = express();

app.set('port', process.env.PORT||3000);

http.createServer(app).listen(app.get('port'),function(){
    console.log('express 서버 실행중.............',app.get('port'));
});

