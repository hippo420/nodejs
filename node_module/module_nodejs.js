var calc={};

calc.add = function(a,b){
    return a+b;
};

console.log('모듈로 분리하기전 calc.add: %d',calc.add(1,2));

calc.multiply = function(a,b){
    return a*b;
};

module.exports = calc;
//exports vs module.exports