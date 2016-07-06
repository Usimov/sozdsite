window.rnd_seed = new Date().getTime();

if (!window._ua) {var _ua = navigator.userAgent.toLowerCase();}
var browser = {
  version: (_ua.match( /.+(?:me|ox|on|rv|it|era|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
  opera: /opera/i.test(_ua),
  msie: (/msie/i.test(_ua) && !/opera/i.test(_ua)),
  msie6: (/msie 6/i.test(_ua) && !/opera/i.test(_ua)),
  msie7: (/msie 7/i.test(_ua) && !/opera/i.test(_ua)),
  msie8: (/msie 8/i.test(_ua) && !/opera/i.test(_ua)),
  msie9: (/msie 9/i.test(_ua) && !/opera/i.test(_ua)),
  mozilla: /firefox/i.test(_ua),
  chrome: /chrome/i.test(_ua),
  safari: (!(/chrome/i.test(_ua)) && /webkit|safari|khtml/i.test(_ua)),
  iphone: /iphone/i.test(_ua),
  ipod: /ipod/i.test(_ua),
  iphone4: /iphone.*OS 4/i.test(_ua),
  ipod4: /ipod.*OS 4/i.test(_ua),
  ipad: /ipad/i.test(_ua),
  android: /android/i.test(_ua),
  bada: /bada/i.test(_ua),
  mobile: /iphone|ipod|ipad|opera mini|opera mobi|iemobile|android/i.test(_ua),
  msie_mobile: /iemobile/i.test(_ua),
  safari_mobile: /iphone|ipod|ipad/i.test(_ua),
  opera_mobile: /opera mini|opera mobi/i.test(_ua),
  opera_mini: /opera mini/i.test(_ua),
  mac: /mac/i.test(_ua)
};




// DOM

function ge(el) {return ('string'==typeof el||'number'==typeof el)?document.getElementById(el):el;}
function geByTag(searchTag, node) {return (node||document).getElementsByTagName(searchTag);}
function geByTag1(searchTag, node) {node = node || document;return node.querySelector && node.querySelector(searchTag) || geByTag(searchTag, node)[0];}
function geByClass(searchClass, node, tag) {
  node = node || document;
  tag = tag || '*';
  if (!browser.msie8 && node.querySelectorAll && tag != '*') {
    return node.querySelectorAll(tag + '.' + searchClass);
  }

  var classElements = [];
  if (node.getElementsByClassName) {
    var nodes = node.getElementsByClassName(searchClass);
    if (tag != '*') {
      tag = tag.toUpperCase();
      for (var i = 0, l = nodes.length; i < l; ++i) {
        if (nodes[i].tagName.toUpperCase() == tag) {
          classElements.push(nodes[i]);
        }
      }
      i=l=null;
    } else {
      classElements = Array.prototype.slice.call(nodes);
    }
    nodes=null;
  }
  else
  {
    var els = geByTag(tag, node);
    var pattern = new RegExp('(^|\\s)' + searchClass + '(\\s|$)');
    for (var i = 0, l = els.length; i < l; ++i) {
      if (pattern.test(els[i].className)) {
        classElements.push(els[i]);
      }
    }
    els=pattern=i=l=0;
  }
  return classElements;
}
function geByClass1(searchClass, node, tag) {
  node = node || document;
  tag = tag || '*';
  return !browser.msie8 && node.querySelector && node.querySelector(tag + '.' + searchClass) || geByClass(searchClass, node, tag)[0];
}

function ce(tagName, attr, style) {
  var el = document.createElement(tagName);
  if (attr) extend(el, attr);
  if (style) setStyle(el, style);
  return el;
}
function re(el) {
  el = ge(el);
  if (el && el.parentNode) el.parentNode.removeChild(el);
  return el;
}
function se(html) {
  var el=document.createElement('div');
  el.innerHTML=html;
  return el.firstChild;
}
function rs(html, repl) {
  each (repl, function(k, v) {
    html = html.replace(new RegExp('%' + k + '%', 'g'), v);
  });
  return html;
}

function insertBefore(srcObj, newObj){srcObj.parentNode.insertBefore(newObj, srcObj);}
function insertAfter(srcObj, newObj){srcObj.parentNode.insertBefore(newObj, srcObj.nextSibling);}

//
//  Useful utils
//
function isFunction(obj) {return Object.prototype.toString.call(obj) === '[object Function]'; }
function intval(value) { if (value === true) return 1; return parseInt(value) || 0; }
function floatval(value) { if (value === true) return 1; return parseFloat(value) || 0; }

//
//  Arrays, objects
//
function each(object, callback) {
  var name, i = 0, length = object.length;

  if (length === undefined) {
    for (name in object)
      if (callback.call(object[name], name, object[name]) === false)
        break;
  } else {
    for (var value = object[0];
         i < length && callback.call(value, i, value) !== false;
         value = object[++i]) {}
  }

  return object;
}

// Extending object by another
function extend() {
  var a = arguments, target = a[0] || {}, i = 1, l = a.length, deep = false, options;

  if (typeof target === 'boolean') {
    deep = target;
    target = a[1] || {};
    i = 2;
  }

  if (typeof target !== 'object' && !isFunction(target)) target = {};

  for (; i < l; ++i) {
    if ((options = a[i]) != null) {
      for (var name in options) {
        var src = target[name], copy = options[name];

        if (target === copy) continue;

        if (deep && copy && typeof copy === 'object' && !copy.nodeType) {
          target[name] = extend(deep, src || (copy.length != null ? [] : {}), copy);
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  return target;
}

//
// CSS classes
//
function hasClass(obj, name) {
  obj = ge(obj);
  return obj && (new RegExp('(\\s|^)' + name + '(\\s|$)')).test(obj.className);
}

// Get computed style
function getStyle(elem, name, force) {
  elem = ge(elem);
  if (isArray(name)) { var res = {}; each(name, function(i,v){res[v] = getStyle(elem, v);}); return res; }
  if (force === undefined) {
    force = true;
  }
  if (!force && name == 'opacity' && browser.msie) {
    var filter = elem.style['filter'];
    return filter ? (filter.indexOf('opacity=') >= 0 ?
      (parseFloat(filter.match(/opacity=([^)]*)/)[1] ) / 100) + '' : '1') : '';
  }
  if (!force && elem.style && (elem.style[name] || name == 'height')) {
    return elem.style[name];
  }

  var ret, defaultView = document.defaultView || window;
  if (defaultView.getComputedStyle) {
    name = name.replace(/([A-Z])/g, '-$1').toLowerCase();
    var computedStyle = defaultView.getComputedStyle(elem, null);
    if (computedStyle) {
      ret = computedStyle.getPropertyValue(name);
    }
  } else if (elem.currentStyle) {
    if (name == 'opacity' && browser.msie) {
      var filter = elem.currentStyle['filter'];
      return filter && filter.indexOf('opacity=') >= 0 ?
        (parseFloat(filter.match(/opacity=([^)]*)/)[1]) / 100) + '' : '1';
    }
    var camelCase = name.replace(/\-(\w)/g, function(all, letter){
      return letter.toUpperCase();
    });
    ret = elem.currentStyle[name] || elem.currentStyle[camelCase];
    //dummy fix for ie
    if (ret == 'auto') {
      ret = 0;
    }

    if (!/^\d+(px)?$/i.test(ret) && /^\d/.test(ret)) {
      var style = elem.style, left = style.left, rsLeft = elem.runtimeStyle.left;

      elem.runtimeStyle.left = elem.currentStyle.left;
      style.left = ret || 0;
      ret = style.pixelLeft + 'px';

      style.left = left;
      elem.runtimeStyle.left = rsLeft;
    }
  }

  if (force && (name == 'width' || name == 'height')) {
    var ret2 = getSize(elem, true)[({'width': 0, 'height': 1})[name]];
    ret = (intval(ret) ? Math.max(floatval(ret), ret2) : ret2) + 'px';
  }

  return ret;
}
function setStyle(elem, name, value){
  elem = ge(elem);
  if (!elem) return;
  if (typeof name == 'object') return each(name, function(k, v) { setStyle(elem,k,v); });
  if (name == 'opacity') {
    if (browser.msie) {
      if ((value + '').length) {
        if (value !== 1) {
          elem.style.filter = 'alpha(opacity=' + value * 100 + ')';
        } else {
          elem.style.filter = '';
        }
      } else {
        elem.style.cssText = elem.style.cssText.replace(/filter\s*:[^;]*/gi, '');
      }
      elem.style.zoom = 1;
    };
    elem.style.opacity = value;
  } else {
    try{
      var isN = typeof(value) == 'number';
      if (isN && (/height|width/i).test(name)) value = Math.abs(value);
      elem.style[name] = isN && !(/z-?index|font-?weight|opacity|zoom|line-?height/i).test(name) ? value + 'px' : value;
    } catch(e){debugLog([name, value]);}
  }
}

//-------------------------

function rnd(){window.rnd_seed=(window.rnd_seed*9301+49297)%233280;return window.rnd_seed/(233280.0);}
function random(n){return Math.ceil(rnd()*n);}
function irand(mi, ma) { return Math.floor(rand(mi, ma)); }
function consoleDbg(mes){if (window.dbgMode && window.console) {console.log(mes);}}
function isset(v){return 'undefined'!==typeof v;}
function extendClass(ChildClass, ParentClass) {
  ChildClass.prototype = new ParentClass();
  ChildClass.prototype.constructor = ChildClass;
}
function htmlentities(str) { return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function htmlspecialchars(text) { return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }
function setcookie(name, value, expires, path, domain, secure)
{
  document.cookie =    name + "=" + escape(value) +
    ((expires) ? "; expires=" + (new Date(expires)) : "") +
    ((path) ? "; path=" + path : "") +
    ((domain) ? "; domain=" + domain : "") +
    ((secure) ? "; secure" : "");
}


//
// Cookies
//

function _initCookies() {
  window._cookies = {};
  var ca = document.cookie.split(';');
  var re = /^[\s]*([^\s]+?)$/i;
  for (var i = 0, l = ca.length; i < l; i++) {
    var c = ca[i].split('=');
    if (c.length == 2) {
      window._cookies[c[0].match(re)[1]] = unescape(c[1].match(re) ? c[1].match(re)[1] : '');
    }
  }
}
function getCookie(name) {
  _initCookies();
  return window._cookies[name];
}
function setCookie(name, value, days, secure) {
  var expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    expires = '; expires='+date.toGMTString();
  }
  document.cookie = name + '='+escape(value) + expires + '; path=/' + (window.baseDomain ? '; domain=.' + window.baseDomain : '') + ((secure && window.isHttps) ? '; secure' : '');
}


//Array.prototype.clone = function() {
//  return this.slice(0);
//};

function clone(obj) {
  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    var copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    var copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    var copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}


function generateUUID(){
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x7|0x8)).toString(16);
  });
  return uuid;
};


function fileUploaded(data) { if (isset(data.type)) { FE.run('file_uploaded_'+data.type, data); } }
function fileUploadFail(data) { if (isset(data.type)) { FE.run('file_upload_fail_'+data.type, data); } }

function makeBtnDisabled(obj, mes)
{
  if ('undefined'===typeof $(obj).data('clicked'))
  {
    mes = mes||'Загружается...';
    $(obj).val(mes)
      .text(mes)
      .addClass('disabled')
      //.attr('disabled','disabled')
      .data('clicked',true);
    return true;
  }
  else return false;
}


function toggleDropdown(clicker)
{
  $('.dropdown_part:visible').hide();
  var wrapper = $(clicker).closest('.inp_wrap');
  var dd = wrapper.children('.dropdown_part');
  dd.css({width:wrapper.width()});
  dd.removeClass('dropped_down dropped_up');

  if (wrapper.offset().top + wrapper.outerHeight() + dd.outerHeight() < $(window).height())
  {
    dd.css({top: wrapper.outerHeight()-1});
    dd.addClass('dropped_down');
  }
  else
  {
    dd.css({top: -dd.outerHeight()});
    dd.addClass('dropped_up');
  }

  dd.show();

}

function initDropdown()
{
  window.curDropDown=null;
  $('html').click(function(){ $('.dropdown_part:visible').hide(); });
  $('.dropdown_part').click(function(e){  if ($(this).is(':visible')) {e.stopPropagation();} });
  $('.joined').click(function(e){ if ($(this).closest('.sel_wrap').find('.dropdown_part').is(':visible')) {e.stopPropagation();} });
}
FE.add('onready', "initDropdown()");


function setStateCookie(name, val)
{
  if ('function'!==typeof $.cookie) return;
  $.removeCookie(name);
  $.cookie(name, val, {expires:360, path:'/'});
}

if (window.jQuery)
{
  /**
   * Без параметров - возвращает outerHTML элемента
   * Если передан параметр (строка) то заменяет весь HTML элемента на эту строчку (аналог .replaceWith())
   * @param s
   * @returns {*}
   */
  jQuery.fn.outerHTML = function(s) {
    return s
      ? this.before(s).remove()
      : jQuery('<div></div>').append(this.eq(0).clone()).html();
  };
}

$('body').popover({trigger: 'hover', selector:'.has_popover', placement:'top', html:'true', delay:'100'});
$(document).on('click','.btn-smart',function(){ if (!$(this).data('button')){var mes=$(this).attr('data-loading'); $(this).button({'loadingText': mes ? mes : 'Загрузка...'})} $(this).button('loading'); });
//FE.add('onready',"$('body').popover({trigger:'hover', selector:'.has_popover', placement:'top'});");
//$(document).mouseover(function(e){
//
//  var el=$(e.target).filter('.has_popover');
////  if (el.length)console.log(e);
//  if (el.length && 'undefined'===el.attr('popover_inited'))
//  {
//    el.popover({trigger:'hover', selector:'.has_popover', placement:'top'});
//    el.attr('popover_inited',true);
//  }
//  el=null;
//});

function ColorLuminance(hex, lum) {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  }
  lum = lum || 0;
  // convert to decimal and change luminosity
  var rgb = "#", c, i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i*2,2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ("00"+c).substr(c.length);
  }
  return rgb;
}

