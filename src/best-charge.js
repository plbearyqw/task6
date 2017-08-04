const it = require('./items.js');
const pro = require('./promotions.js');
var loadAllItems = it;
var loadPromotions = pro;

function includes(collection, item){
          for(var each of collection){
                    if(each === item){
                              return true;
                    }
          }
          return false;
}

function getItemsAndCount(selectedItems){
          let itemsAndCount = [];
          for(var item of selectedItems){
                    let sResult = item.split('x');
                    let type = sResult[0].trim();
                    let countNum = parseInt(sResult[1].trim(), 10);
                    itemsAndCount.push({id:type, count:countNum});
          }    
          return itemsAndCount;
}

function getTotalOne(allItems, itemsAndCount){
          let desPriceOne = 0;
          let totalPrice = 0;
          for(var each of itemsAndCount){
                    let id = each.id;
                    let count = each.count;
                    totalPrice += allItems.find(arg => arg.id === id).price * count;
          }
          if(totalPrice >= 30){
                    desPriceOne = 6;
          }
          return desPriceOne;
}

function getTotalTwo(allItems, chargeItems, itemsAndCount){
          let desPriceTwo = 0;
          let totalPriceOrigin = 0;
          let totalPrice = 0;
          let priceType;
          for(var each of itemsAndCount){
                     let id = each.id;
                     let count = each.count;
                     totalPriceOrigin += allItems.find(arg => arg.id === each.id).price * count;
                     if(includes(chargeItems, id)){                               
                               totalPrice += allItems.find(arg => arg.id === each.id).price * 0.5 * count;
                     }else{
                               totalPrice += allItems.find(arg => arg.id === each.id).price * count;
                     }
          }
          desPriceTwo = totalPriceOrigin - totalPrice;
          
          return desPriceTwo;
}

function compareCharge(allItems, chargeItems, itemsAndCount){
          let desPriceOne = getTotalOne(allItems, itemsAndCount);
          let desPriceTwo = getTotalTwo(allItems, chargeItems, itemsAndCount);
          let priceType;
          if(desPriceOne < desPriceTwo){
                    priceType = {type:'指定菜品半价', desPrice:desPriceTwo};
          }else{
                    priceType = {type:'满30减6元', desPrice:desPriceOne};
          }
          return priceType;
}

function printInventory(allItems, chargeItems, itemsAndCount, priceType){
          let summary = 0;
          let result = '============= 订餐明细 =============\n';
          for(var each of itemsAndCount){
                    result += allItems.find(arg => arg.id === each.id).name 
                              + ' x ' + each.count + ' = ' 
                              + allItems.find(arg => arg.id === each.id).price * each.count + '元\n';
                    summary += allItems.find(arg => arg.id === each.id).price * each.count;
          }
          
          if(priceType.desPrice > 0){
                    result += '-----------------------------------\n'
                    + '使用优惠:\n';
                    if(priceType.type === '满30减6元'){
                              result += '满30减6元，省' + priceType.desPrice + '元\n';
                    }else{
                              result += '指定菜品半价(';
                              for(var each of itemsAndCount){
                                        if(includes(chargeItems, each.id)){
                                                  result += allItems.find(arg => arg.id === each.id).name + '，';
                                        }
                              }
                              result = result.substring(0, result.length-1);
                              result += ')，省' + priceType.desPrice + '元\n';
                    }
                    summary -= priceType.desPrice;
          }
          
          result += '-----------------------------------\n' 
                    + '总计：' + summary + '元\n' 
                    + '===================================\n';
          return result;
}

module.exports = function bestCharge(selectedItems) {
          let allItems = loadAllItems();
          let chargeItems = loadPromotions().find(arg => arg.type === '指定菜品半价').items;
          let itemsAndCount = getItemsAndCount(selectedItems);
          let priceType = compareCharge(allItems, chargeItems, itemsAndCount);
          let result = printInventory(allItems, chargeItems, itemsAndCount, priceType);
          
          return result;
}
