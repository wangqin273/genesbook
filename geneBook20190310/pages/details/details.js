// pages/detail/detail.js
//获取应用实例
var app = getApp()
const configs = require('../../utils/config.js');
const request = require('../../utils/wxRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenWidth: 0,   /*屏幕宽*/
    screenHeight: 0,  /*屏幕高*/
    ico_pic: '/images/ico_pic.png',    /*图片图标*/
    ico_local: '/images/ico_local.png',/*位置图标*/
    curIdx: 1,        /*当前图片索引值*/
    imgslens: 1,      /*当前图片总张数*/
    curData: {},      /*当前数据信息*/
    list: [], // 内容区列表
  },
  swiperChange: function (e) {
    this.setData({
      curIdx: e.detail.current + 1
    })
  },
  previewImage: function (e) {
    // var curSrc = e.target.dataset.src;
    // console.log(curSrc)
    // wx.previewImage({
    //   current: curSrc, // 当前显示图片的http链接  
    //   urls: this.data.curData.imgs // 需要预览的图片http链接列表  
    // })
  },
  copyId: function (e) {
    this.setData({
      // showMask: true,
      showAd: false,
    });
 
    wx.setClipboardData({
      data: this.data.curData.wxid,
      success:  (res)=> {
        wx.hideToast()  
        wx.showModal({
          title: '提示',
          content: '复制成功！请在微信中添加好友',
          showCancel: false,
          confirmText: '我知道了',
          confirmColor: '#259ce0',
          success: (result)=> {
          
          }
        })
      }
    });
  },
  //事件处理函数
  likeIt: function (e) {
    let id = e.currentTarget.dataset.id;
    let curData = this.data.curData;
    let like = 'this.curData.like';
    // console.log(list)
  
    if (curData.liked) {
      curData.like = curData.like - 1;
      curData.liked = 0
    } else {
      curData.like = curData.like + 1;
      curData.liked = 1
    } 
    console.log(curData)
    this.setData({
      curData: curData, 
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
    /*接受 首页传过来的id值*/
    // 在当前页面显示导航条加载动画。
    // wx.showNavigationBarLoading()
    // this.setTitle(options.title)
    // 设置当前数据 
    this.getInfoDta(options.id)
    //获取屏幕宽高
    let list = [ 
    {
      id: '002',
      cover: '/image/genetic/genetic_2.jpg',
      title: '豹纹守宫豹纹守宫豹纹守宫豹纹守宫豹纹守宫豹纹守宫豹纹守宫豹纹守宫豹纹守宫豹纹守宫 ',
      avatar: '/image/avatar.jpg',
      nickname: '上传者用户名',
      wxid: 'wangqin273',
      like: 20,
      imgs: [
        '/image/genetic/genetic_21.jpg',
        '/image/genetic/genetic_22.jpg',
        '/image/genetic/genetic_23.jpg',
      ]
    },
    
    {
      id: '004',
      cover: '/image/genetic/genetic_4.jpg',
      title: '豹纹守宫豹纹守宫 ',
      avatar: '/image/avatar.jpg',
      nickname: '上传者用户名',
      wxid: 'wangqin273',
      like: 351,
      imgs: [
        '/image/genetic/genetic_1.jpg',
        '/image/genetic/genetic_2.jpg',
        '/image/genetic/genetic_3.jpg',
      ]
    },
    {
      id: '005',
      cover: '/image/genetic/genetic_5.jpg',
      title: '豹纹守宫豹纹守宫 ',
      avatar: '/image/avatar.jpg',
      nickname: '上传者用户名',
      wxid: 'wangqin273',
      like: 12,
      imgs: [
        '/image/genetic/genetic_4.jpg',
        '/image/genetic/genetic_5.jpg',
        '/image/genetic/genetic_6.jpg',
      ]
    },
 
    {
      id: '010',
      cover: '/image/genetic/genetic_10.jpg',
      title: '豹纹守宫豹纹守宫 ',
      avatar: '/image/avatar.jpg',
      nickname: '上传者用户名',
      wxid: 'wangqin273',
      like: 0,
      imgs: [
        '/image/genetic/genetic_31.jpg',
        '/image/genetic/genetic_32.jpg',
        '/image/genetic/genetic_33.jpg',
      ]
    },
    ];
    this.setData({
      list: list
    });

  },

  getInfoDta: function (id){
    //读取缓存 
    let infodata = wx.getStorageSync('infodata'+id);
    let lastTime = wx.getStorageSync('lastTime' + id);
    let timestamp = Date.parse(new Date());
    let time = timestamp - lastTime;
    console.log('缓存 infodata 数据', infodata)
    if (infodata && time < app.globalData.maxtime) {
      let lens = infodata.imgs ? infodata.imgs.length : 0;
      this.setData({
        curData: infodata,
        imgslens: lens,
      })
    } else {
      // 请求详情数据 
      request.getRequest('API/datainfo?id='+id).then(res => {
        let infodata = res.data.data
        console.log('infodata', infodata)
        let lens = infodata.imgs ? infodata.imgs.length : 0;
        this.setData({
          curData: infodata,
          imgslens: lens,
        })
        wx.setStorage({
          key: 'infodata'+id,
          data: infodata,
        })
        wx.setStorage({
          key: 'lastTime' + id,
          data: timestamp,
        })
       
      })
    }
  },
  setTitle: function (title) {
    if (title) {
      title = title.substr(0, 10) + (title.length > 10 ? '···' : '');
    } else {
      title = '详情'
    }
    wx.setNavigationBarTitle({
      title: title
    })
    // 隐藏导航条加载动画。
    wx.hideNavigationBarLoading()
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