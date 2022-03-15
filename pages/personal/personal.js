import request from '../../utils/request'
let startY = 0;
let moveY = 0;
let moveDistance = 0;
Page({
  data: {
    coverTransform:'translateY(0)',
    coverTranstion:'',
    userInfo:{},//用户信息
    recentPlayList:[],//最近播放记录
  },
  onLoad(options) {
    //读取用户信息
    let userInfo = wx.getStorageSync('userInfo');
    if(userInfo){
      this.setData({
        userInfo:JSON.parse(userInfo)
      })
      //获取用户的播放记录
      this.getUserrecentPlay(this.data.userInfo.userId)
    }
  },
  //获取用户的播放记录
  async getUserrecentPlay(userId){
    let recentPlayListData = await request('/user/record',{uid:userId,type:0})
    let index = 0;
    let recentPlayList = recentPlayListData.allData.splice(0,10).map(item => {
      item.id = index ++;
      return item;
    })
     this.setData({
       recentPlayList
     })
  },
  onReady() {

  },
  onShow() {

  },
  handleTouchStart(event){
    this.setData({
      coverTranstion:''
    })
    startY = event.touches[0].clientY;
  },
  handleTouchMove(event){
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;
    if(moveDistance <= 0) return 
    if(moveDistance > 80) moveDistance = 80
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`,
    })
  },
  handleTouchEnd(){
    this.setData({
      coverTransform: `translateY(0)`,
      coverTranstion:'transform 1s linear'
    })
  },
  //点击跳转到登陆页面
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
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