function rgb2hex(rgb){
  if (!rgb)return null;
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  return rgb ? "#" +
    ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3],10).toString(16)).slice(-2)
    : null;
}

function hex2rgb(hexStr){
  // note: hexStr should be #rrggbb
  var hex = parseInt(hexStr.substring(1), 16);
  var r = (hex & 0xff0000) >> 16;
  var g = (hex & 0x00ff00) >> 8;
  var b = hex & 0x0000ff;
  return [r, g, b];
}

function escapeRus(str)
{ // �������������� ������� �������
  var trans = [];
  str += '';
  for(var i=0x410; i<=0x44F; i++)
  {
    trans[i] = i - 0x350; // �-��-�
  }
  trans[0x401] = 0xA8;    // �
  trans[0x451] = 0xB8;    // �

  var ret = [];
  // ���������� ������ ����� ��������, ������� ��������� ���������
  for (i=0; i<str.length; i++)
  {
    var n = str.charCodeAt(i);// 2B
    if ((typeof trans[n] != 'undefined'))
    {
      n = trans[n];
    }
    if (n <= 0xFF)
    {
      ret[i] = escape(String.fromCharCode(n));
    }
    if (n==8470)
    {
      ret[i] = '%B9';
    }
    if (n==43)
    {
      ret[i] = '%2B';
    }
  }
  return ret.join('');
}



