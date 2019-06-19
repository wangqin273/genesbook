//app.js

App({
  onLaunch: function (options) {
    // 判断是否由分享进入小程序
    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = true
    } else {
      this.globalData.share = false
    };
    // 获取手机信息
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.globalData.barheight = res.statusBarHeight;
        that.globalData.windowWidth = res.windowWidth;
        that.globalData.windowHeight = res.windowHeight;
        /*判断是否为ipad 或者 iphone*/
        let isipd = /ipad|iphone/i.test(res.model)
        that.globalData.isIos = isipd ? true : false;
        /*判断是否为iPhone X*/
        let model = res.model.substring(0, res.model.indexOf("X")) + "X";
        if (model == 'iPhone X') {
          that.globalData.isIpx = true  //判断是否为iPhone X 默认为值false，iPhone X 值为true
        }

      }
    })

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // console.log('已经授权', res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              wx.setStorage({
                key: 'userInfo',
                data: res.userInfo,
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    maxtime: 1000, // 设置请求数据的时间间隔 1小时请求一次
    share: false,  // 分享默认为false
    barheight: 0,
    isIpx: false, // 是否iPhoneX
    isIos: false, // 是否ios
    windowWidth: 0, //可使用窗口宽度
    windowHeight: 0,   //可使用窗口高度
    userInfo: null
  }
})