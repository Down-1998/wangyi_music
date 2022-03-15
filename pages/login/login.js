import request from '../../utils/request';
Page({
  data: {
    phone:'',//手机号
    password:''//密码
  },
  onLoad(options) {

  },
  onReady() {

  },
  onShow() {

  },
  //表单项内容发生改变
  handleInput(event){
    let type = event.currentTarget.id;
    this.setData({
      [type]:event.detail.value
    })
  },
  //登陆
 async login(){
    let { phone, password } = this.data;
    if(!phone){
      wx.showToast({
        title:'手机号不能为空',
        icon:'error'
      })
      return
    }
    //定义正则
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
    if(!phoneReg.test(phone)){
      wx.showToast({
        title:'手机号不合法',
        icon:'error'
      })
      return 
    }
    if(!password){
      wx.showToast({
        title:'密码不能为空',
        icon:'error'
      })
      return 
    }

    //后端验证
    let result = await request('/login/cellphone',{phone,password, isLogin:true},'GET');
    if(result.code == 200){
      wx.showToast({
        title: '登陆成功',
        icon:'success'
      })
      //将用户的信息存储到本地
      wx.setStorageSync('userInfo', JSON.stringify(result.profile))//同步方法
      //跳转到个人中心页reLaunch关闭所有页面打开一个新的页面
      wx.reLaunch({
        url: '/pages/personal/personal',
      })
    }else if(result.code === 400){
      wx.showToast({
        title:result.message,
        icon:'error'
      })
    }else if(result.code === 502){
      wx.showToast({
        title:result.message,
        icon:'error'
      })
    }else{
      wx.showToast({
        title:result.message,
        icon:'error'
      })
    }
  },
  onHide() {

  },
  onUnload() {

  },
  onShareAppMessage() {
    return {
      title: '',
    };
  },
});