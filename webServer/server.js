const http=require('http');

let server=http.createServer(function(req,res){
    res.writeHead(200,{"Content-Type": "text/html; charset=utf-8"});
    res.write("<!DOCTYPE html>");
    res.write("<html>\n<head>\n<title>노드제이에스서버</title>");
    res.write("<body>\n<h1>응답페이지</h1>\n</body>");
    res.write("</html>");
    res.end();
});

let param = [
    hostname = 'GAEBABJA',
    port = 3000,
    backlog ='5000'
];

server.listen(3000,function(){
    console.log('port : %d  Server Running...',port);
});


// server.listen(param.port, param.hostname, param.backlog,function(){
//     console.log('HOST: %s, PORT : %d  Server Running...',hostname,port);
// });

server.on('connection',function(socket){
    let addr = socket.address();
    console.log('Client 접속.......%s, %d',addr.address,addr.port);
});

// server.on('request',function(req, res){
//     console.log('클라이언트 요청발생!!!');

//     res.writeHead(200,{"Content-Type": "text/html; charset=utf-8"});
//     res.write("<!DOCTYPE html>");
//     res.write("<html>\n<head>\n<title>노드제이에스서버</title>");
//     res.write("<body>\n<h1>응답페이지</h1>\n</body>");
//     res.write("</html>");
//     res.end();
//     console.dir(req);
// });

server.on('close',function(){
    console.log('서버종료.......');
});

