import { message } from 'antd'
import axios from 'axios'
const times = {
  
}

//keys 转 key\value json数组
export const GetConfigKeyArr = (keys:Object) => {
  let arr = []
  for (let key in keys) {
    arr.push({
      name: key,
      value: keys[key],
    })
  }
  return arr
}

//防抖
export const GetListTiming = (key, back = () => {}) => {
  if (times[key]) {
    clearTimeout(times[key])
    times[key] = null
  }
  times[key] = setTimeout(() => {
    back()
  }, 500)
}

//需要提示的api发送
export const APISend = async ({
  loadText,
  successText,
  apiFunc = async () => {},
  back = () => {},
}) => {
  message.destroy()
  if (loadText) {
    message.loading(`${loadText}...`, 0)
  }
  try {
    let res = await apiFunc()
    message.destroy()
    if (successText) {
      message.success(`${successText}！`)
    }
    back()
    return res
  } catch (e) {
    message.destroy()
    message.error(`接口异常！`)
    back()
  }
}

export const getBase64 = (file:File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export const request = (url, options, ContentType = null) => {
  return new Promise((resolve, reject) => {
    let { method, body, back } = options
    let option = {
      method,
      url,
      params:{},
      data:{},
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': `${ContentType}`,
        'Authorization':''
      },
    }
    option.headers.Authorization = `Bearer ${window.localStorage.getItem('token')}`
    // 参数赋值
    switch (method) {
      case 'GET':
      case 'DELETE':
        option.params = body || {}
        break
      case 'POST':
        option.data = body || {}
      case 'PATCH':
      case 'PUT':
        option.data = body || {}
        break
    }
    axios(option)
      .then(({ data }) => {
        back && back(data)
      })
      .catch((e) => {})
  })
}
//下载二进制流图片
export const DownBlobQrcode = (data, name, back = () => {}, dWidth, dHeight) => {
  const canvas = document.createElement('canvas')
  const img = new Image()
  const width = 256
  img.src = data
  img.width = dWidth ? dWidth : width
  img.height = dHeight ? dHeight : width
  canvas.width = img.width
  canvas.height = img.height
  var content = canvas.getContext('2d')
  document.body.append(img)
  img.onload = () => {
    content.drawImage(img, 0, 0, img.width, img.height)
    canvas.style.display = 'none'
    document.body.append(canvas)
    const url = canvas.toDataURL('image/png')
    const elink = document.createElement('a')
    elink.download = name
    elink.style.display = 'none'
    elink.href = url
    document.body.appendChild(elink)
    elink.click()
    document.body.removeChild(elink)
    document.body.removeChild(canvas)
    back()
    img.parentNode.removeChild(img)
  }
}
//保存文件
export const saveFile = (data, fileName) => {
  if ('download' in document.createElement('a')) {
    const elink = document.createElement('a')
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(data)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
  }
}
// 下载文件，buffer二进制流
export const downFile = (buffer, fienName = 'fienName.xlsx') => {
  const blob = new Blob([buffer], {
    type: 'application/application/octet-stream',
  })
  const fileName = fienName
  if ('download' in document.createElement('a')) {
    // 非IE下载
    const elink = document.createElement('a')
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
  }
}

// 检查数组是否有重复
export const hasDuplicates = (array) => {
  var valuesSoFar = Object.create(null)
  for (var i = 0; i < array.length; ++i) {
    var value = array[i]
    if (value in valuesSoFar) {
      return true
    }
    valuesSoFar[value] = true
  }
  return false
}

export const clearUserCookieAll = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  localStorage.removeItem('validPwd')
  localStorage.removeItem('token')
  localStorage.removeItem('currentPositionId')
  localStorage.removeItem('currentPositionDetail')
  localStorage.removeItem('isRemVillage')
  sessionStorage.removeItem('pathname')
}
export const checkCid = (card) => {
  var vcity = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外',
  }

  const checkCard = function (card) {
    //是否为空
    if (card === '') {
      message.error('证件号码不能为空!')
      return false
    }
    //校验长度，类型
    if (isCardNo(card) === false) {
      message.error('您输入的证件号码不正确，请重新输入!')
      return false
    }
    //检查省份
    if (checkProvince(card) === false) {
      message.error('您输入的证件号码不正确,请重新输入!')
      return false
    }
    //校验生日
    if (checkBirthday(card) === false) {
      message.error('您输入的证件号码生日不正确,请重新输入!')
      return false
    }
    // //检验位的检测
    // if (checkParity(card) === false) {
    //     message.error('您的证件号码校验位不正确,请重新输入');
    //     return false;
    // }

    return true
  }

  //检查号码是否符合规范，包括长度，类型
  var isCardNo = function (card) {
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/
    if (reg.test(card) === false) {
      return false
    }

    return true
  }

  //取身份证前两位,校验省份
  var checkProvince = function (card) {
    var province = card.substr(0, 2)
    if (vcity[province] == undefined) {
      return false
    }
    return true
  }

  //检查生日是否正确
  var checkBirthday = function (card) {
    var len = card.length
    //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
    if (len == '15') {
      var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/
      var arr_data = card.match(re_fifteen)
      var year = arr_data[2]
      var month = arr_data[3]
      var day = arr_data[4]
      var birthday = new Date('19' + year + '/' + month + '/' + day)
      return verifyBirthday('19' + year, month, day, birthday)
    }
    //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
    if (len == '18') {
      var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/
      var arr_data = card.match(re_eighteen)
      var year = arr_data[2]
      var month = arr_data[3]
      var day = arr_data[4]
      var birthday = new Date(year + '/' + month + '/' + day)
      return verifyBirthday(year, month, day, birthday)
    }
    return false
  }

  //校验日期
  var verifyBirthday = function (year, month, day, birthday) {
    var now = new Date()
    var now_year = now.getFullYear()
    //年月日是否合理
    if (
      birthday.getFullYear() == year &&
      birthday.getMonth() + 1 == month &&
      birthday.getDate() == day
    ) {
      //判断年份的范围（3岁到100岁之间)
      var time = now_year - year
      if (time >= 3 && time <= 100) {
        return true
      }
      return false
    }
    return false
  }

  //校验位的检测
  var checkParity = function (card) {
    //15位转18位
    card = changeFivteenToEighteen(card)
    var len = card.length
    if (len == '18') {
      var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2)
      var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2')
      var cardTemp = 0,
        i,
        valnum
      for (i = 0; i < 17; i++) {
        cardTemp += card.substr(i, 1) * arrInt[i]
      }
      valnum = arrCh[cardTemp % 11]
      if (valnum == card.substr(17, 1)) {
        return true
      }
      return false
    }
    return false
  }

  //15位转18位身份证号
  var changeFivteenToEighteen = function (card) {
    if (card.length == '15') {
      var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2)
      var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2')
      var cardTemp = 0,
        i
      card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6)
      for (i = 0; i < 17; i++) {
        cardTemp += card.substr(i, 1) * arrInt[i]
      }
      card += arrCh[cardTemp % 11]
      return card
    }
    return card
  }
  return checkCard(card)
}
