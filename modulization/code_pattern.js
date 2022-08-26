//#module.exports에 인스턴스객체 할당

// function Product(id,name){
//     this.id = id;
//     this.name = name;
// }

// Product.prototype.getProduct= function(){
//     return{ id:this.id, name:this.name};
// }

// Product.prototype.group = {id:'smartPhone', name :'스마트폰'};

// Product.prototype.printProduct = function(){
//     console.log('상품명: %s, [상품그룹:%s]',this.name, this.group.name);
// }

// module.exports = new Product('GalaxyS22','갤럭시S22');

//#Function CodePattern
// exports.printFunctionPattern = function(){
//     console.log('함수를 할당하는 코드패턴');
// };