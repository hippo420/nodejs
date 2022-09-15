const express= require('express');
const http= require('http');
const path= require('path');
const bodyParser = require('body-parser');
const static = require('serve-static');
const errorHandler = require('errorhandler');
const expressErrorHandler = require('express-error-handler');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
//모듈 로드

const config = require('./config');
const database_loader = require('./database/database_loader');
const route_loader = require('./routes/route_loader');
var app = express();

console.log('config.js [server_port] ====>[%d]',config.server_port);
app.set('port',config.server_port || 3000);
app.use(static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
    secret :'key',
    resave : true,
    saveUninitialized: true
}));

//passport 사용 설정
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

route_loader.init(app,express.Router());

app.get('/', function(req, res) {
	console.log('/ 패스 요청됨.');
	res.render('index.ejs');
});

// login form
app.get('/login', function(req, res) {
  console.log('/login 패스 요청됨');
  res.render('login.ejs', {
    message: req.flash('loginMessage'),
  });
});

// login form
app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

// 회원가임 폼
app.get('/signup', function(req, res) {
  console.log('/signup 패스 요청됨');
  res.render('signup.ejs', {
    message: req.flash('signupMessage'),
  });
});

// 회원가임 proc
app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash: true
}));


// 프로필 링크 - 먼저 로그인 여부를 확인할 수 있도록 isLoggedIn 미들웨어 실행
app.get('/profile', isLoggedIn, function(req, res) {
	console.log('/profile 패스 요청됨.');
	console.dir(req.user);

	if (Array.isArray(req.user)) {
		res.render('profile.ejs', {user: req.user[0]._doc});
	} else {
		res.render('profile.ejs', {user: req.user});
	}
});

// 로그아웃
app.get('/logout', function(req, res) {
	console.log('/logout 패스 요청됨.');
	req.logout();
	res.redirect('/');
});

// 로그인 여부를 알 수 있도록 하는 미들웨어
function isLoggedIn(req, res, next) {
	console.log('isLoggedIn 미들웨어 호출됨.');

	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/');
}



// 사용자 인증 성공 시 호출
passport.serializeUser(function(user, done) {
	console.log('serializeUser() 호출됨.');
	console.dir(user);

    done(null, user);
});

// 사용자 인증 이후 사용자 요청 시마다 호출
passport.deserializeUser(function(user, done) {
	console.log('deserializeUser() 호출됨.');
	console.dir(user);

	// 사용자 정보 중 id나 email만 있는 경우 사용자 정보 조회 필요 - 여기에서는 user 객체 전체를 패스포트에서 관리
	done(null, user);
});

//passport login 사용하기
var LocalStrategy = require('passport-local').Strategy;

passport.use('local-login', new LocalStrategy({
    usernameField : 'email'
    , passwordField : 'password'
    , passReqToCallback : true
}, function(req,email,password,done){
    console.log('passport-loacl 호출 ===========> email: %s, password : %s',email,password);

    let database = app.get('database');
    database.UserModel.findOne({'email':email},function(err,user){
        if(err) throw err;

        if(!user){
            console.log('등록된  계정없음!!');
            return done(null,false,req.flash('loginMessage','등록된 계정이 없습니다.'));
        }

        if(!authenticated){
            console.log('비밀번호가 일치하지 않음!!');
            return done(null,false,req.flash('loginMessage','비밀번호가 일치하지 않습니다.'));
        }

        console.log('계정 찾음!!');
        return done(null,user);
    });
}));

//passport authuser 사용하기
// passport 회원 가입 설정
passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  }, function(req, email, password, done) {
    var paramName = req.body.name;
    console.log('passport의 local-signup signup 호출됨:' + email + ', ' + password +
      ', ' + paramName);
  
    // User.fineOne이 blocking되므로  async 방식으로 변경할 수도 있음
    process.nextTick(function() {
      var database = app.get('database');
      database.UserModel.findOne({
        'email': email
      }, function(err, user) {
        if (err) {
          return done(err);
        }
  
        //기존 메일이 있다면
        if (user) {
          console.log('기존에 계정이 있음');
          return done(null, false, req.flash('signupMessage',
            '계정이 이미 있음'));
        } else {
          // 모델 인스턴스 객체 만들어 저장
           user = new database.UserModel({
            'email': email,
            'password': password,
            'name': paramName,
          });
          user.save(function(err) {
            if (err) {
              throw err;
            }
            console.log('사용자 데이터 추가함');
            return done(null, user);
          });
        }
  
      });
    });
  
  }));
http.createServer(app).listen(app.get('port'),function(){
    console.log('express 서버 실행중.............',app.get('port'));
});