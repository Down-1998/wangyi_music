// pages/recommendSong/recommendSong.js
import PubSub from "pubsub-js"
import request from "../../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    month:'',
    recommendList:[],//每日推荐数据
    index:0,//当前点击歌曲的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断用户是否登陆
    let userInfo = wx.getStorageSync('userInfo')
    if(!userInfo){
      wx.showToast({
        title: '请先登陆',
        icon:'none',
        success:() => {
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
    //更新日期
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth() + 1
    })
    this.getRecommendList()

    //订阅来自songDetail页面发布的消息
    PubSub.subscribe('switchType',(msg,type) => {
      let { recommendList, index } = this.data;
      if(type === 'pre'){//上一首
       if(index === 0){
         index = recommendList.length;
       }
        index -= 1;
      }else{//下一首'
        if(index === recommendList.length - 1){
          index = -1
        }
        index += 1
      }
      //更新下标
      this.setData({
        index
      })

      let musicId = recommendList[index].id;
      //将musicId回传给songdetail的页面
      PubSub.publish('musicId', musicId)
    })
  },

  //获取用户每日推荐
  async getRecommendList(){
    let recommendListData = await request('/recommend/songs');
    this.setData({
      recommendList:recommendListData.recommend
    })
  },
  //点击每日推荐
  toSongDetail(event){
    let song = event.currentTarget.dataset.song;
    let index = event.currentTarget.dataset.index;
    this.setData({
      index
    })
    wx.navigateTo({
      url: `/songPackge/pages/songDetail/songDetail?musicId=${JSON.stringify(song.id)}`,
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