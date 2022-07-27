
process.on('evt1',function(){
    console.log('evt1 이벤트 발생함.');
});

setTimeout(evt1(),1000);

function evt1() {
    console.log('evt1 발생!!!!!');
    process.exit();
};

process.on('evt2', function(num){
    console.log('evt2: %d',num);

});

setTimeout(function(){
    console.log('evt2 발생');
    process.emit(evt2,2)
});


//계산기
const Calc = require('./calcEvt');

let calc = new Calc();
calc.emit('stop');

console.log(Calc.title+'에 이벤트 전달!!');