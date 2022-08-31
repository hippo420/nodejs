const express= require('express');
const http= require('http');
const path= require('path');
const bodyParser = require('body-parser');
const static = require('serve-static');
const errorHandler = require('errorhandler');
const expressErrorHandler = require('express-error-handler');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const mysql = require('mysql');
const { parseArgs } = require('util');
const { consumers } = require('stream');
const { table } = require('console');

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

var pool =mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    port : '4406',
    user : 'root',
    password : '1234',
    database : 'mysql',
    debug : false
});


var authUser = function(id,password,callback){
    console.log('mysql...authUser');
   
    pool.getConnection(function(err,conn){
        if(err){
            if(conn){
                conn.release();
            }
            console.log('DB ERROR');
            callback(err,null);
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디: '+conn.threadId);

        let columns = ['id', 'name'];
        console.log(columns);
        let tablename = 'users';

        var exec = conn.query( "select ?? from ?? where id = ? and password = ? "
                             , [columns,tablename, id ,password]
                             , function(err,rows){
                                    conn.release();
                                    console.log('실행 SQL: '+exec.sql);

                                    console.dir(rows);
                                    if(rows.length>0){
                                        console.log('일치 아이디[%s] 찾음!!',id);
                                        callback(null,rows);
                                    }else{
                                        console.log('일치 아이디 없음');
                                        callback(null,null);
                                    }
                                });
        });
};


var addUser = function(id, password,name, callback){
    console.log('mysql...addUser');

    pool.getConnection(function(err,conn){
        if(err){
            if(conn){
                conn.release();
            }
            callback(err,null);
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디: '+conn.threadId);

        var data = {id:id,password:password, name:name};

        var exec = conn.query('insert into users set ?',data,function(err,results){
            conn.release();
            console.log('실행 SQL: '+exec.sql);
            if(err){
                console.log('SQL 오류 =====>');
                console.dir(err);
                callback(err,null);
                return;
            }
            callback(null,results);
        });
    });
};

var router = express.Router();

router.route('/action/adduser').post(function(req,res){
    console.log('adduser....');

    var pId = req.body.id || req.query.id;
    var pPassword = req.body.password || req.query.password;
    var pName = req.body.name || req.query.name;

    if(pool){
        addUser(pId,pPassword,pName,function(err,addedUser){

        
            if(err){
                console.error('사용자 추가 오류 ====>'+err.stack);
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1> 사용자 추가 실패!!!! </h1>');
                res.write('<div><p>'+err.stack+'</p></div>');
                res.end();

                return;
            }

            if(addedUser){
                console.dir(addedUser);
                console.log('inserted===>'+result.affectedRows+'rows');

                let insertId = result.insertId;
                console.log('레코드 추가 아이디 : '+insertId);

                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1> 사용자 추가 성공!!!! </h1>');
                res.end();
        
            }else{
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1> 사용자 추가 실패!!!! </h1>');
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
    if(pool){
        authUser(pId,pPassword,function(err,rows){

            console.log(pId+'----로그인 성공!!!');
            if(err) {
                console.log('ERROR ====> '+ err.stack);
            }

            if(rows){
                console.dir(rows);
                let username = rows[0].name;
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1> 로그인 성공!!!! </h1>');
                res.write('<div><p>id :'+pId+'</p></div>');
                res.write('<div><p>name :'+username+'</p></div>');
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
    
});
//인덱스
// UserSchema = mongoose.Schema({
//     id : {type: String, required :true, unique : true},
//     name : {type: String, index : 'hashed'},
//     password : {type: String, unique : true}
// });

//method 
//static(name, fn) => 모델 객체에서 사용할 수 있는 함수를 등록, 함수의 이름과 함수 객체를 파라미터로 
//method(name, fn) => 모델 인스턴스 객체에서 사용할 수 있는 함수를 등록, 함수의 이름과 함수 객체를 파라미터로
// console.log('UserSchema static정의함.');
// UserSchema.static('findById', function(id, callback){
//     return this.find({id:id},callback);
// });

// UserSchema.static('findAll',function(callback){
//     return this.find({},callback);
// });

// console.log('UserModel 정의함.');
// UserModel = mongoose.model("users2",UserSchema);




