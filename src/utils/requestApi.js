import { notification, message } from 'antd'
import { history } from 'umi'
import axios from 'axios'
import {clearUserCookieAll } from './Utils'
import store from '../models'
export default function request(url, options, blob, namespace = 'office') {
  return new Promise((resolve, reject) => {
    let { method, body } = options
    let option = {
      method,
      url,
      header: {
        Accept: 'application/json',
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
        Expires: 0,
        key: 'stgame1128',
        'Content-Type': 'application/json; charset=utf-8',
      },
    }
    // TODO 添加token
    if (localStorage.getItem('token') && url.indexOf('uploads/office') == -1) {
      option.headers = option.headers || {}
      option.headers.Authorization = `Bearer ${window.localStorage.getItem('token')}`
      if (url.indexOf('uploads/office') > -1) {
        option.header.Authorization = null
      }
    }
    if (blob) {
      option.responseType = 'blob'
    }
    // 参数赋值
    switch (method) {
      case 'GET':
      case 'DELETE':
        option.params = body || {}
        break
      case 'POST':
      case 'PATCH':
      case 'PUT':
        option.data = body || {}
        break
    }

    axios(option)
      .then((response) => {
        if (
          namespace == 'westwell' ||
          response.config.url.indexOf('ww2_java_api') > -1 ||
          response.config.url.indexOf(':18001') > -1
        ) {
          resolve({
            data: response.data,
            headers: response.headers,
            response: response,
          })
        } else if (
          response.config.url.indexOf('captcha') > -1 &&
          response.headers?.['x-requestid']
        ) {
          resolve({
            data: response.data,
            requestId: response.headers?.['x-requestid'],
            url: response.config.url,
          })
        } else {
          resolve(response.data)
        }
      })
      .catch((error) => {
        // Sentry.captureException(error);
        if (url.indexOf('smartLedger') > -1) {
          let data = error?.response?.data || null
          let status = error?.response?.status
          if (error.request.responseType === 'blob' && data) {
            var reader = new FileReader()
            reader.readAsText(data, 'utf-8')
            reader.onload = function () {
              data = JSON.parse(reader.result)
              notification.warning({
                message: data?.errorMsg || '该账户暂无权限查看、操作智能台账',
              })
              reject(data?.errorMsg || '该账户暂无权限查看、操作智能台账')
              return false
            }
          } else {
            if (status == 400) {
              notification.warning({
                message: data?.errorMsg || '该账户暂无权限查看、操作智能台账',
              })
              reject(data?.errorMsg || '该账户暂无权限查看、操作智能台账')
              return false
            }
            reject('该账户暂无权限查看、操作智能台账')
            return false
          }
          return false
        }
        message.destroy()
        if (error.response) {
          let { status, data } = error.response
          if (status === 400) {
            let { error, message, errorCode, errorMsg } = data
            if (url.indexOf('user/login') > -1) {
              // 重置验证码
              store.dispatch.NUser.EGetCaptcha()
            }
            notification.warning({
              message: errorMsg || message || `请求数据异常`,
              // description: error || message,
            })
            reject('请求数据异常')
            return
          }
          if (status === 401) {
            notification.info({
              message: `用户信息失效，请重新登录`,
            })
            reject('用户信息失效，请重新登录')
            history.replace('/user/login')
            clearUserCookieAll()
            return
          }
          if (status === 403) {
            let { error, message, errorCode, errorMsg } = data
            notification.warning({
              message: `权限异常`,
            })
            reject('权限异常')
            return
          }
          if (status === 404) {
            let { error, message, errorCode, errorMsg } = data
            notification.warning({
              message: `路径异常`,
            })
            reject('路径异常')
            return
          }
          if (status === 500) {
            let { error, message, errorCode, errorMsg } = data
            notification.error({
              message: `接口异常`,
            })
            reject('接口异常')
            return
          }
          // throw error
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

export function requestGet(url, body, namespace = 'office') {
  return request(url, { method: 'GET', body }, false, namespace)
}
export function requestDelete(url, body, namespace = 'office') {
  return request(url, { method: 'DELETE', body }, false, namespace)
}
export function requestPost(url, body, namespace = 'office') {
  return request(url, { method: 'POST', body }, false, namespace)
}
export function requestPatch(url, body, namespace = 'office') {
  return request(url, { method: 'PATCH', body }, false, namespace)
}
export function requestPut(url, body, namespace = 'office') {
  return request(url, { method: 'PUT', body }, false, namespace)
}
export function requestExcel(url, body, namespace = 'office') {
  return request(url, { method: 'GET', body }, true, namespace)
}
export function requestPostExcel(url, body, namespace = 'office') {
  return request(url, { method: 'POST', body }, true, namespace)
}
export function requestGetExcel(url, body, namespace = 'office') {
  return request(url, { method: 'GET', body }, true, namespace)
}
