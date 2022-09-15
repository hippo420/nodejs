

var login = function(req,res){
    console.log('users.js ====> login 호출');

    var pId = req.body.id || req.query.id;
    var pPassword = req.body.password || req.query.password;
    var database = req.app.get('database');
    //로그인구현
    if(database){
        authUser(database,pId,pPassword,function(err,docs){

            if(err) throw err;
            
            if(docs){
                
                let username = docs[0].name;
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1> 로그인 성공!!!! </h1>');
                res.write('<div><p>id :'+pId+'</p></div>');
                res.write('<div><p>password :'+pPassword+'</p></div>');
                res.write("<div><p><a href = '/action/adduser'>사용자추가 하기</a></p></div>");
                res.write("<div><p><a href = '/action/update'>수정하기</a></p></div>");
                res.write("<div><p><a href = '/action/listuser''>사용자리스트</a></p></div>");
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
    
}

var adduser = function(req,res){
    console.log('users.js ====> adduser 호출');
    
    var paramId = req.param('id');
    var paramPassword = req.param('password');
    var paramName = req.param('name');
    var database = req.app.get('database');
    if(database){
        createUser(database,paramId,paramPassword,paramName,req,function(err,result){

           
            if(err) throw err;

            if(result){
                console.dir(result);

                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1> 사용자 수정 성공!!!! </h1>');
                res.write('<div><p>사용자 추가 성공했습니다. </p></div>');
                res.end();
            }else{
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1> 사용자 추가 실패!!!! </h1>');
                res.write('<div><p>사용자 추가 실패했습니다. </p></div>');
                res.end();
            }
        });
    }else{
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h1> DB연결 실패!!!! </h1>');
        res.write('<div><p>DB에 연결하지 못했습니다.</p></div>');
        res.end();
    }
}

var listuser = function(req,res){
    console.log('users.js ====> listuser 호출');
    var database = req.app.get('database');
    var UserModel = database.UserModel;
    if(database){
        UserModel.findAll(function(err,results){
            if(err){
                console.log('조회중 오류발생..');

                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용지 리스트 조회중 오류발생.....</h2>');
                res.write('<p>'+err.stack+'</p>');
                res.end();
                return;
            }
            if(results){
                console.dir(results);
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용지 리스트</h2>');
                res.write('<div><ul>');

                for(let i=0;i<results.length;i++){
                    let curId = results[i]._doc.id;
                    let curName = results[i]._doc.name;
                    console.log('id : '+curId);
                    console.log('name : '+curName);
                    res.write('    <li>#'+i+' : '+ curId+', '+curName+'</li>');
                }
                res.write('</ul></div>');
                res.end();

            }else{
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>데이터베이스 연결 실패</h2>');
                res.end();
            }
        });
    }
}

var authUser = function(database, id, password, callback) {
    console.log('authUser 호출');
    var UserModel = database.UserModel;
  
    UserModel.findById(id, function(err, results) {
      if (err) {
        callback(err, null);
        return;
      }
      console.log('아이디[%s]로 사용자 검색 결과 ', id);
      console.dir(results);
  
      if (results.length > 0) {
        console.log('아이디  일치하는 사용자 찾음.');
        var user = new UserModel({
          id: id
        });
        var authenticated = user.authenticate(password, results[0]._doc.salt,
          results[0]._doc.hashed_password);
  
        if (authenticated) {
          console.log('비밀번호 일치함');
          callback(null, results);
        } else {
          console.log('비밀번호 일치하지 않음');
          callback(null, null);
        }
  
  
      } else {
        console.log('아이디와 일치하는 사용자를 찾지 못함');
        callback(null, null);
      }
  
    });
  };
  var createUser = function(database, id, password, name, req, cb) {
    console.log('addUser 호출');
    var UserModel = req.app.get('database').UserModel;
    console.dir(UserModel);
    // var user = new UserModel({
    var user = new UserModel({
      'id': id,
      'password': password,
      'name': name,
    });
    user.save(function(err) {
      if (err) {
        cb(err, null);
        return;
      }
  
      console.log('사용자 데이터 추가');
      cb(null, user);
    });
  };
module.exports.login = login;
module.exports.adduser = adduser;
module.exports.listuser = listuser;
