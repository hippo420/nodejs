const product = require('./product');

function showProductInfo(){
    return product.getProduct().name+' : '+product.group.name;
}

console.log('=========객체저장=========');
function showProductInfo1(){
    return product().id+' : '+product().price;
}
console.log('상품 정보: %s', showProductInfo1());