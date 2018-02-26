/**
 * Created by yejiaming on 2017/3/15.
 */
import Vue from 'vue';
import msgboxVue from './index.vue';

var CONFIRM_TEXT = '确定';
var CANCEL_TEXT = '取消';

var defaults = {
  title: '提示',
  message: '',
  type: '',
  showInput: false,
  showClose: true,
  modalFade: false,
  lockScroll: false,
  closeOnClickModal: true,
  inputValue: null,
  inputPlaceholder: '',
  inputPattern: null,
  inputValidator: null,
  inputErrorMessage: '',
  showConfirmButton: true,
  showCancelButton: false,
  confirmButtonPosition: 'right',
  confirmButtonHighlight: false,
  cancelButtonHighlight: false,
  confirmButtonText: CONFIRM_TEXT,
  cancelButtonText: CANCEL_TEXT,
  confirmButtonClass: '',
  cancelButtonClass: ''
};

var currentMsg, instance;
var msgQueue = [];
// merge方法一个工具方法，是为了检查对象key是否存在，存在即用，不存在使用默认代替
var merge = function (target) {
  for (var i = 1, j = arguments.length; i < j; i++) {
    var source = arguments[i];
    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        var value = source[prop];
        if (value !== undefined) {
          target[prop] = value;
        }
      }
    }
  }
  return target;
};

var MessageBoxConstructor = Vue.extend(msgboxVue);
// 初始化实例
var initInstance = function () {
  instance = new MessageBoxConstructor({
    el: document.createElement('div')
  });

  instance.callback = defaultCallback;
};
// 默认回调
const defaultCallback = (action) => {
  if (currentMsg) {
    var callback = currentMsg.callback;
    if (typeof callback === 'function') {
      callback(action);
    }
    if (currentMsg.resolve) {
      var $type = currentMsg.options.type;
      if ($type === 'confirm') {
        if (action === 'confirm') {
          currentMsg.resolve(action);
        } else if (action === 'cancel' && currentMsg.reject) {
          currentMsg.reject(action);
        }
      } else {
        currentMsg.resolve(action);
      }
    }
  }
};

// 显示弹窗
var showNextMsg = function () {
  if (!instance) {
    initInstance();
  }
  if (!instance.value) {
    if (msgQueue.length > 0) {
      currentMsg = msgQueue.shift();
      var options = currentMsg.options;
      for (var prop in options) {
        if (options.hasOwnProperty(prop)) {
          instance[prop] = options[prop];
        }
      }
      if (options.callback === undefined) {
        instance.callback = defaultCallback;
      }
      document.body.appendChild(instance.$el);
      Vue.nextTick(() => {
        instance.value = true;
      });
    }
  }
};

// 弹窗对象
var MessageBox = function (options, callback) {
  // 纠错
  if (typeof options === 'string') {
    options = {
      title: options
    };
    if (arguments[1]) {
      options.message = arguments[1];
    }
    if (arguments[2]) {
      options.type = arguments[2];
    }
  } else if (options.callback && !callback) {
    callback = options.callback;
  }
  // 放入弹窗队列中
  if (typeof Promise !== 'undefined') {
    return new Promise(function (resolve, reject) { // eslint-disable-line
      msgQueue.push({
        options: merge({}, defaults, MessageBox.defaults || {}, options),
        callback: callback,
        resolve: resolve,
        reject: reject
      });
      showNextMsg();
    });
  } else {
    msgQueue.push({
      options: merge({}, defaults, MessageBox.defaults || {}, options),
      callback: callback
    });
    showNextMsg();
  }
};

MessageBox.setDefaults = function (defaults) {
  MessageBox.defaults = defaults;
};

/**
 * 提示信息alert弹窗
 * @param message   提示信息，必传
 * @param title 提示标题
 * @param options
 */
MessageBox.alert = function (message, title, options) {
  if (typeof title === 'object') {
    options = title;
    title = '';
  }
  return MessageBox(merge({
    title: title,
    message: message,
    type: 'alert',
    timeOutClose: 500
  }, options));
};

// 确认弹窗
MessageBox.confirm = function (message, title, options) {
  if (typeof title === 'object') {
    options = title;
    title = '';
  }
  return MessageBox(merge({
    title: title,
    message: message,
    type: 'confirm'
  }, options));
};

// 关闭所有的弹窗
MessageBox.closeAll = function () {
  instance.value = false;
  msgQueue = [];
  currentMsg = null;
};
export default MessageBox;
export {MessageBox};
