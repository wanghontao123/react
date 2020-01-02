import axios from 'axios'
import qs from 'qs'
import { message } from 'antd'
let cancelToken = axios.CancelToken

const cancel = []

const removePending = config => {
  for(let p in cancel){
    if (cancel[p].u === config.url) {
      cancel[p].f()
    }
  }
}

// 请求拦截器 发送一个请求之前
axios.interceptors.request.use(config => {
  //在一个ajax发送前执行一下取消操作
  removePending(config)
  config.cancelToken = new cancelToken(c => {
    cancel.push({ 
      f: c,
      u: config.url,
    })
  })
  
  return config
}, error => {
  return Promise.reject(error)
})

//添加响应拦截器
axios.interceptors.response.use(response => {
  // switch (response && response.status) {
  //   case 200:
  //     message.success('请求成功')
  //     break;
  //   case 201:
  //     message.warning('aaa')
  //     break;
  //   case 202:
  //       message.warning('bbb')
  //       break;
  //   case 203:
  //       message.warning('ccc')
  //       break;
  //   default:
  //     break;
  //   }
  return response
}, error => {
  switch (error.response && error.response.status) {
    case 404:
      message.warning('数据丢失')
      break;
    case 500:
      message.warning('服务器报错')
      break;
    default:
      break;
  }
  return Promise.reject(error)
})

export const request = (url, payload = {}) => {
  // let result = ''
  // if(localStorage.getItem('token')) {
  //   result = {...payload, token: localStorage.getItem('token')}
  // } else {
  //   result = payload
  // }
  //qs.stringify(result)
  return new Promise((resolve, reject) => {
      axios({
        url,
        method: 'post',
        data: payload
      })
        .then(response => {
          resolve(response)
          
        })
        .catch(error => {
            reject(error)
        })
  })
}

export const get = (url, payload = {}) => {
  let result = ''
  if(localStorage.getItem('token')) {
    result = {...payload, token: localStorage.getItem('token')}
  } else {
    result = payload
  }
  return new Promise((resolve, reject) => {
      axios({
        url,
        method: 'get',
        data: qs.stringify(result)
      })
        .then(response => {
            resolve(response)
        })
        .catch(error => {
            reject(error)
        })
  })
}