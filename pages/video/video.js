import request from '../../utils/request'
Page({
  data: {
    videoGroupList:[],//导航标签数据
    navId:'',//导航的标识
    videoList:[],
    videoId:'',//视频的id标识
    videoUpdateTime:[],//记录video的播放时长
    isTriggered:false,//视频列表是否下拉刷新
  },
  onLoad(options) {
    //获取导航数据
    this.getVideoGroupListData();
  },

  //获取导航数据
  async getVideoGroupListData(){
    let videoGroupListData = await request('/video/group/list');
    this.setData({
      videoGroupList:videoGroupListData.data.slice(0,14),
      navId:videoGroupListData.data[0].id
    })
    //获取视频列表的数据
    this.getVideoList(this.data.navId);
  },
  //获取视频列表的数据
  async getVideoList(navId){
    let videoListData = await request('/video/group',{id:navId});
    //关闭loading
    wx.hideLoading()
    let index = 0;
    let videoList = videoListData.datas.map(item => {
      item.id = index ++;
      return item
    })
    //更新视频列表数据关闭下拉刷新
    this.setData({
      videoList,
      isTriggered:false
    })
  },
  //点击导航
  changeNav(event){
    let navId = event.currentTarget.id;//通过id传值number会自动换成string
    this.setData({
      navId:navId * 1,
      videoList:[]
    })
    wx.showLoading({
      title: '数据正在加载中',
    })
    //动态获取当前导航的数据
    this.getVideoList(this.data.navId)
  },
  //视频播放事件
  handlePlay(event){
    //解决多个视频可以同时播放的问题,涉及思想,单例模式:需要创建多个对象的场景下,通过一个变量接收
    let vid = event.currentTarget.id;
    // this.vid !== vid && this.videoContext && this.videoContext.stop();
    // this.vid = vid
    this.setData({
      videoId:vid
    })
    //创建video标签的实例对象
    this.videoContext = wx.createVideoContext(vid);
    //判断当前视频是否播放过,是否有播放记录
    let {videoUpdateTime } = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === vid);
    if(videoItem){
      this.videoContext.seek(videoItem.currentTime);
    }else{
      this.videoContext.play()
    }
    
  },
  //处理视频播放的时间函数
  handleTimeUpdate(event){
    let videoTimeObj = {
      vid:event.currentTarget.id,
      currentTime:event.detail.currentTime
    }
    let { videoUpdateTime } = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
    if(videoItem){//之前有
      videoItem.currentTime = videoTimeObj.currentTime
    }else{//之前没有
      videoUpdateTime.push(videoTimeObj)
    }
    this.setData({
      videoUpdateTime
    })
  },
  //播放视频结束的函数
  handleEnded(event){
    let { videoUpdateTime } = this.data;
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id) , 1); 
    this.setData({
      videoUpdateTime
    })
  },

  //下拉刷新事件,scroll-view
  handleRefresher(){
    this.setData({
      isTriggered:true
    })
    this.getVideoList(this.data.navId)
  },
  //触底加载scroll-view
  handleToLower(){
    console.log('下拉触底加载事件');
  }, 
  //跳转到搜索页面
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  onReady() {

  },
  onShow() {

  },
  onHide() {

  },
  onUnload() {

  },
  onShareAppMessage() {
    return {
      title: 'zidf',
      page:'/pages/video/video',
      imageUrl:'/static/images/nvsheng.jpg'
    };
  },
});