import { notification, message } from 'antd';
import { history } from 'umi';
import axios from 'axios';
export default function request({url, body}) {
  return new Promise(async (resolve, reject) => {
    let formdata = new FormData()
    // formdata.append('file', dataFile)
    for(let key in body){
      formdata.append(key, body[key])
    }
    let config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
    // const dataRes = await 
    axios.post(url, formdata, config).then(response => {
        resolve(response.data)
    }).catch(error => {
      message.destroy()
      if (error.response) {
        let { status, data } = error.response;
        if (status === 400) {
          let { error, message,errorCode,errorMsg } = data
          notification.warning({
            message: `请求错误`,
            description: message ? message : errorMsg,
          });
          return;
        }
        if (status === 500) {
          let { error, message,errorCode,errorMsg } = data
          notification.error({
            message: `请求错误`,
            description: message ? message : errorMsg,
          });
          return;
        }
        if (status === 401) {
          history.replace('/user/login');
          return;
        }
        reject(error)
      } else if (error.request) {
        reject(error)
        throw error
      } else {
        reject(error)
        throw error
      }
    })
  })
}
export function requestPostFromData(url, body) {
  return request({url, body})
}