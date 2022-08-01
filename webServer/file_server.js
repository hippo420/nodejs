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