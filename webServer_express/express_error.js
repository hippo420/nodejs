//npm install express-error-handler --save
const express= require('express');
const http= require('http');
const path= require('path');
const bodyParser = require('body-parser');
const static = require('serve-static');
const expressErrorHandler = require('express-error-handler');

var app1 = express();
var router = express.Router();
var errorHandler = expressErrorHandler({
    static: {
        '404' : './webServer_express/public/errorpage.html'
    }
});

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



app1.use(expressErrorHandler.httpError(404));
app1.use(errorHandler);

http.createServer(app1).listen(app1.get('port'),function(){
    console.log('express 서버 실행중.............',app1.get('port'));
});