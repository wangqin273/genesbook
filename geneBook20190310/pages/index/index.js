//index.js
//获取应用实例
var app = getApp()
const configs = require('../../utils/config.js');
const request = require('../../utils/wxRequest.js');
var navid = 0, page = 1, pagecount;
Page({
  data: {
    isIpx: app.globalData.isIpx ? true : false,
    //用户信息
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
 
    tabs: ['推荐', '分享', '标记', '展示', '严选', '出售', '求购', '菜单1', '菜单2', '菜单3', '菜单4'], // 导航菜单栏
    curIdx: 0, // 当前导航索引
    toView: '',
    banner: [],
    indicatorDots: true,
    list: [], // 内容区列表
 
    nobaseline:true,
  },
  // banner跳转小程序
  bannerSelect: function (e) {
    console.log('跳转', e.currentTarget.dataset.source)
    let appId = e.currentTarget.dataset.source || 'wx4010446823a68219';
    let title = e.currentTarget.dataset.title;
    let website = e.currentTarget.dataset.website;
    if (appId) {
      wx.navigateToMiniProgram({
        appId: appId,
        path: 'pages/index/index',
        extraData: {
          foo: 'bar'
        },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
    }

    if (website) {
      wx.navigateTo({
        url: '/pages/webview/webview?website=' + website + '&title=' + title
      })
    };
    
  },
  //事件处理函数
  likeIt:function(e){
    let id = e.currentTarget.dataset.id;
    let list = this.data.list;
    console.log(id)
    console.log(this.data.list)
    list.forEach((item)=>{``
      if (item.id == id) {
        if(item.liked){
          item.like = item.like - 1;
          item.liked = false;
          request.getRequest('API/datalike?id=' + id + '&like=' + item.liked).then(res => {
            console.log('喜欢', res)
          })
        }else{
          item.like = item.like +1;
          item.liked = true;
          request.getRequest('API/datalike?id=' + id + '&like=' + item.liked).then(res => {
            console.log('不喜欢', res)
          })
        }
      }
    })
    this.setData({
      list: list, 
    })
  
  },
  // 进入编辑页
  editShare(){
    wx.navigateTo({
      url: '../edit/edit'
    })
  },
  //进入详情页
  readMore(e){
    let id = e.currentTarget.dataset.id; 
    let title = this.data.tabs[this.data.curIdx]; 
    wx.setStorage({
      key: 'listdata',
      data: this.data.list,
    }) 
    wx.navigateTo({
      url: '../details/details?id=' + id + '&title=' + title
    })
  },
  //点击切换
  tabSelect: function(e) {
    let idx = e.currentTarget.dataset.idx;
    this.setData({
      curIdx: idx,
      toView: 'tabs_' + (idx - 1)
    })
    if (idx) {
      wx.showToast({
        title: '项目完善中！敬请期待！',
        icon: 'none',
        duration: 1000
      })
    }
  },

  /*关闭遮罩层*/
  hideMask: function() {
    this.setData({
      curIdx: 0
    })
  },
  //滑动切换
  swiperTab: function(e) {
    this.setData({
      curIdx: e.detail.current
    });
  },

  onLoad: function() {
    // 判断是否授权
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    this.getDataList(navid, page)
  },

  getDataList: function (navid,page){
    //读取缓存 
    let homedata = wx.getStorageSync('homedata_' + navid+'_'+ page);
    let lastTime = wx.getStorageSync('lastTime_' + navid + '_' + page);
    let timestamp = Date.parse(new Date());
    let time = timestamp - lastTime;
    console.log('缓存首页数据', homedata)
    if (homedata && time < app.globalData.maxtime) {
      var banner = homedata.banner;
      var nav = homedata.nav;
      var list = this.data.list.concat(homedata.datalist.data);
      this.setData({
        banner: banner,
        tabs: nav,
        list: list,
      });

    } else {
      // 请求首页数据
      request.getRequest('API/datajson?navid=' + navid + '&page=' + page).then(res => {
        console.log('页码',page)
        let homedata = res.data
        console.log('homedata', homedata)
        var banner = homedata.banner;
        var nav = homedata.nav;
        var list = this.data.list.concat(homedata.datalist.data);
        pagecount = homedata.datalist.pagecount;
        navid = nav[0].id;    
        console.log('navid', navid)
        this.setData({
          banner: banner,
          tabs: nav,
          list: list
        });
        wx.setStorage({
          key: 'homedata_' + navid + '_' + page,
          data: homedata,
        })
        wx.setStorage({
          key: 'lastTime_' + navid + '_' + page,
          data: timestamp,
        })
        
      })
    }

  },
  /**
   * 页面下拉刷新事件的处理函数
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // 更新列表
    page++ 
    console.log('page', page, 'pagecount', pagecount)
    if (page > pagecount){ 
      page = pagecount
      this.setData({ 
        nobaseline: false
      });
      var Timer = setTimeout(() => {
        this.setData({
          nobaseline: true
        });
      }, 1000);
    }else{
      this.getDataList(navid, page)
      this.setData({ 
        nobaseline:true
      });
    }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
   
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //获取用户信息
  getUserInfo: function (e) {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log('登录信息', res)
        // console.log('获取用户信息', e)
        let userdata = {
          "code": res.code,
          "encryptedData": e.detail.encryptedData,
          "iv": e.detail.iv,
        }
        // console.log(data)
        wx.setStorage({
          key: 'userdata',
          data: userdata,
        })
        request.postRequest('API/submitdata', userdata).then(result => {
          if (result.errMsg == "request:ok") {
            console.log('结果', result.data)
            wx.setStorage({
              key: 'openId',
              data: result.data.openId,
            })
          } else {
            console.log(111)
          }

        })
      }
    })
    wx.setStorage({
      key: 'userInfo',
      data: e.detail.userInfo
    })
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})