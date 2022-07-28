const fs = require('fs');
const PATH =".\\resource\\FileTest.txt";
const writePath = "resource";

// let data =fs.readFileSync(PATH,'utf8');
// let data1 = fs.readFile(PATH,'utf8',function(err,data){
//     console.log('비동기[CallBack]=>'+data)
// });

// console.log('비동기=>'+data1);
// console.log('동기=>'+data);

// fs.writeFile(writePath+'writeASync.txt','ASync Hello Node!',function(err){
//     if(err){
//         console.log('Error: '+err);
//     }
//     console.log('[비동기]파일 쓰기 완료');
// });

// fs.writeFileSync(writePath+'writeExamSync.txt','Sync Hello Node!');
//     console.log('[동기]파일 쓰기 완료');


// fs.open(PATH,'w',function(err,fd){
//     if(err){
//         console.log('Error : '+err);
//     }

//     let filebuff = new Buffer('새로 작성된 내용');
//     fs.write(fd,filebuff,0,filebuff.length,null,function(err,written, buffer){
//         if(err){
//             console.log(err,written,buffer);
//         }

//         fs.close(fd,function(){
//             console.log('파일 쓰기 완료!!!')
//         });
//     });
// });

//buffer
let str ="버퍼로 쓴 파일";
//버퍼 사이즈
let bytesize = Buffer.byteLength(str);
let buffer = new Buffer(bytesize);
let len = buffer.write(str,'utf8');
console.log("buffer: %s",buffer.toString());

//타입
console.log('buffer Type? =>'+Buffer.isBuffer(buffer));

//버퍼복사
let buffer2 = new Buffer(bytesize);
buffer.copy(buffer2);
console.log('버터 복사 => buffer: '+buffer.toString()+', buffer2[copy]: '+buffer2.toString());

//Stream FIle
let inname = '.\\resource\\output1.txt'
let outname = '.\\resource\\output2.txt'
fs.exists(outname,function(exists){
    if(exists){
        fs.unlink(outname,function(err){
            if(err) throw err;
            console.log('기존파일 삭제함!!');

        });
    }
    let infile = fs.createReadStream(inname,{flag: 'r'});
    let outfile = fs.createWriteStream(outname,{flag: 'w'});

    infile.pipe(outfile);
    console.log('파일 복사 => ['+inname+'] -> ['+outname+']');
});