function jAlert(mes, ops)
{
  ops= $.extend({html:true}, ops);
  var w=$('#jAlert');
  if (w.length)
  {
    if (true===ops.html) w.find('#jAlertBody').html(mes);
    else w.find('#jAlertBody').text(mes);
    w.wind('show');
  }
  w=null;
}

function jConfirm(mes, ops)
{
  ops= $.extend({width:500, html:true, okText:'OK', cancelText:'Отмена', btnWidth:84, okClass:'ibtn-green', onOk:function(){}, onCancel:function(){}}, ops);
  var w=$('#jConfirm');
  if (w.length)
  {
    if (true===ops.html) w.find('#jConfirmBody').html(mes);
    else w.find('#jConfirmBody').text(mes);
    //unbind - для тех случаев, когда Confirm вызывается несколько раз с разными функциями
    w.find('#jConfirmOk').attr('class','ibtn wind-btn-apply '+ops.okClass).text(ops.okText).width(ops.btnWidth).unbind('click').click(function(){ops.onOk(); $('#jConfirm').wind('hide');});
    w.find('#jConfirmCancel').text(ops.cancelText).width(ops.btnWidth).unbind('click').click(function(){ops.onCancel(); $('#jConfirm').wind('hide');});
    w.css({width:ops.width});
    w.wind('show');
  }
  w=null;
}

