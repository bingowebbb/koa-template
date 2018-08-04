(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 定义类
 * Last modified: 2018-07-14 16:37
******************************************************************************/
/* global _, $, ar_ajax, Shuffle, LazyLoad, appCard, swal*/

var appCardList = function () {
  function appCardList(arg) {
    _classCallCheck(this, appCardList);

    this.url = 'inner.ar.list' || _.get(arg, url);
    this.$el_ct = _.get(arg, '$el_ct');
    this.page = _.get(arg, 'page') || 1;
    this.limit = _.get(arg, 'limit') || 50;
    this.sort = _.get(arg, 'sort') || {};
    this.isEnd = this.running = false;
    this.itemSelector = '.ugc-item-unit' || _.get(arg, 'itemSelector');
    this.lazyload_selector = '.ugc-lazyload' || _.get(arg, 'lazyloadSelector');
    this.card_args = _.get(arg, 'card_args');
    this.card_opts = _.get(arg, 'card');
    this.init_waypoint();
    this.init_shuffle();
    this.init_layload();
    this.init_card_unit();
    _.merge(this, arg);
  }

  _createClass(appCardList, [{
    key: 'init_waypoint',
    value: function init_waypoint() {
      var sf = this;
      this._waypoint_in = this.$el_ct.waypoint(function (direction) {
        if (direction == 'down' && !sf.loaded) {
          sf.load_data_fn();sf.loaded = true;
        }
      }, { offset: 'bottom-in-view' });
    }
  }, {
    key: 'init_shuffle',
    value: function init_shuffle() {
      this._shuffleInstance = new Shuffle(this.$el_ct[0], {
        itemSelector: this.itemSelector
      });
    }
  }, {
    key: 'init_layload',
    value: function init_layload() {
      var sf = this;
      this._myLazyLoad = new LazyLoad({
        elements_selector: this.lazyload_selector,
        callback_load: function callback_load() {
          setTimeout(function () {
            sf.shuffle.update();
            setTimeout(function () {
              sf.waypoint[0].context.refresh();
            }, 100);
          }, 50);
        }
      });
    }
  }, {
    key: 'init_card_unit',
    value: function init_card_unit() {
      this._card_unit = new appCard(_.merge({
        container: this.$el_ct,
        cls: [this.itemSelector.split('.')[1], 'col-sm-3 p-1'].join(' '),
        $noop: {
          putData: function putData(param, d) {
            var data = { id: param.pk };
            data[param.name] = param.value;
            ar_ajax('inner.models.update', data).done(function () {
              d.resolve();
            }).fail(function (rsp) {
              d.reject(rsp.errmsg);
            });
          }
        },
        icons: [{
          'attr': 'animationCount',
          'cls': 'oi oi-flash'
        }]
      }, this.card_opts || {}));
    }
  }, {
    key: 'remove_card',
    value: function remove_card($el) {
      var _this = this;

      var sf = this;
      var $unit_el = appCard.unit_element($el);
      var cardNum = this.$el_ct.find('.app-card').length;
      console.log('cardNum', cardNum);
      if (cardNum === 1) {
        sf.load_data_fn();
      }
      if ($unit_el.length == 0) {
        return;
      }
      this.shuffle.remove($unit_el);
      setTimeout(function () {
        _this.shuffle.update();
        setTimeout(function () {
          _this.waypoint[0].context.refresh();
        }, 100);
      }, 50);
    }
  }, {
    key: '_setContent',
    value: function _setContent($els) {
      var _this2 = this;

      this.shuffle.off(Shuffle.EventType.REMOVED);
      this.$el_ct.html($els);
      this.shuffle.add($els);
      setTimeout(function () {
        _this2.lazyload.update();
      }, 100);
    }
  }, {
    key: 'items_append_fn',
    value: function items_append_fn(lists) {
      var _this3 = this;

      var html = [];
      $.each(lists, function (k, v) {
        html.push(_this3.card_unit.html(v));
      });
      var $els = $(html.join(''));
      var _$els = this.$el_ct.children();
      this.shuffle.remove(_$els);
      this.shuffle.off(Shuffle.EventType.REMOVED).on(Shuffle.EventType.REMOVED, function () {
        _this3._setContent($els);
      });
      if (!_$els.length) {
        this._setContent($els);
      }
    }
  }, {
    key: 'load_data_fn',
    value: function load_data_fn() {
      if (this.running) {
        return;
      }
      if (this.isEnd) {
        swal({
          position: 'center', type: 'info',
          title: '没有更多啦，刷新试试吧！',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: '试试'
        }).then(function (rst) {
          rst.value && window.location.reload();
        });
        this.running = false;
        return;
      }
      this.running = true;
      var sf = this;
      ar_ajax(this.url, {
        query: this.card_args,
        page: this.page,
        limit: this.limit,
        sort: this.sort
      }).done(function (data) {
        console.log('data---', data);
        var meta = {
          total: data.total,
          page: data.page,
          pages: data.pages
        };
        sf.running = false;
        sf.count = data.total;
        sf.setPagination(meta, data.docs);
        if (!_.isEmpty(_.get(data, 'next'))) {
          // sf.page++; 
        } else {}
          // sf.isEnd = true;

          // sf.items_append_fn(data.list);
      });
    }
  }, {
    key: 'pass_fn',
    value: function pass_fn(data, sf) {
      var _sf = this;
      ar_ajax('inner.ar.pass', data).done(function () {
        swal_success('提交成功啦～');
        _sf.remove_card(sf);
      }).fail(function (rsp) {
        swal_error('提交失败');
      });
    }
  }, {
    key: 'setPagination',
    value: function setPagination(meta, list) {
      var sf = this;
      this.$el_pagination.pagination({
        dataSource: new Array(meta.total),
        pageRange: 5,
        currentPage: meta.page,
        pageNumber: meta.page,
        totalPage: meta.pages,
        totalNumber: meta.total,
        pageSize: this.limit,
        position: 'top',
        goButtonText: '确定',
        showGoInput: true,
        showGoButton: true,
        callback: function callback(data, pagination) {
          if (pagination.pageNumber == meta.page) {
            sf.items_append_fn(list);
          } else {
            sf.page = pagination.pageNumber;
            sf.load_data_fn();
          }
        }
      });
    }
  }, {
    key: 'count',
    get: function get() {
      return this._count;
    },
    set: function set(count) {
      this._count = count;
      // eslint-disable-next-line
      try {
        this.$el_count.text(count + ' 个');
      } catch (e) {}
    }
  }, {
    key: 'shuffle',
    get: function get() {
      return this._shuffleInstance;
    }
  }, {
    key: 'waypoint',
    get: function get() {
      return this._waypoint_in;
    }
  }, {
    key: 'lazyload',
    get: function get() {
      return this._myLazyLoad;
    }
  }, {
    key: 'card_unit',
    get: function get() {
      return this._card_unit;
    }
  }]);

  return appCardList;
}();

exports.appCardList = appCardList;

/***/ })
/******/ ]);
});