// pages/index.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],//轮播图
    recommendListL:[],//推荐歌单
    topList:[],//排行榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //获取轮播图数据
   let bannerListData = await request('/banner',{type:2},'GET')
   this.setData({
     bannerList:bannerListData.banners
   })
   
   //获取推荐歌单数据
   let recommendListData = await request('/personalized',{limit:10});
   this.setData({
    recommendListL:recommendListData.result
   })

   //获取排行榜的数据
   /* 
    根据idx的值获取对应的数据
    idx的取值范围0-24我们需要0-4
    我们组需要发送五次请求
   用户网络差导致加载时间长,长时间白屏,需要优化
   */
  let index = 0;
  let resultArr = []
  while(index < 5){
    let topListData = await request('/top/list',{idx:index++},'GET')
    let totalListItem = {name:topListData.playlist.name,tracks:topListData.playlist.tracks.slice(0,3)}
    resultArr.push(totalListItem);
    //不需要等待五次请求,用户体验好,但是渲染次数会多
    this.setData({
      topList:resultArr
    })
  }
  
   
  },

  //跳转每日推荐
  toRecommendSong(){
    wx.navigateTo({
      url: '/songPackge/pages/recommendSong/recommendSong',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})