function showDoneBox(msg, opts)
{
  var el=$('<div class="pp_mes_wrap"><div class="pp_mes">'+msg+'</div></div>');
  opts = $.extend({width:380,top:'40%',fadeIn:100, showTime:2000, fadeOut:500, class:'', el:el}, opts);
  el.css({width: opts.width, 'margin-left': -1*Math.round(opts.width/2), top: opts.top, opacity:0});
  if (opts.class.length){el.addClass(opts.class);}
  el.appendTo($('body'));
  el.animate({opacity:1}, opts.fadeIn, function(){
    setTimeout(function(){
      opts.el.animate({opacity:0}, opts.fadeOut, function(){ $(this).remove(); });
    }, opts.showTime);
  });
  el=null;
}

function plural(n, wordOne, wordTwo, wordMany)
{
  if (n<0){n=-1*n;}
  if ('undefined'===typeof wordMany)
  {
    return (1==n) ? wordOne : wordTwo;
  }
  else
  {
    var n_mod10 = n%10, n_mod100 = n%100;
    if (n==1 || (n_mod10==1 && n_mod100!=11)) {n_mod10=n_mod100=null; return wordOne;}
    else if (n_mod10 > 1 && n_mod10 < 5 && (n_mod100!=12 && n_mod100!=13 && n_mod100!=14)) {n_mod10=n_mod100=null; return wordTwo;}
    else {n_mod10=n_mod100=null; return wordMany;}
  }
}

