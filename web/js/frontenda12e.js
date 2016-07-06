function FE_F() {
  this.h = {};
  this.h['onload'] = [];
  this.h['onready'] = [];
  this.h['onresize'] = [];
}

FE_F.prototype.add = function(e, code)
{
  if ('function'===typeof e.pop)
  {
    for(var i in e) {this.add(e[i],code);}
    i=null;
  }
  else
  {
    if('undefined'===typeof this.h[e]) {this.h[e]=[];}
    this.h[e].push(code);
  }
};

FE_F.prototype.run = function(eventName, event, target)
{
  var f=null;
  for(var i in this.h[eventName]||[])
  {
    f=this.h[eventName][i];
    try
    {
      if ('function'===typeof(f)){f(event,target);}
      else {eval(f);}
    }
    catch(ex)
    {
      if (window.console){console.log(ex); console.log('[_Ошибка JS_] '+ex.stack);}
    }
  }
  f=i=null;
};

FE_F.prototype.runAndClr = function(eventName, event, target)
{
  this.run(eventName, event, target);
  this.clr(eventName);
};

FE_F.prototype.clr = function(eventName)
{
  this.h[eventName]=[];
};

window.FE = new FE_F();
$(document).ready(function(e){FE.run('onready', e, this);});
$(window).load(function(e){FE.run('onload', e, this);});
$(window).resize(function(e){if(window.feRs){clearTimeout(window.feRs);}window.feRs=setTimeout("FE.run('onresize')", 20);});