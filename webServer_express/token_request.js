//npm install express-error-handler --save
const express= require('express');
const http= require('http');
const path= require('path');
const static = require('serve-static');
const expressErrorHandler = require('express-error-handler');

var app1 = express();
var router = express.Router();

app1.set('port',process.env.PORT || 3000);
app1.use(static(path.join(__dirname,'public')));

//register Router
router.route('/action/users:id').get(function(req,res){
    console.log('Router[GET]............처리');

    let pId = req.params.id;

    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버기동중......Router-response.....</h1>');
    res.write('<div><p>id :'+pId+'</p></div>');
    res.end();
});


app1.use('/',router);

http.createServer(app1).listen(app1.get('port'),function(){
    console.log('express 서버 실행중.............',app1.get('port'));
});