function strtr (str, from) {
  for (var k in from) { str = str.replace(new RegExp(k,'g'), from[k]); }
  k=null;
  return str;
}

function number_format (number, decimals, dec_point, thousands_sep) {
  // http://kevin.vanzonneveld.net
  // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +     bugfix by: Michael White (http://getsprink.com)
  // +     bugfix by: Benjamin Lupton
  // +     bugfix by: Allan Jensen (http://www.winternet.no)
  // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // +     bugfix by: Howard Yeend
  // +    revised by: Luke Smith (http://lucassmith.name)
  // +     bugfix by: Diogo Resende
  // +     bugfix by: Rival
  // +      input by: Kheang Hok Chin (http://www.distantia.ca/)
  // +   improved by: davook
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +      input by: Jay Klehr
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +      input by: Amir Habibi (http://www.residence-mixte.com/)
  // +     bugfix by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Theriault
  // +      input by: Amirouche
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // *     example 1: number_format(1234.56);
  // *     returns 1: '1,235'
  // *     example 2: number_format(1234.56, 2, ',', ' ');
  // *     returns 2: '1 234,56'
  // *     example 3: number_format(1234.5678, 2, '.', '');
  // *     returns 3: '1234.57'
  // *     example 4: number_format(67, 2, ',', '.');
  // *     returns 4: '67,00'
  // *     example 5: number_format(1000);
  // *     returns 5: '1,000'
  // *     example 6: number_format(67.311, 2);
  // *     returns 6: '67.31'
  // *     example 7: number_format(1000.55, 1);
  // *     returns 7: '1,000.6'
  // *     example 8: number_format(67000, 5, ',', '.');
  // *     returns 8: '67.000,00000'
  // *     example 9: number_format(0.9, 0);
  // *     returns 9: '1'
  // *    example 10: number_format('1.20', 2);
  // *    returns 10: '1.20'
  // *    example 11: number_format('1.20', 4);
  // *    returns 11: '1.2000'
  // *    example 12: number_format('1.2000', 3);
  // *    returns 12: '1.200'
  // *    example 13: number_format('1 000,50', 2, '.', ' ');
  // *    returns 13: '100 050.00'
  // Strip all characters but numerical ones.
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ' ' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

function reachGoal(goalId)
{
  if ('undefined'===typeof window.Ya) return;
  var counters=Ya.Metrika.counters();
  for (var k in counters){ window['yaCounter'+counters[k].id].reachGoal(goalId); consoleDbg('reachGoal '+goalId); }
  counters=k=null;
}
function reachGoalByAttr(obj, attrName)
{
  var goalId=obj.attr(attrName);
  if ('undefined'!==typeof goalId && goalId.length){reachGoal(goalId);}
  goalId=null;
}

function popoverForm(btn)
{
  try {
    var blk = $(btn).closest('.blk');
    var wrap = $(btn).closest('.blk_form_wrap');
    var wnd = $('#formPopover');
    var wnd_body = wnd.children('.wind-body');
    wnd_body.children('form').hide();

    if (wrap.hasClass('is_popover'))
    {
      var frm = wrap.children('form.user_form');
      if (frm.length)
      {
        frm.appendTo(wnd).addClass('is_popover');
      }
      else
      {
        frm = wnd.children('form[id=frm'+blk.attr('id')+']');
      }

      if (frm.length)
      {
        reachGoalByAttr(frm, 'goal-popover');
        wnd.children().hide();
        frm.show();
        wnd.wind('show');
      }
    }

    blk=wrap=wnd=wnd_body=null;
  }
  catch(e)
  {
    consoleDbg(e);
  }
  return false;
}

function btnPopupWnd(btn)
{
  var blk = $(btn).closest('.blk'),
      id  = blk.attr('id'),
      wnd = $('#btnPopupWnd'),
      curWndBlk = wnd.attr('cur-blk'),
      data = blk.find('.wnd_data:first');

  if ('undefined'===typeof curWndBlk || curWndBlk!=id)
  {
    wnd.width(parseInt(data.attr('wnd_width'))||600);
    wnd.find('.wind-header h3').text(data.find('.wnd_data_title').text());
    wnd.find('.wind-body').html(data.find('.wnd_data_text').html());
    wnd.attr('cur-blk', id);
    consoleDbg('btnPopupWnd: move content');
  }

  wnd.wind('show');
  wnd=null;
}

function showExpiredWind(callback)
{
  $('#sessionExpired').wind('show').find('#frmlogin__password').focus();
  if ('function'===typeof callback) {callback();}
}

function truncate(s, n) {
  if (typeof s == 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

//заменяем элемент bb на новый элемент newBb
//var a=['aa','bb','cc']; a.indexOf('bb'); a.splice(a.indexOf('bb'),1,'newBb'); a

//удаляем элемент bb
//var a=['aa','bb','cc']; a.indexOf('bb'); a.splice(a.indexOf('bb'),1); a
function arrayRemoveByName(ar, name)
{
  var i=ar.indexOf(name),res=false;
  if(-1!=i){ar=ar.splice(i,1); res=true;}
  i=null;return res;
}
function arrayInsertBeforeItem(ar, item, newItem)
{
  var i=ar.indexOf(item),res=false;
  if (-1!=i){ar.splice(i,0,newItem);res=true;}
  i=null;return res;
}
function arrayInsertAfterItem(ar, item, newItem)
{
  var i=ar.indexOf(item),res=false;
  if (-1!=i)
  {
    if (i==ar.length-1) ar.push(newItem);
    else ar.splice(i+1,0,newItem);
    res=true;
  }
  i=null;return res;
}
function arrayInsertItemUniq(ar, item)
{
  if (-1==ar.indexOf(item)) ar.push(item);
}
function arrayMoveItemBefore(ar,item, nextItem)
{
  if (arrayRemoveByName(ar,item)){if (arrayInsertBeforeItem(ar, nextItem, item)) return true;}
  return false;
}
function arrayMoveItemAfter(ar,item, prevItem)
{
  if (arrayRemoveByName(ar,item)){if (arrayInsertAfterItem(ar, prevItem, item)) return true;}
  return false;
}
function arraySubset(ar,item1,item2)
{
  var i1=ar.indexOf(item1),i2=ar.indexOf(item2),res=[];
  if (-1!=i1&&-1!=i2){
    if (i1>i2){i1=i1+i2;i2=i1-i2;i1=i1-i2;}
    res=ar.slice(i1,i2+1);
  }
  i1=i2=null;
  return res;
}

function guid(){return uuid.v4().replace(/-/g,'');}

function ajaxLoad(ops)
{
  return $.ajax({
    type: 'POST',
    ops: ops,
    cache: false,
    timeout: 40000,
    url: window.baseUrl+ops.url,
    dataType: 'json',
    data: ops.data ? ops.data : null,
    success: function(data){
      if (isset(data.error))
      {
        alert(data.error)
      }

      if (data.html && this.ops.block)
      {
        $(this.ops.block).html(data.html);
      }

      if (isset(data.script))
      {
        try
        {
          eval(data.script);
        }
        catch (ex) { if (window.console && window.dbgMode){console.log(ex); console.log('[_Ошибка JS_] '+ex.stack); alert('Смотри ошибку в консоли');} }
      }

      if (this.ops.onSuccess && 'function'==typeof this.ops.onSuccess){this.ops.onSuccess(data, this.ops);}
      if (window.dbgMode) console.log(data);
    },
    error: function(jqXHR, textStatus, errorThrown){
      console.log(textStatus);
      switch (textStatus)
      {
        case 'timeout':
          alert('Ошибка! Нет связи с сервером. Проверьте подключение к интернету и попробуйте снова.');
          break;

        case 'error':
        case 'parsererror':
          alert('Извините, на сервере возникла ошибка!'+"\n\n"+'Мы скоро ее исправим.'+"\n"+'Попробуйте снова через некоторое время.');
          if (window.dbgMode) {
            console.log(jqXHR);
            console.log(errorThrown);
          }
          break;
      }
    }
  });
}

function scrollTop()
{
  return document.body.scrollTop || document.documentElement.scrollTop;
}

function cancelEvent(e) {
  e = (e || window.e);
  if (!e) return false;
  while (e.originalEvent) {
    e = e.originalEvent;
  }
  if (e.preventDefault) e.preventDefault();
  if (e.stopPropagation) e.stopPropagation();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
}

/**
 *
 * @param obj - объект, содержащий заголовки вкладок (<a>)
 * @param ops
 *  itemTag       - тэг объектов, где заголовки вкладок, должны лежать прямо в obj
 *  tabsClass     - класс самих вкладок
 *  activeClass   - класс текущей вкладки
 *  tabsContainer - контейнер, где лежат вкладки (содержимое)
 */
function initTabs(obj, ops)
{
  ops = extend({itemTag:'a', tabsClass:'itab', activeClass:'active', tabsContainer:null},ops);
  if ('string'===typeof obj){obj=$(obj);}
  if (!obj.length) return;
  if (obj.hasClass('itabs-inited')) return;

  var items=obj.children(ops.itemTag);
  if (items.length)
  {
    items.click({ops: ops},function(e){
      var el  = $(this),
          sel = '.'+ops.tabsClass+'[id='+el.attr('itab-id')+']',
          tab = null;

      if (null===ops.tabsContainer) tab=$(sel);
      else {
        if ('string'===typeof ops.tabsContainer) ops.tabsContainer=$(ops.tabsContainer);
        if (ops.tabsContainer.length) tab=ops.tabsContainer.children(sel);
      }

      if (tab.length){
        tab.parent().children('.'+ops.tabsClass+'.'+ops.activeClass).removeClass(ops.activeClass);
        tab.addClass(ops.activeClass);
        el.parent().children(ops.itemTag+'.'+ops.activeClass).removeClass(ops.activeClass);
        el.addClass(ops.activeClass);
      }
      e.preventDefault();
      e.stopPropagation();
      el=tab=sel=null;
    });
    obj.addClass('itabs-inited');
  }
  items=null;
}

function helpSlider(obj, ops)
{
  var root=('string'===typeof obj)?$(obj):obj;
  if (root.length)
  {
    root.addClass('help-slider-inited');
    root.find('.prev_slide, .next_slide').click(function(){ helpSliderRoll($(this).closest('.help-slider-inited'), $(this).hasClass('next_slide') ? 'next' : 'prev'); });

    var sc=root.find('.slides_container');
    sc.css({overflow:'hidden', position:'relative'});
    sc.children().css({cursor:'pointer'}).click(function(){ helpSliderRoll($(this).closest('.help-slider-inited'), 'next'); });
    //sc.children().css({position:'absolute', top:0, display:'block'});
  }
  root=null;
}
function helpSliderRoll(obj, direction)
{
  var sc=obj.find('.slides_container'),
    c=sc.children(),
    cur=c.filter(':visible'),
    n=null, w=null, h=cur.height();

  if (!cur.is(':animated'))
  {
    sc.css({height:h});
    cur.css({position:'absolute',top:0,left:0});
    if ('prev'===direction)
    {
      n=cur.prev();
      if (!n.length) return //n = c.filter(':last');
      w=n.width();
      n.css({position:'absolute', opacity:1, left:-w}).show();
      cur.animate({left:w,opacity:0.5},400,function(){$(this).hide()});
      n.animate({left:0},400,function(){$(this).css({position:'static'})});
    }
    else if ('next'===direction)
    {
      n=cur.next();
      if (!n.length) return //n = c.filter(':first');
      w=n.width();
      n.css({position:'absolute', opacity:1, left:w}).show();
      cur.animate({left:-w,opacity:0.5},400,function(){$(this).hide()});
      n.animate({left:0},400,function(){$(this).css({position:'static'})});
    }
  }
  sc=c=cur=n=w=h=null;
}

function initImgSlider(ops)
{
  ops=extend({
    obj:null,
    editorMode:true,
    showBalls:false,
    delayBeforeChange:2000,
    changeOnClick:false,
    changeSpeed:1000,
    changeType:'slide',
    pauseOnHover:true
  },ops);
  if (null===ops.obj) return 0;
  if ('string'===typeof ops.obj){ops.obj=$(ops.obj); if(!ops.obj.length) return 1;}

  ops._animating = false;
  ops.$slider = ops.obj.find('.slider_images:first');
  ops.$ar_L   = ops.$slider.find('.arrow_left:first');
  ops.$ar_R   = ops.$slider.find('.arrow_right:first');
  ops.$balls  = ops.$slider.find('.balls:first');
  ops.$imgs   = ops.$slider.find('.imgs:first');
  ops.$resizer= ops.$slider.find('.imgslider_resizer:first');

  //ops.$slider.data('img_slider',ops);
  if (!window.imgSlider){ window.imgSlider={cnt:1, collection:{}}; }
  else {++window.imgSlider.cnt;}
  window.imgSlider.collection[window.imgSlider.cnt]=ops;
  ops._cnt=window.imgSlider.cnt;
  ops.$slider.attr('slider',window.imgSlider.cnt);

  if (ops.showBalls) ops.$balls.show();
  //if (ops.delayBeforeChange > 0) { ops._timer=; }

  ops.$ar_L.click(function(){ imgSliderChange(parseInt($(this).closest('.slider_images').attr('slider')),'prev'); });
  ops.$ar_R.click(function(){ imgSliderChange(parseInt($(this).closest('.slider_images').attr('slider')),'next'); });
  if (ops.pauseOnHover){ops.$slider.find('.arrow,.imgs:first').mouseover(function(){ imgSliderKillTimer($(this).closest('.slider_images').addClass('over_slide').attr('slider')); }).mouseout(function(){ imgSliderSetTimer($(this).closest('.slider_images').removeClass('over_slide').attr('slider')); });}

  if (ops.editorMode)
  {
    ops.delayBeforeChange=0;
    ops.$resizer.show();
//    ops.$resizer.mousedown(function(){
//      console.log('mousedown');
//      $(document).mousemove({resizer:$(this)}, function(e){
//        console.log('move');
//      });
//      $(document).mouseup({resizer:$(this)}, function(e){
//        $(document).unbind('mousemove');
//        $(document).unbind('mouseup');
//        console.log('mouseup', e.data.resizer);
//      });
//    });
    $(document).mousedown(function(e){ if ($(e.target).hasClass('imgslider_resizer')){ window.imgSliderResize=true;window.imgSliderResizeTop=e.pageY;window.imgSliderResizeH=$() } });
    $(document).mousemove(function(e){ if (window.imgSliderResize){ console.log('move ',e.pageY-window.imgSliderResizeTop); } });
    $(document).mouseup(function(e){ if (window.imgSliderResize){ window.imgSliderResize=false; console.log('stop ',e.pageY-window.imgSliderResizeTop); window.imgSliderResizeTop=null; } });
  }
  else
    imgSliderSetTimer(ops);

  return 'ok';
}
function imgSliderSetTimer(ops){
  if ('string'===typeof ops){ops=parseInt(ops); if(!window.imgSlider.collection[ops]) return; ops=window.imgSlider.collection[ops];}
  if (!ops.delayBeforeChange){return;}
  if(ops._timer){clearTimeout(ops._timer);}
  ops._timer=setTimeout("imgSliderChange("+ops._cnt+",'next');", ops.delayBeforeChange);
}
function imgSliderKillTimer(ops){
  if ('string'===typeof ops){ops=parseInt(ops); if(!window.imgSlider.collection[ops]) return; ops=window.imgSlider.collection[ops];}
  if(ops._timer){clearTimeout(ops._timer);}
  ops._timer='off';
}
function imgSliderChange(id, direction)
{
  console.log('run slider animation. id=',id,', direction=',direction);
  var ops=window.imgSlider.collection[id];
  if (!ops._animating)
  {
    switch (ops.changeType)
    {
      case 'slide':
        ops._animating=true;
        var curSlide = ops.$imgs.children('a:visible'), newSlide=null, w=ops.$imgs.width();

        if ('next'==direction)
        {
          newSlide = curSlide.next();
          if (!newSlide.length){newSlide=ops.$imgs.children('a:first');}
          newSlide.css({left: w}).show();
          curSlide.animate({left: -w}, ops.changeSpeed, function(){ $(this).hide(); window.imgSlider.collection[id]._animating=false; });
          newSlide.animate({left: 0}, ops.changeSpeed);
        }
        else if ('prev'==direction)
        {
          newSlide = curSlide.prev();
          if (!newSlide.length){newSlide=ops.$imgs.children('a:last');}
          newSlide.css({left: -w}).show();
          curSlide.animate({left: w}, ops.changeSpeed, function(){ $(this).hide(); window.imgSlider.collection[id]._animating=false; });
          newSlide.animate({left: 0}, ops.changeSpeed);
        }
        curSlide=newSlide=w=null;
        break;
    }
    if (!ops.$slider.hasClass('over_slide')){imgSliderSetTimer(ops);}
  }
  ops=null;
}