const { trace } = require('console');
const fs = require('fs');
const http=require('http');

let server=http.createServer();
let port =3000;

server.listen(port,function(){
    console.log('port : %d  Server Running...',port);
});

server.on('request',function(req,res){
    console.log('Client Requst......');

    let path = '.\\resource\\f1.jpg';
    fs.readFile(path,function(err,data){
        if(err) throw err;
        res.writeHead(200,{"Content-Type":"image/png"});
        res.write(data);
        res.end();
    });
});

//파일 입력스트림
server.on('request',function(req,res){
    console.log('파일 스트림으로 읽어들이기');

    let filepath = '.\\resource\\f1.jpg';
    
    //입력 스트림으로 파일 읽음
    let infile = fs.createReadStream(filepath,{flags:'r'});

    //파이프로 연결해서 알아서 처리함.
    infile.pipe(res);
});

//버퍼에 담아 일부분만 읽기
server.on('request',function(req,res){
    console.log('Buffer에 담아 일부분만 읽기');

    let filepath = '.\\resource\\f1.jpg';
    let infile = fs.createReadStream(filepath,{flags:'r'});
    let filelength=0;
    let curlength=0;

    fs.stat(filepath,function(err,stats){
        filelength=stats.size;
    });

    res.writeHead(200,{"Content_Type":"image/jpg"});
    
    infile.on('readable',function(){
        let chunk;
        while(null!=(chunk=infile.read()))
        {
            console.log('읽은 파일크기 : %d Byte',chunk.length);
            curlength+=chunk.length;
            res.write(chunk,'utf8',function(err){
                console.log('부분파일쓰기완료 : %d, 파일크기: %d',curlength,filelength);
                if(curlength>=filelength){
                    res.end();
                }
            });
        }
    });
});


let options={
    host: 'www.naver.com',
    port: 80,
    path:'/'
};

//get()
let req = http.get(options,function(res){
    let resData="";
    res.on('data',function(chunk){
        resData+=chunk;
    });

    res.on('end', function(){
        console.log(resData);
    });
});

req.on('end',function(err){
    console.log("오류 메시지: ",err.message);
});

let options2={
    host: 'www.google.com',
    port: 80,
    method : 'POST',
    path:'/',
    headers:{}
};

//post
let req1 = http.request(options2,function(res){
    let resData="";
    res.on('data',function(chunk){
        resData += chunk;
    });

    res.on('end',function(){
        console.log(resData);
    });
});

options2.headers['Content-Type'] = 'application/x-www-form-urlencoded';
req1.data = "q=actor";
options2.headers['Content-Length'] = 'req1.data.length';

req1.on('error',function(err){
    console.log("오류 메시지: ",err.message);
});

req1.write(req1.data);
req1.end();