# vue 弹窗组件的整合实现 #
关于弹窗和类似弹窗的效果其实包含很多，类似alert、confirm等属于传统基本弹窗。而像 indicator、sheet、popup等只是类似弹窗而已。不过他们的共同点就是都是全屏背景，然后居中显示内容，所以如果整合在一起是可行的，下面我们就来看下弹窗整合实现。

## 背景独立，type判断
* 背景独立是指无论是什么类型的弹窗，他们都是公用一个背景，而且允许控制显示颜色，该颜色的控制可以通过 opacity 来具体控制，这样既能完全显示透明背景，也可以实现黑色透明背景。
* type 判断是只通过设置props的一个属性type 来判断显示哪一种类型的弹窗。

* 代码：

```html
<template>
  <!--确认弹窗的最外层-->
  <div class="messageBox" @click.self="cancel()" v-show="value">
    <!--alert弹窗-->
    <div class="alert" v-if="type==='alert'">
      ...
    </div>
    <!--confirm弹窗-->
    <div class="confirm" v-if="type==='confirm'">
      ...
    </div>
    <!--全屏刷新中的指示器弹窗-->
    <div class="indicator" v-if="type==='indicator'">
      ...
    </div>
    <!--按钮在下的弹窗，如：退出登录-->
    <div class="sheet" v-if="type==='sheet'">
      ...
    </div>
    <!--显示Popup弹窗,如：置顶，取消置顶等-->
    <div class="popup" v-if="type==='popup'" :style="getTop">
        ...      
    </div>
    <!--空的弹窗-适用于自定义-->
    <div class="custom" v-if="type==='custom'" style="box-shadow: 0 2px 8px 0 rgba(0,0,0,0.18);">
      <slot></slot>
    </div>
    <!--背景-->
    <div class="v-modal" :style="{'opacity':isTransparent?0.001:0.5}"></div>
  </div>
</template>
```

## 使用 JS 封装组件
* 使用vue.extend方法去另外封装一下组件是参照mint-ui的弹窗，目的是为了丰富调用方式，而且将组件：alert、confrim这种标准弹窗组件当做一个新建的 Vue 实例是比较合理的。
* 代码：

```js
import Vue from 'vue';
import msgboxVue from './messageBox.vue';

var MessageBoxConstructor = Vue.extend(msgboxVue);
/*初始化实例*/
var initInstance = function () {
  instance = new MessageBoxConstructor({
    el: document.createElement('div')
  });

  instance.callback = defaultCallback;
};
...
export default MessageBox;
export {MessageBox};
```

## 采用两种方式调用
* 1、组件式调用方式：

```html
<MessageBox title="名次说明" type="alert" :value="showInfoFlag" valueName="showInfoFlag">
    <div slot="content" class="alert-content">
        ...
    </div>
</MessageBox>
```
* 2、常规JS 调用方式：

```js
messageBox.confirm('确定要删除此条问题吗？', '系统提示').then(function () {
    ...
}, function () {
    ...
});
```

## 总结##
* vue 组件的使用方式有很多，无需局限于常规的组件引用方式调用，换种思路和方法也许会更加灵活，关键在于不断尝试。


