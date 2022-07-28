const fs = require('fs');
const PATH ="resource\\FileTest.txt";
const writePath = "resource\\";

let data =fs.readFileSync(PATH,'utf8');
let data1 = fs.readFile(PATH,'utf8',function(err,data){
    console.log('비동기[CallBack]=>'+data)
});

console.log('비동기=>'+data1);
console.log('동기=>'+data);

fs.writeFile(writePath+'writeASync.txt','ASync Hello Node!',function(err){
    if(err){
        console.log('Error: '+err);
    }
    console.log('[비동기]파일 쓰기 완료');
});

fs.writeFileSync(writePath+'writeExamSync.txt','Sync Hello Node!');
    console.log('[동기]파일 쓰기 완료');


fs.open(PATH,'w',function(err,fd){
    if(err){
        console.log('Error : '+err);
    }

    let filebuff = new Buffer('새로 작성된 내용');
    fs.write(fd,filebuff,0,filebuff.length,null,function(err,written, buffer){
        if(err){
            console.log(err,written,buffer);
        }

        fs.close(fd,function(){
            console.log('파일 쓰기 완료!!!')
        });
    });
});