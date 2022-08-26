var require = function(path){
    let exports = {
        getProduct : function(){
            return{id:'iPhone13',name:'아이폰13'};
        },
        group : {id:'smartPhone',name:'스마트폰'}
    }
    return exports;
}

var user = require('...');
const product = require('./product');
function showProduct(){
    return product.getProduct.name+', '+product.group.name;
}
console.log('제품정보: %s',showProduct());