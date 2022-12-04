// 返回范围随机数
export function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      break;
    default:
      return 0;
      break;
  }
}
// 数据脱敏
export function hideData(str,beginStr,endStr){
  var len = str.length;
  var leftStr = str.substring(0,beginStr);
  var rightStr = str.substring(endStr,len);
  var str = ''
  var i = 0;
  try {
      for (i = 0; i < endStr-beginStr;i++) {
          str = str + '*';
      }
  } catch (error) {
       
  }
  str = leftStr + str + rightStr;
  return str;
}
// 数字格式化，3位逗号
export function toThousands(num) {
  var num = (num || 0).toString(), result = '';
  while (num.length > 3) {
      result = ',' + num.slice(-3) + result;
      num = num.slice(0, num.length - 3);
  }
  if (num) { result = num + result; }
  return result;
}
