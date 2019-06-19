const request = require('../../utils/wxRequest.js');
const tcity = require("../../utils/citys.js");
const configs = require('../../utils/config.js');
const image_url = configs.config.image_url;
const Utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showconfirmbar: false,
    profile_arrow: image_url + 'profile_arrow.png',
    icoClose: image_url + 'ico_close.png',
    revamp: image_url + 'revamp.png',
    revamp_user: image_url + 'revamp_user.png',
    /*相册*/
    img_update: image_url + 'img_update.png',
    img_delete: image_url + 'img_delete.png',
    ico_back: image_url + 'ico_back.png',
    albumsLocal: [],
    albums: [],
    isPreview: false,
    currentPreview: 0,
    /*遮罩层*/
    hideMask: true,
    /*修改昵称*/
    hideNick: true,
    /*修改个性签名*/
    hideMonologue: true,
    textNumber: 0,
    maxlens: 250,
    nicknameVal: '',
    hideSex: true,
    /*修改性别*/
    sexOpt: ["男", "女", "取消"],
    /*修改身高*/
    stature: '',
    changestature: false,
    statureVal: [0],
    statureList: [],
    /*城市选择*/
    provinces: [],
    citys: [],
    province: '北京',
    city: '北京',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
  },
  /*上传图片到相册*/
  imgUpdate: function() {
    var _this = this;
    this.setData({
      hideMask: true,
      condition: false //关闭地区选择器
    });
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // 可以指定是原图original还是压缩图compressed，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        var tempFilePaths = res.tempFilePaths;
        var albums = this.data.albums;
        tempFilePaths.forEach((item) => {
          albums.unshift(item);
        })

        if (albums.length > 0) {
          tempFilePaths.forEach((item, key) => {
            wx.uploadFile({
              url: configs.config.server_domain + '/xcx/albums/create',
              filePath: tempFilePaths[key],
              name: 'image_file0',
              formData: {
                version_code: configs.version_code,
                sid: wx.getStorageSync('sid'),
                type: 'file',
              },
              success: function(res) {
                Utils.showToast('上传成功～');
                request.getRequest('users/detail').then(res => {
                  _this.data.albums = res.data.albums;
                  _this.getAlbums();
                })
              }
            })

          })
        }
      }
    })
  },

  // 删除图片
  deleteImg: function(e) {
    let imgs = this.data.albums;
    let lens = this.data.albums.length;
    let imgsLocal = this.data.albumsLocal;
    let i = e.currentTarget.dataset.idx;
    let j = e.currentTarget.dataset.index + 1;
    let imgid = e.currentTarget.dataset.imgid;
    if (imgid) {
      request.getRequest('albums/destroy', {
        id: imgid
      }).then(res => {
        if (res.data.error_code == 0) {
          Utils.showToast(res.data.error_reason);
          this.data.albums.splice(j, 1);
          if (lens < 6) {
            this.data.albums.splice(j, 1);
          }

          this.setData({
            albums: imgs
          });
          this.getAlbums(); /* 根据albums长度重新赋值 albumsLocal*/
        }
      })
    }

  },
  /*预览相册*/
  previewAlbums: function(e) {
    let imgs = this.data.albums;
    let lens = imgs.length;
    let imgsLocal = this.data.albumsLocal;
    let i = e.currentTarget.dataset.idx;
    let j = e.currentTarget.dataset.index;
    let currentPreview = 0;
    if (lens < 6) {
      currentPreview = j;
    } else {
      imgs.forEach(function(item, k) {
        if (item.id == imgsLocal[i][j].id) {
          currentPreview = k;
        }
      });
    }
    this.setData({
      previewlist: imgs,
      currentPreview: currentPreview,
      curIdx: currentPreview + 1,
      isPreview: true
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
    var imgid = e.currentTarget.dataset.img_id;
    var currentPreview = this.data.currentPreview;
    imgs.splice(j, 1);
    if (imgid) {
      request.getRequest('albums/destroy', {
        id: imgid
      }).then(res => {
        if (res.data.error_code == 0) {
          Utils.showToast(res.data.error_reason);
          this.data.albums.splice(j, 1);
          this.setData({
            albums: imgs,
            previewlist: imgs,
            currentPreview: lens == currentPreview + 1 ? currentPreview - 1 : currentPreview,
            isPreview: lens !== 1
          });
          this.getAlbums(); /* 根据albums长度重新赋值 albumsLocal*/
        }
      })
    }
  },
  /**/
  swiperChange: function(e) {
    this.setData({
      curIdx: e.detail.current + 1,
      currentPreview: e.detail.current
    })
  },

  /*更换头像*/
  revampAvatar: function() {
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // 可以指定是原图original还是压缩图compressed，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        var tempFilePaths = res.tempFilePaths;
        this.setData({
          'userInfo.avatar_small_url': tempFilePaths
        })
        var _this = this;
        wx.uploadFile({
          url: configs.config.server_domain + 'xcx/users/update_avatar',
          filePath: tempFilePaths[0],
          name: 'avatar_file',
          formData: {
            version_code: configs.version_code,
            sid: wx.getStorageSync('sid'),
            type: 'file',
          },
          success: function(res) {
            if (res.statusCode == 500) {
              Utils.showToast('上传失败，请联系客服');
              return;
            }
            var data = JSON.parse(res.data);
            if (data.error_code == 0) {
              Utils.showToast('更改成功', 'success');
              request.getRequest('users/basic_info').then(res => {
                wx.setStorageSync('userInfo', res.data);
              })

            }
          },
          fail: function() {
            Utils.showToast('上传图片失败');
          }

        })

      }
    })

  },
  getAlbums: function(albums) {
    // 获取相册图片个数  如果大于5个则使用swiper展示
    var albumArr = this.data.albums;
    var length = albumArr.length;
    var albumfirst = [];
    var albumlast = [];
    var albumList = [];
    var per_p = 6;
    albumArr.forEach(function(item, i) {
      if (i < 5) {
        albumfirst.push(item);
      } else {
        albumlast.push(item);
      }
    });
    albumlast.forEach(function(item, i) {
      if (i % per_p == 0) {
        albumList[parseInt(i / per_p)] = [];
      }
      albumList[parseInt(i / per_p)].push(item);
    });
    albumList.unshift(albumfirst);
    this.setData({
      albumsLocal: albumList,
    })
  },


  /*打开昵称编辑弹窗*/
  editNickname: function() {
    this.setData({
      hideMask: false,
      hideNick: false,
      condition: false
    })
  },
  /*监听昵称输入框*/
  bindNicknameInput: function(e) {
    this.setData({
      nicknameVal: e.detail.value
    })
  },
  /*保存昵称 并关闭昵称编辑弹窗*/
  saveNickname: function() {
    let userInfo = wx.getStorageSync('userInfo');
    let nickname = userInfo.nickname;
    let nicknameVal = this.data.nicknameVal;
    if (nickname != nicknameVal) {
      userInfo.nickname = nicknameVal ? nicknameVal : userInfo.nickname;
      this.userUpdate({
        nickname: nicknameVal
      })
    }

    this.setData({
      hideMask: true,
      hideNick: true,
    })

  },

  /*打开个性签名编辑弹窗*/
  editMonologue: function() {
    this.setData({
      hideMask: false,
      hideMonologue: false,
      condition: false
    })
  },
  /*监听个性签名输入框*/
  bindMonologueInput: function(e) {
    let megVal = e.detail.value;
    let len = megVal.length;
    let maxlens = maxlens;
    if (len > maxlens) {
      megVal = megVal.substring(0, maxlens);
      len = maxlens;
    }
    this.setData({
      monologueVal: megVal,
      textNumber: len,
    })
  },
  /*保存个性签名  并关闭昵称以及个性签名编辑弹窗*/
  saveMonologue: function() {
    let monologue = wx.getStorageSync('userInfo').monologue;
    let monologueVal = this.data.monologueVal;
    if (monologue != monologueVal && !monologueVal) {
      Utils.showToast('请填写个性签名');
      return;
    }
    if (monologue != monologueVal) {
      monologue = monologueVal ? monologueVal : monologue
      this.userUpdate({
        monologue: monologueVal
      })
    }
    this.setData({
      hideMask: true,
      hideMonologue: true,
    })

  },

  /*关闭昵称编辑弹窗*/
  closeMask: function() {
    this.setData({
      hideMask: true,
      hideNick: true,
      hideMonologue: true,
      nicknameVal: this.data.userInfo.nickname,
      monologueVal: this.data.userInfo.monologue,
      textNumber: this.data.userInfo.monologue.length,
    })
  },

  /*打开性别选择弹窗*/
  editSex: function() {
    this.setData({
      hideMask: false,
      hideSex: false,
      condition: false
    })
  },
  sexSelect: function(e) {
    let index = e.currentTarget.dataset.index;
    if (index < 2) {
      this.userUpdate({
        sex: index == 0 ? 1 : 0
      })
    }
    this.setData({
      hideMask: true,
      hideSex: true,
    })
  },
  /*打开身高   选择弹窗*/
  openStature: function(e) {
    var bool = Number(e.currentTarget.dataset.bool);
    if (bool) {
      this.data.stature = this.data.stature ? this.data.stature : 140;
      if (this.data.stature && this.data.stature != wx.getStorageSync('userInfo').height) {
        this.userUpdate({
          height: this.data.stature,
        })
      }
    }

    this.setData({
      hideMask: !this.data.hideMask,
      changestature: !this.data.changestature
    })

  },
  bindChangeStature: function(e) {
    let i = e.detail.value;
    let statureList = this.data.statureList;
    this.setData({
      stature: statureList[i],
    })

  },
  /*打开地区   选择弹窗*/
  openCity: function() {
    // 初始化城市
    if (this.data.citys.length <= 0) {
      tcity.init(this);
      var cityData = this.data.cityData;
      var provinces = [];
      var citys = [];
      for (let i = 0; i < cityData.length; i++) {
        provinces.push(cityData[i].name);
      }
      for (let i = 0; i < cityData[0].sub.length; i++) {
        citys.push(cityData[0].sub[i].name);
      }

      this.setData({
        provinces: provinces,
        citys: citys
      })

    }
    this.setData({
      hideMask: false,
      condition: true
    })

  },

  open: function(e) {

    var bool = Number(e.currentTarget.dataset.bool);
    if (bool) {
      if (this.data.city && this.data.city != wx.getStorageSync('userInfo').city_name) {
        this.userUpdate({
          province_name: this.data.province,
          city_name: this.data.city
        })
      }
    }
    this.setData({
      hideMask: true,
      condition: false
    })

  },
  bindChange: function(e) {
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      var citys = [];
      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name);
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        values: val,
        value: [val[0], 0, 0]
      })

      this.data.province = this.data.provinces[val[0]];
      this.data.city = cityData[val[0]].sub[0].name;
      return;
    }

    if (val[1] != t[1]) {
      this.setData({
        city: this.data.citys[val[1]],
        values: val,
        value: [val[0], val[1], 0]
      })
      this.data.city = this.data.citys[val[1]];
    }

  },
  /*生日*/
  bindDateChange: function(e) {
    if (e.detail.value && e.detail.value != wx.getStorageSync('userInfo').birthday)
      this.userUpdate({
        birthday: e.detail.value
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    request.getRequest('users/detail').then(res => {
      this.setData({
        userInfo: res.data,
        nicknameVal: res.data.nickname,
        monologueVal: res.data.monologue,
        textNumber: res.data.monologue ? res.data.monologue.length : 0,
      })

      this.data.albums = res.data.albums;
      this.getAlbums(res.data.albums);
    })

    // 初始化身高
    var statureList = []
    for (let i = 140; i < 221; i++) {
      statureList.push(i);
    }

    this.setData({
      statureList: statureList,
    })

  },

  /**
   * 修改用户资料信息
   */
  userUpdate: function(data) {
    var _this = this
    request.postRequest('users/update', data).then(res => {
      if (res.data.error_code == 0) {
        this.setData({
          userInfo: res.data
        })
        wx.setStorageSync('userInfo', res.data);
      } else {
        Utils.showToast('修改失败⊙▂⊙');
      }
    })
  },
  preventDefault: function() {
    // PreventDefault
  },

})