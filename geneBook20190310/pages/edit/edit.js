const request = require('../../utils/wxRequest.js');
const configs = require('../../utils/config.js');
const Utils = require('../../utils/util.js');
//获取应用实例
const app = getApp()
var x = 0,
  y = 0,
  w = 0,
  h = 0,
  ratio = 1,
  albums=[],
  timeoutThumb = {};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //用户信息
    userInfo: app.globalData.userInfo,
    /*相册*/
    img_update: '/image/img_update.png',
    img_delete: '/image/img_delete.png',
    img_back: '/image/img_back.png',
    edit_arrow: '/image/edit_arrow.png',
    toView: '',
    albumsLocal: [],
    albums: [],
    isPreview: false,
    currentPreview: 0,
    ratio: ['1:1', ' 4:3', '16:9'],
    r: 1,
    k: 0,
    w: 0,
    h: 0,
    message:'',
    wxnumber:'',
     /*通用遮罩层*/
    hideMask:true,
    topic_index:-1,
    hidetopic: true,
    /*参与话题*/
    topicOpt: [],
    /*城市选择*/
    region: ['广东省', '广州市'],
    customItem: ''
  },
  /*发布分享信息*/
  submitInfo: function() {
    let openId = wx.getStorageSync('openId');

    console.log('openId',openId)
    if (openId){
      var formData = {
        openId: openId,
        message: this.data.message,// 消息50字
        wxnumber:this.data.wxnumber,// 微信号
        topic_id:this.data.topicOpt[this.data.topic_index].id,//话题id
        region: JSON.stringify(this.data.region)//城市选择
      }
      console.log('formData', formData)
      request.postRequest('API/submitdata', formData).then(result => {
        if (result.errMsg == "request:ok") {
          // console.log('结果', result)
          console.log('albums', this.data.albums)
          this.data.albums.forEach((item, key) => {
            console.log('databaseid', result.data.databaseid)
            wx.uploadFile({
              url: configs.config.server_domain + 'API/submitdata',//
              filePath: this.data.albums[key],
              name: 'image_file0',
              formData: {
                databaseid: result.data.databaseid,
                type: 'file',
              },
              success(res) {
                wx.showToast('上传成功～', res);
                console.log('上传成功～', res)
              },
              fail(res) {
                console.log('失败', res)
              },
            })

          })
        } else {
          console.log(111)
        }

      })
    }


    // console.log(this.data.albums, this.data.message, this.data.wxnumber, this.data.topic_index >= 0, this.data.region.length>2)
    if (this.data.albums.length > 0 && this.data.message && this.data.wxnumber && this.data.topic_index>=0){
      // var formData={
      //   albums: [],//图片
      //   message: '',// 消息50字
      //   wxnumber: '',// 微信号
      //   topic_index:1,//话题索引
      //   region: ['广东省', '广州市'],//城市选择
      // }


      // formData = JOSN.stringify(albums)
      // this.data.albums.forEach((item) => {
        // 获取图片信息
        // wx.getImageInfo({
        //   src: item,
        //   success: (res) => {
        //     // console.log('宽度',res.width);
        //     // console.log('高度',res.height);
        //     var str = res.width / res.height;
        //     if (str > 1) {
        //       //横版图片  
        //       this.setData({
        //         w: res.width * ratio,
        //         h: res.height,
        //       })
        //     } else {
        //       //竖版图片 或正方形
        //       this.setData({
        //         w: res.width,
        //         h: res.height * ratio,
        //       })
        //     }
        //     albums.push(res.path);
        //     this.setData({
        //       albumsLocal: albums,
        //     })

        //     wx.nextTick(() => {
        //       // 在当前同步流程结束后，下一个时间片执行
        //       timeoutThumb = setTimeout(() => {
        //         // 下载图
        //         this.drawImage(res.path)
        //         wx.hideLoading();
        //       }, 1000) //延迟时间 这里是1秒
        //     })

        //   }
        // })
      // })

  
    } else {
      Utils.showToast('请上传图片')
    }  

  },
  /*上传图片到相册*/
  imgUpdate: function() {
    let albums = this.data.albums;
    let lens = albums.length;
    if (lens > 8) { //如果图片数量小于9张，可以直接获取图片
      wx.showToast({
        title: '上传图片不能大于9张!',
        icon: 'none'
      })
      return false
    }
    wx.chooseImage({
      count: 9 - lens, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // 可以指定是原图original还是压缩图compressed，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        var tempFilePaths = res.tempFilePaths;
        tempFilePaths.forEach((item) => {
          albums.push(item);
        })
        this.setData({
          albums: albums,
          toView: 'albums' + (albums.length - 1)
        })

      }
    })
  },
  /*一张图*/
  // drawImage: function(item) {
  //   wx.showLoading({
  //     title: '保存中请稍后...',
  //   })
  //   var ctx = wx.createCanvasContext('canvasposter');
  //   ctx.clearRect(x, y, this.w, this.h);
  //   /*绘制图片*/
  //   ctx.drawImage(item, x, y, this.w, this.h);
  //   ctx.restore();
  //   ctx.draw(false, this.getTempFilePath);
  // },
  //获绘制后的图片
  // getTempFilePath: function() {
  //   wx.canvasToTempFilePath({
  //     canvasId: 'canvasposter',
  //     success: (res) => {
  //       console.log('绘制图片', res.tempFilePath)
  //       this.saveImageToPhotosAlbum(res.tempFilePath)
  //     }
  //   })
  // },
  //保存至相册
  // saveImageToPhotosAlbum: function(imgUrl) {
  //   if (!imgUrl) {
  //     Utils.showModal('提示', '图片绘制中，请稍后重试', false)
  //   }
  //   wx.saveImageToPhotosAlbum({
  //     filePath: imgUrl,
  //     success: (res) => {
  //       Utils.showToast('保存成功', 'success')
  //     },
  //     fail: (err) => {
  //       Utils.showToast('保存失败')
  //     }
  //   })
  // },

  /*预览相册*/
  previewAlbums: function (e) {
    let imgs = this.data.albums;
    let lens = imgs.length;
    let imgsLocal = this.data.albumsLocal;
    this.setData({
      previewlist: imgs,
      currentPreview: e.currentTarget.dataset.index,
      curIdx: e.currentTarget.dataset.index + 1,
      isPreview: true
    })

  },
  /*预览相册切换*/
  swiperChange: function (e) {
    this.setData({
      curIdx: e.detail.current + 1,
      currentPreview: e.detail.current
    })
  },

  /*关闭预览*/
  comebackAbums: function() {
    this.setData({
      isPreview: false
    })
  },
  // 预览时删除图片
  deleteaAbumsImg: function(e) {
    var imgs = this.data.previewlist;
    var lens = imgs.length;
    var j = e.currentTarget.dataset.index; 
    var currentPreview = this.data.currentPreview;
  
    imgs.splice(j, 1);
    this.setData({
      previewlist: imgs,
      albums: imgs,
      currentPreview: lens == currentPreview + 1 ? currentPreview - 1 : currentPreview,//删除最后一张图时，当前预览变为前一张图片
      isPreview: lens !== 1,//长度是1的时候点击删除按钮后隐藏预览层
    }) 
  },


  getAlbums: function(albums) {
    // 获取相册图片个数 
    var albumArr = this.data.albums;
    var albumList = [];
    albumArr.forEach(function(item, i) {
      albumList.push(item);
    });
    this.setData({
      albumsLocal: albumList,
    })
  },
  ratioChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value) 
    var r = 1;
    switch (Number(e.detail.value)) {
      case 0:
        r = 1;
        break;
      case 1:
        r = 4 / 3;
        break;
      case 2:
        r = 16 / 9;
        break;
    }
    console.log('比例', this.data.k, ratio)
    this.setData({
      k: Number(e.detail.value),
      r: r,
      toView: 'albums' + (this.data.albums.length - 1)
    })
  },
 
  /*分享消息监听*/
  messageChange:function(e){
    console.log(e.detail.value)
    this.setData({
      message: e.detail.value
    })
  },
  bindNameInput: function (e) {
    this.setData({
      wxnumber: e.detail.value
    })
  },
  /*打开性别选择弹窗*/
 
  topicChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value) 
    this.setData({
      topic_index: Number(e.detail.value), 
    })
  },
  /*打开城市选择*/

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    //读取缓存 
    let homedata = wx.getStorageSync('homedata');
    let lastTime = wx.getStorageSync('lastTime');
    let timestamp = Date.parse(new Date());
    let time = timestamp - lastTime;
    if (homedata && time < app.globalData.maxtime) {
      var nav = homedata.nav;
      this.setData({
        topicOpt: homedata.nav,
      })
    } else {
      // 请求首页数据
      request.getRequest('API/datajson').then(res => {
        let homedata = res.data
        this.setData({
          topicOpt: homedata.nav,
        })
        wx.setStorage({
          key: 'homedata',
          data: homedata,
        })
        wx.setStorageSync('lastTime', timestamp)
      })
    }
  
  },

  preventDefault: function() {
    // PreventDefault
  },

})