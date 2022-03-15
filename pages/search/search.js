// pages/search/search.js
import request from '../../utils/request'
let isSend = false;//函数节流
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent:'',//搜索框默认搜索文字
    hotList:[],//热搜榜单的数据
    searchContent:'',//输入框的内容
    searchList:[],//模糊匹配的数据
    historyList:[],//搜索得到历史纪录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData();
    this.getSearchHistory();
  },

  //获取初始化的数据
  async getInitData(){
    let placeholderData = await request('/search/default');
    let hotListData = await request('/search/hot/detail');
    this.setData({
      placeholderContent:placeholderData.data.showKeyword,
      hotList:hotListData.data
    })
  },

  //表单项内容发生改变的方法
  handleInputChange(event){
    this.setData({
      searchContent:event.detail.value.trim()
    })
    if(isSend){
      return
    }
    isSend = true;
    //发请求获取关键字的模糊匹配
    this.getSearchList();
    setTimeout(() => {
      isSend = false
    },300)
    
  },

  //获取搜索数据的功能
  async getSearchList(){
    if(!this.data.searchContent){
      this.setData({
        searchList:[]
      })
      return;
    }
    let { searchContent, historyList } = this.data
    let searchListData = await request('/search',{keywords:searchContent,limit:10})
    this.setData({
      searchList:searchListData.result.songs
    })
    //将搜索的关键字放到历史纪录中,如果历史纪录中有,则先删除,再将其加入到头部
    if(historyList.indexOf(searchContent) !== -1){
      historyList.splice(historyList.indexOf(searchContent),1)
    }
    historyList.unshift(searchContent);
    this.setData({
      historyList
    })
    wx.setStorageSync('searchHistory', historyList)
    
  },

  // 获取本地历史纪录
  getSearchHistory(){
   let historyList = wx.getStorageSync('searchHistory');
   if(historyList){
     this.setData({
      historyList
     })
   }
  },

  //清除搜索框内容
  clearSearchContent(){
    this.setData({
      searchContent:'',
      searchList:[]
    })
  },

  //删除历史纪录
  deleteSearchHistory(){
    wx.showModal({
      content: '确认删除搜索记录吗',
      success:(res) => {
        if(res.confirm){
          //删除data中的历史记录数组
          this.setData({
            historyList:[]
          })
          //移除本地缓存
          wx.removeStorageSync('searchHistory')
        }
      }
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