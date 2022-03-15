//发送请求
import config from './config'
export default (url,data={},method='GET') => {
    return new Promise((resolve,rejected) => {
        wx.request({
            url:config.host + url,
            data,
            method,
            header:{
              cookie: wx.getStorageSync('cookies') ?  wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) : ''
            },
            success:(res) => {
              if(data.isLogin){//表示为登陆请求
                wx.setStorage({
                  data: res.cookies,
                  key: 'cookies',
                })
              }
              resolve(res.data)
            },
            fail:(error) => {
              rejected(error)
            }
          })
    })
}