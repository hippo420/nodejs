const util = require('util');
const EventEmitter = require('events').EventEmitter;

let Calc = function(){
    let self =this;
    this.on('stop',function(){
        console.log('계산기 이벤트!!');
    });
};

util.inherits(Calc,EventEmitter);

Calc.prototype.add = function(a,b){
    return a+b;
};

module.exports=Calc;
module.exports.title = 'calculator';