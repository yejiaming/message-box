<template>
  <!--确认弹窗的最外层-->
  <div class="messageBox" @click.self="cancel()" v-show="value">
    <!--alert弹窗-->
    <div class="alert" v-if="type==='alert'">
      <div class="title">
        <span>{{title}}</span>
        <i class="iconfont icon-close" @click="cancel()"></i>
      </div>
      <div class="content">
        <slot name="content">
          {{message}}
        </slot>
      </div>
      <div class="msgbox-btns">
        <slot name="confirmBtn">
          <button class="msgbox-btn msgbox-confirm" @click="confirm()">{{confirmButtonText}}</button>
        </slot>
      </div>
    </div>
    <!--confirm弹窗-->
    <div class="confirm" v-if="type==='confirm'">
      <div class="title">
        <slot name="title"><span>{{title}}</span></slot>
        <i class="iconfont icon-close" @click="cancel()"></i>
      </div>
      <div class="content">
        <slot name="content">
          {{message}}
        </slot>
      </div>
      <div class="msgbox-btns">
        <button class="msgbox-btn msgbox-cancel" @click="cancel()">{{cancelButtonText}}</button>
        <button class="msgbox-btn msgbox-confirm" @click="confirm()">{{confirmButtonText}}</button>
      </div>
    </div>
    <!--全屏刷新中的指示器弹窗-->
    <div class="indicator" v-if="type==='indicator'">
      <div class="spinner">
        <slot></slot>
        <slot name="text">
          <div class="indicator-text" v-if="message"><span>{{message}}</span></div>
        </slot>
      </div>
    </div>
    <!--按钮在下的弹窗，如：退出登录-->
    <div class="sheet" v-if="type==='sheet'">
      <div class="sheetLine" @click="sheetClk($index)" v-for="sheet,$index in sheetArray">
        <span>{{sheet}}</span>
      </div>
    </div>
    <!--显示Popup弹窗,如：置顶，取消置顶等-->
    <div class="popup" v-if="type==='popup'" :style="getTop">
      <span class="triangle" :style="getTR" v-if="triangle"></span>
      <slot name="popup">
      </slot>
    </div>
    <!--空的弹窗-适用于自定义-->
    <div class="custom" v-if="type==='custom'" style="box-shadow: 0 2px 8px 0 rgba(0,0,0,0.18);">
      <slot></slot>
    </div>
    <!--背景-->
    <!--@click="cancel()"-->
    <div  class="v-modal" :style="{'opacity':isTransparent?0.001:0.5}"></div>
  </div>
</template>
<script>
  export default {
    props: {
      // 控制显示弹窗和隐藏
      value: {
        type: Boolean,
        default: false
      },
      // value的名称
      valueName: String,
      /*弹窗类型*/
      type: {
        type: String,
        default: 'alert'
      },
      // 弹窗显示内容
      message: {
        type: String
      },
      // 弹窗显示之后是否锁住滚动
      lockScroll: {
        type: Boolean,
        default: true
      },
      // 弹窗标题
      title: {
        type: String,
        default: '提示'
      },
      // 自动关闭弹窗，几秒之后，如果设置为0，那么就不自动关闭
      timeOutClose: {
        type: [String, Number],
        default: 0
      },
      // 确定按钮的默认text
      confirmButtonText: {
        type: String,
        default: '确定'
      },
      // 取消按钮的默认text
      cancelButtonText: {
        type: String,
        default: '取消'
      },
      // sheet类型弹窗显示
      sheetArray: Array,
      // popup的高度
      popupHeight: [String, Number],
      // popup弹窗显示位置，搭配v-position指令来用，需要获取所有的包括点击目标element元素的位置以及点击的位置
      position: Object,
      // s是否显示小三角
      triangle: {
        type: Boolean,
        default: true
      },
      // 控制背景是否透明
      isTransparent: {
        type: Boolean,
        deault: false
      },
    },
    data() {
      return {}
    },
    computed: {
      // 获取popup的位置
      getTop: function () {
        if (this.value) {  // 当绚烂完毕才调整top位置
          let bottom = this.position && this.position.bottom;
          let top = this.position && this.position.top;
          let popupsHeight = this.popupHeight;
          // 保持在视野范围之内
          if (document.body.clientHeight * 2 / 3 <= bottom + 10) {
            return this.position && 'top:' + (top - 10 - popupsHeight) + 'px;';
          } else {
            return this.position && 'top:' + (bottom + 10) + 'px;';
          }
        }
      },
      // 获取popup的小三角的位置
      getTR(){
        if (this.value) {
          let bottom = this.position && this.position.bottom;
          let left = this.position && this.position.left;
          let right = this.position && this.position.right;
          let top = this.position && this.position.top;
          let popupsHeight = this.popupHeight;
          let rt = this.position && (this.position.clientX-5);  // -5是为了让有角的一部分居中
          if (document.body.clientHeight * 2 / 3 <= bottom + 10) {
            return this.position && 'bottom:' + (-19) + 'px;' + 'left:' + rt + 'px;' + 'border-top-color:#fff';
          } else {
            return this.position && 'top:' + (-19) + 'px;' + 'left:' + rt + 'px;' + 'border-bottom-color:#fff';
          }
        }
      },
    },
    watch: {
      value: function (val) {
        val && (document.body.style.overflow = 'hidden');
      }
    },
    beforeMount: function () {
    },
    beforeDestroy: function () {
      document.body.style.overflow = '' && this.lockScroll;
    },
    methods: {
      // 弹窗点击确定
      confirm: function () {
        this.hideModal();
        this.callback ? this.callback('confirm') : this.$emit('confirm', this.value);
      },
      // 弹窗点击取消
      cancel: function () {
        this.hideModal();
        this.callback ? this.callback('cancel') : this.$emit('cancel', this.value);
      },
      // sheet事件
      sheetClk: function (index) {
        this.hideModal();
        this.callback ? this.callback(index) : this.$emit('sheetClk', index, this.value);
      },
      // 隐藏弹窗
      hideModal: function () {
        this.valueName && this.$parent[this.valueName] && (this.$parent[this.valueName] = false);
        this.message = '';
        this.title = '提示';
        this.value = false;
      }
    }
  };
</script>


<style scoped lang="less" rel="stylesheet/less">
  @import "index";
</style>
