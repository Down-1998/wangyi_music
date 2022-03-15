// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js';
import moment from 'moment'
import request from '../../../utils/request';
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,//标识音乐是否播放
    song:'',//歌曲信息
    musicId:'',//歌曲id
    musicLink:'',//音乐连接
    currentTime:'00:00',//当前播放时长
    durationTime:'00:00',//总时长
    currentWidth:0,//动态进度条宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //options用于接收路由跳转的query参数
    console.log(options.musicId);
    this.getMusicInfo(options.musicId)
    this.setData({
      musicId:options.musicId
    })

    //判断当前音乐是否在播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === options.musicId){
      //修改当前页面音乐播放的状态
      this.setData({
        isPlay:true
      })
    }

    /* 
      如果用户操作系统的控制音乐播放/暂停按钮,页面不知道,导致页面显示不正确
    */
   //创建音频的实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true)
      appInstance.globalData.musicId = options.musicId;
      
    })
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false)
    })
    //音乐停止
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false)
    })
    //音乐播放结束
    this.backgroundAudioManager.onEnded(() => {
      PubSub.publish('switchType','next');
      this.setData({
        currentWidth:0,
        currentTime:'00:00'
      })
    })
    //音乐时长监听
    this.backgroundAudioManager.onTimeUpdate(()=>{
      //总时长this.backgroundAudioManager.duration单位是秒
        let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss');
        let currentWidth = (this.backgroundAudioManager.currentTime) / (this.backgroundAudioManager.duration) * 450
        
        this.setData({
          currentTime,
          currentWidth
        })
    });
  },
  
  //修改音乐
  changePlayState(state){
    this.setData({
      isPlay:state
    })
    //修改全局音乐播放的状态
    appInstance.globalData.isMusicPlay = state;
  },

  //音乐详情
  async getMusicInfo(musicId){
    let songData = await request('/song/detail',{ids:musicId});
    let durationTime = moment(songData.songs[0].dt).format('mm:ss');
    this.setData({
      song:songData.songs[0],
      durationTime
    })
    //动态设置标题
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },

  // 处理音乐的播放
  handleMusicPlay(){
    let isPlay = !this.data.isPlay;
    // this.setData({
    //   isPlay
    // })
    this.musicControl(isPlay,this.data.musicId,this.data.musicLink);
  },

  //控制音乐播放/暂停的功能函数
 async musicControl(isPlay,musicId, musicLink){
    if(isPlay){//音乐播放
      if(!musicLink){//优化音乐播放发请求
        //获取音乐的播放连接
        let musicLinkData = await request('/song/url',{id:musicId})
        musicLink = musicLinkData.data[0].url;
        this.setData({
          musicLink
        })
      }
      this.backgroundAudioManager.src = musicLink//设置src
      this.backgroundAudioManager.title = this.data.song.name//设置title
    }else{
      this.backgroundAudioManager.pause();
    }
  },

  //切歌
  handleSwitch(event){
    let type = event.currentTarget.id;
    //关闭当前播放的音乐
    this.backgroundAudioManager.stop();
    //订阅来自推荐页面的musicid消息
    PubSub.subscribe('musicId',(msg,musicId)=>{
      console.log(musicId);
      //获取音乐的详情
      this.getMusicInfo(musicId)
      //自动播放当前音乐
      this.musicControl(true,musicId)
      PubSub.unsubscribe('musicId')
    })
    //发布消息给推荐歌曲的页面
    PubSub.publish('switchType',type)
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