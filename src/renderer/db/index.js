import Vue from 'vue'
import Gun from 'gun'
require('gun/lib/path')
require('gun/lib/not')

export default {
  install: function (Vue, options) {
    Vue.$gunData = {
      gun: Gun(options),
      arrToGunObj: function (a) {
        var o = { _isArr: true }
        var l = a.length
        for (var i = 0; i < l; i++) if (a[i] !== undefined) o[i] = a[i]
        return o
      },
      addGunWatcher: function (keyPath, val, vm) {
        // console.log('add-gun-watch', vm.$options.$gunRootKey, keyPath)
        this.gun.get(vm.$options.$gunRootKey).path(keyPath)
          .not(function () { this.put(typeof val === 'object' && val.constructor === Array ? Vue.$gunData.arrToGunObj(val) : val) })
          .on(function (gunVal, gunKey) {
            if (typeof gunVal === 'object') return /* only do stuff on non objects */
            var vmPath = vm
            for (var i = 0, a = keyPath.split('.'), l = a.length; i < l - 1; i++) vmPath = vmPath[a[i]]
            if (vmPath[gunKey] !== gunVal) vm.$set(vmPath, vmPath.constructor === Array ? gunKey * 1 : gunKey, gunVal)
          }, { change: true })
      },
      timeout: {},
      vueWatcher: {},
      addVueWatcher: function (keyPath, vm) {
        this.vueWatcher[keyPath] = vm.$watch(keyPath, function (newVal) {
          // console.log('add-vue-watch', vm.$options.$gunRootKey, keyPath)
          clearTimeout(Vue.$gunData.timeout[vm.$options.$gunRootKey + keyPath])
          Vue.$gunData.timeout[vm.$options.$gunRootKey + keyPath] = setTimeout(function () {
            if (typeof newVal === 'object' && newVal.constructor === Array) {
              Vue.$gunData.gun.get(vm.$options.$gunRootKey).path(keyPath).set(Vue.$gunData.arrToGunObj(newVal))
            } else {
              Vue.$gunData.gun.get(vm.$options.$gunRootKey).path(keyPath).put(newVal)
            }
          }, 500)
        })
      },
      addWatchers: function (obj, keyPath, vm) {
        if (keyPath) keyPath += '.'
        var a = obj
        if (a === undefined) return
        var ok = Object.keys(a)
        var l = ok.length
        var k = ''
        var v = ''
        for (var i = 0; i < l; i++) {
          k = ok[i]
          v = a[k]
          if (typeof v === 'object') {
            this.addWatchers(v, keyPath + k, vm)
          } else {
            if (!this.vueWatcher[keyPath + k]) {
              Vue.$gunData.addVueWatcher(keyPath + k, vm)
              Vue.$gunData.addGunWatcher(keyPath + k, v, vm)
            }
          }
        }
      }
    }
    Vue.mixin({
      data: function () {
        var o = {}
        var a = this.$options.gunData
        if (a === undefined) return
        this.$options.$gunRootKey = a._rootKey || 'Apily'
        delete a._rootKey
        var ok = Object.keys(a)
        var l = ok.length
        for (var k = '', v = '', i = 0; i < l; i++) {
          k = ok[i]
          v = a[k]
          o[k] = v
        }
        return o
      },
      created: function () {
        Vue.$gunData.addWatchers(this.$options.gunData, '', this)
      }
    })
  }
}

