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
/******************************************************************************
 * Author: zyb- zyb_hust@163.com
 * Description: -- 壁纸视频卡片展示模式
 * Last modified: 2018-06-14 11:57
******************************************************************************/
/* global _, $, Entity, colr, config */


// eslint-disable-next-line

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var appCard = function () {
  _createClass(appCard, null, [{
    key: 'unit_element',
    value: function unit_element($el) {
      return $($el).closest('.' + appCard.unit_name);
    }
  }, {
    key: 'unit_name',
    get: function get() {
      return 'jsunit-app-card';
    }
  }, {
    key: 'zoom',
    get: function get() {
      return 3;
    }
  }]);

  function appCard(options) {
    var _this = this;

    _classCallCheck(this, appCard);

    var sf = this;
    this.__store = {};
    this._options = options || {};
    this.__units = {};
    this.$noop = _.get(this._options, '$noop') || {};
    this.__fields = [];
    (_.get(this._options, 'entity') || []).forEach(function (v) {
      console.log("entity===:", v);
      _this.__fields.push(v.field);
      _this.__units[v.field] = new Entity[_.upperFirst(_.toLower(v._unit || v.field))](_.merge({
        container: _this._options.container,
        url: function url(params) {
          var data = sf.data(this);
          params.pk = data.id;
          var d = new $.Deferred();
          sf.$noop.putData.call(this, params, d);
          return d.promise();
        },
        $noop: {
          unit_element: Card.unit_element
        }
      }, v.options));
    });
  }

  _createClass(appCard, [{
    key: 'uniqueId',
    value: function uniqueId(v) {
      return _.isFunction(_.get(this.$noop, 'uniqueId')) ? this.$noop.uniqueId(v) : _.uniqueId(appCard.unit_name);
    }
  }, {
    key: 'data',
    value: function data($el, item) {
      var uqId = appCard.unit_element($el).data('_uqid');
      return _.get(this.__store, [uqId].concat(item ? item : []).join('.'));
    }
  }, {
    key: '_sdata',
    value: function _sdata(uqId, data) {
      this.__store[uqId] = data;
    }
  }, {
    key: '_icons',
    value: function _icons(v) {
      var icons = [];
      _.forEach(_.get(this._options, 'icons') || [], function (_v) {
        if (_.isFunction(_v, 'display')) {
          return icons.push(_v['display'](v, _v));
        }
        icons.push(['<span class="badge badge-secondary ', _.get(_v, 'cls'), '">', '&nbsp;', _.get(v, _v['attr']), '</span>'].join(''));
      });
      return icons;
    }
  }, {
    key: 'field',
    value: function field(v) {
      var _this2 = this;

      var html = [];
      _.forEach(this.__fields, function (fld) {
        html.push(_this2.__units[fld].display(v));
      });
      return html.join('');
    }
  }, {
    key: 'html',
    value: function html(v) {
      var uqId = this.uniqueId(v);
      this._sdata(uqId, v);
      var author = _.get(v, 'author'),
          icon = _.get(v, 'icon'),
          title = _.get(v, 'title'),
          deeplink = _.get(v, 'deeplink'),
          tags = _.get(v, 'tags'),
          media = _.get(v, 'media'),
          date = new Date(_.get(v, 'updatedAt')).toLocaleString();
      var b_css = _.get(v, 'status.processing') != 'SUCCESSED' ? 'border-primary' : 'border-success';
      var html = ['<div class="', [appCard.unit_name, _.get(this._options, 'cls')].join(' '), '" data-_uqid="', uqId, '">', '<div class="app-card card border ', b_css, '" style="padding: 2px; width: 100%; position: relative;">', '<button class="btn-sm btn-warning ugc-ar-edit" style="position:absolute; cursor: pointer; display:none;">编辑</button>', ' <div class="ugc-preview-areffect" style="display: block; float: left; width: 50%; height: 220px">', '   <img style="border-radius: 4px; position: relative; top: 50%; left: 50%; transform: translate(-50%, -50%);" width="100%" height="100%" class="card-img-app ugc-lazyload" data-src="', icon, '" alt="', _.get(v, 'title'), '"/>', ' </div>', ' <div class="app-card-body ', _.get(this._options, 'body.cls'), '" style="width: 49%; position: absolute; right: 0; top: 0; padding: 10px 5px">', _.isFunction(_.get(this._options, 'body.before')) ? _.get(this._options, 'body.before')(v) : '', _.isFunction(_.get(this._options, 'body.display')) ? _.get(this._options, 'body.display')(v) : ['   <p class="card-text">', '      <span class="d-block app-info-item" style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;"><strong>作者：</strong>', author, '</span>', '      <span class="d-block app-info-item" style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;"><strong>标题：</strong>', title, '</span>', '      <span class="d-block app-info-item" style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;"><strong>标签：</strong>', tags, '</span>', '      <span class="d-block app-info-item" style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;"><strong>链接：</strong><a href="', deeplink, '" target="_blank">', deeplink, '</a></span>', '   </p>'].join(''), _.isFunction(_.get(this._options, 'body.after')) ? _.get(this._options, 'body.after')(v) : '', ' </div>', ' </div>', '</div>'];
      return html.join('');
    }
  }]);

  return appCard;
}();

exports.appCard = appCard;

/***/ })
/******/ ]);
});