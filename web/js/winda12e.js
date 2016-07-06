function F_wind(obj, ops)
{
  this.ops = ops;
  this.$el = $(obj);
  this.params = {};

  this.isShown = false;
  this.$btnClose  = this.$el.find('a.wind-close');
  this.$btnApply  = this.$el.find('.wind-btn-apply:first');
  this.$btnCancel = this.$el.find('.wind-btn-cancel:first');

  this.$el.on('click', 'a.wind-close', this, function(e){ e.preventDefault(); e.data.clickBtnCancel(); });
  //this.$btnClose.click(this, function(e){ e.preventDefault(); e.data.clickBtnCancel(); });
  this.$btnApply.click(this, function(e){ e.preventDefault(); e.data.clickBtnApply(); });
  this.$btnCancel.click(this, function(e){ e.preventDefault(); e.data.clickBtnCancel(); });
//  this.$container = ops.container;
  this.applyFunc = function(){return true;}
}

//F_wind.prototype.ready = function(){
//  this.$container.on('click','.btn-wind-apply', function(e){e.preventDefault(); wind.clickBtnApply();});
//  this.$container.on('click','.btn-wind-cancel', function(e){e.preventDefault(); wind.clickBtnCancel();});
//
//  consoleDbg('init: wind');
//};

F_wind.prototype.toggle = function(){
  return this[!this.isShown ? 'show' : 'hide']();
};

F_wind.prototype.show = function(){
  if (!this.ops.showFunc(this)) return;
  this.ops.container.children('.wind:not(.hidden)').addClass('hidden');
  this.ops.container.show();
  this.$el.removeClass('hidden');//.css({'margin-top':0, opacity:0}).animate({'margin-top':40, opacity:1},300);
  //this.$el.css({'margin-top': 20, opacity:0}).animate({'margin-top':40,opacity:1},600);
  this.isShown=true;
  this.$el.trigger('show');
  var w=$('body').width(), mar=null;
  $('html').addClass('wind_opened');
  mar=$('body').width()-w;
  $('body').css('margin-right', mar);
  $('body>.navbar>.navbar-inner').css('padding-right', mar);
  w=mar=null;
};

F_wind.prototype.hide = function(){
  //var that=this;this.$el.animate({'margin-top':0, opacity:0},300,function(){that.ops.container.hide();});
  this.ops.container.hide();
  this.isShown=false;
  this.$el.trigger('hide');
  $('body').css('margin-right',0);
  $('body>.navbar>.navbar-inner').css('padding-right',0);
  $('html').removeClass('wind_opened');
  this.ops.afterCloseFunc(this);
};

F_wind.prototype.setApplyFunc = function(f)
{
  if ('function'===typeof f)
  {
    this.ops.applyFunc = f;
  }
};

F_wind.prototype.setCancelFunc = function(f)
{
  if ('function'===typeof f)
  {
    this.ops.cancelFunc = f;
  }
};

F_wind.prototype.setAfterCloseFunc = function(f)
{
  if ('function'===typeof f)
  {
    this.ops.afterCloseFunc = f;
  }
};

F_wind.prototype.setShowFunc = function(f)
{
  if ('function'===typeof f)
  {
    this.ops.showFunc = f;
  }
};

F_wind.prototype.setParams = function(params)
{
  this.params = params;
};

F_wind.prototype.clickBtnApply = function(){
//  console.log(this.$el.trigger('apply'));
//  this.hide();
  if (false!== this.ops.applyFunc(this))
  {
    this.hide();
  }
};

F_wind.prototype.clickBtnCancel = function(){
//  this.$el.trigger('cancel');
  if (false!== this.ops.cancelFunc(this))
  {
    this.hide();
  }
};

//F_wind.prototype.clickBtnApply = function(){
//  consoleDbg('clickBtnApply');
//};
//
//F_wind.prototype.clickBtnCancel = function(){
//  consoleDbg('clickBtnCancel');
//};

//window.wind = new F_wind();
//$(document).ready(function(){window.wind.ready();});



jQuery.fn.wind = function(option)
{
  var el=$(this);
  var ops = $.extend({}, $.fn.wind.defaults, 'object'==typeof option && option);

  var wnd = el.data('wind');
  if (!wnd) {el.data('wind', (wnd = new F_wind(this, ops)) );}

  if (typeof option == 'string') { arguments[1] ? wnd[option](arguments[1]) : wnd[option]();}
  else if (ops.show) wnd.show();
  el=wnd=ops=null;
  return this;
};

jQuery.fn.wind.defaults = {
  show: false,
  container: $('body > #wind_container'),
  applyFunc:  function(){return true;},
  cancelFunc: function(){return true;},
  showFunc:   function(){return true},
  afterCloseFunc:function(){}
};

function showWind(id, option)
{
  var ops = $.extend({},{
    width: 500,
    title: 'Заголовок',
    cont:  ''
  },'object'==typeof option && option);

  var h=
    '<div class="wind hidden bp0" id="'+id+'" tabindex="-1" style="width:'+ops.w+'px;">'
      +'<div class="wind-header">' +
        '<a class="wind-close"><i class="icon-remove"></i></a>' +
        '<h3 class="fnt">'+ops.title+'</h3>' +
      '</div>' +
    '<div class="wind-body">'+ops.cont+'</div>' +
    '<div class="wind-footer">' +
      '<button class="btn wind-btn-apply btn-primary">OK</button>' +
      '<button class="btn wind-btn-cancel btn-link">Отмена</button>' +
    '</div>';
}