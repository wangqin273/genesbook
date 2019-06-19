const configs = require("./config.js");

const log = (msg, level) => {
  let time = formatTime(new Date());
  if (configs.debug == 0) {
    return;
  }
  if (level === "error") {
    console.error(`[INFO]${time}: ${msg}`);
  } else {
    console.log(`[INFO]${time}: ${msg}`);
  }
}

const conversion = Numbers => {
  if (Numbers >= 10000) {
    Numbers = (Numbers / 10000) + '万'
  }
  // else if (Numbers >= 1000) {
  //   Numbers = (Numbers / 1000) + '千'
  // }
  return Numbers
};


/*反正重复点击，1500毫秒之内点击一次*/
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }
  let _lastTime = null
  // 返回新的函数
  return function() {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments) //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}
/**
 * 页面提示
 */
const showToast = (title, icon, time) => {
  wx.showToast({
    title: title,
    icon: icon ? icon : 'none',
    duration: time ? time : 1200
  })
}
/**
 * 页面弹框
 * title=>提示的标题
 * content=>提示的内容
 * showCancel=>是否显示取消按钮（默认true）
 * confirmText=>确认按钮的文本（默认确认）
 * cancelText=>取消按钮的文本（默认取消）
 * cancelColor=>取消按钮的文字颜色（默认#000000）
 * confirmColor=>确认按钮的文字颜色（默认#3CC51F）
 */
const showModal = (title, content, showCancel = true, confirmText = '确定', cancelText = '取消', cancelColor = '#000000', confirmColor = '#3CC51F') => {
  wx.showModal({
    title: title,
    content: content,
    showCancel: showCancel,
    cancelText: cancelText,
    cancelColor: cancelColor,
    confirmText: confirmText,
    confirmColor: confirmColor
  })
}
const showModalCb = (title, content, showCancel = true, confirmText = '确定', cancelText = '取消', cancelColor = '#000000', confirmColor = '#3CC51F', cb) => {
  wx.showModal({
    title: title,
    content: content,
    showCancel: showCancel,
    cancelText: cancelText,
    cancelColor: cancelColor,
    confirmText: confirmText,
    confirmColor: confirmColor,
    success: function (res) {
      if (res.confirm) {
        cb(true);
      } else if (res.cancel) {
        cb(false);
      }
    }
  })
}

/**
 * 判断数组中是否含有
 */
const inArray = (arr, str) => {
  var i = arr.length;
  while (i--) {
    if (arr[i] === str) {
      return true;
    }
  }
  return false;
}


module.exports = {
  log,
  conversion,
  throttle,
  inArray,
  showToast,
  showModal,
  showModalCb,
}