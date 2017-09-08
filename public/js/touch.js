!function(){
	var support = support_css();
	var transform = support==''?support+'Transform':'transform';
	var transition= support==''?support+'Transition':'transition';
	function support_css(){
		var div = document.createElement('div');
		var vendors =['Ms','O','Moz','Webkit','']; 
		for(var i=0,prop;i<vendors.length;i++){
			prop = vendors[i]?'Transform':'transform';
			if(vendors[i]+prop in div.style){
				return vendors[i]
			}
		}
	}
	function Touch(option){
		return new Touch.prototype.init(option);
	}
	Touch.prototype={
		constructor:Touch,
		init:function(option){
			this.el = typeof option.el=='string'?document.querySelector(option.el):option.el;
			this.target = option.target;
			this.callback =option.callback;
			this.direction =option.direction || 'width';
			this.loop = option.loop||false;
			this.time = option.time || '300ms';
			this.status = option.loop?-1:0;
			if(!this.el&&(this.el.nodeType!=1||this.el.nodeType!=9)){
				throw Error(el+'is not element or document');
			}
			if(option.loop){
				var num = this.target.querySelectorAll('div').length;
				var first = this.target.querySelectorAll('div')[0];
				var firstClone = first.cloneNode(true);
				var last = this.target.querySelectorAll('div')[num-1];
				var lastClone = last.cloneNode(true);
				this.target.appendChild(firstClone);
				this.target.insertBefore(lastClone,first);
				var wid = parseFloat(getStyle(this.el,this.direction));
			}
			if(this.direction=='height'){
				this.target.style[transform]='translate3d(0,'+wid*this.status+'px,0)';
			}else{
				this.target.style.width=(num+2)*100+'%';
				for(var i=0;i<num+2;i++){
					this.target.querySelectorAll('div')[i].style.width=100/(num+2)+'%';
				}
				this.target.style[transform]='translate3d('+wid*this.status+'px,0,0)';
			}
			this.dri();
			
		},
		dri:function(){
			var _this = this;
			var startx,starty,startt1,endx,endy,endt1,num;
			var wid = parseFloat(getStyle(_this.el,_this.direction));
			on(_this.el,'touchstart',function(e){
				event(e);
				num = _this.target.querySelectorAll('div').length;
				_this.target.style[transition]='none';
			})
			on(_this.el,'touchmove',function(e){
				event(e);
				if(_this.loop){
					if(_this.status==1-num){
						_this.status=-1
					}
					if(_this.status==0){
						_this.status=2-num
					}
				}
				var s = _this.direction=='height'?endy-starty:endx-startx;
				var t = endt1-startt1;
				_this.callback&&_this.callback(s+wid*_this.status,Math.abs(_this.status)-1);
			})
			on(_this.el,'touchend',function(e){
				event(e);
				_this.target.style[transition]='all '+_this.time+' ease';
				var s = _this.direction=='height'?endy-starty:endx-startx;
				var t = endt1-startt1;
				var dir = s>0?1:-1;
				if(Math.abs(s)<1){return}
				if(t<200||Math.abs(s)>wid/7){
					if(_this.loop){
						if(dir<0&&_this.status>=1-num){
							_this.status=_this.status+dir;
						}
						if(dir>0&&_this.status<=0){
							_this.status=_this.status+dir;
						}
					}else{
						if(dir>0&&_this.status>=0){
							_this.status=0;
						}
						else if(dir<0&&_this.status<=1-num){
							_this.status=1-num;
						}
						else{
							_this.status=_this.status+dir;
						}
					}
					
				}
				_this.callback&&_this.callback(wid*_this.status,Math.abs(_this.status)-1);
			})
			function event(e){
				e.stopPropagation();
				e.preventDefault();
				if(e.type==='touchstart'){
					startx=e.changedTouches[0].clientX;
					starty=e.changedTouches[0].clientY;
					startt1=new Date().getTime();
				}else{
					endx=e.changedTouches[0].clientX;
					endy=e.changedTouches[0].clientY;
					endt1=new Date().getTime();
				}
			}
		}
	}
	function on (el,type,callback){
		el.addEventListener(type,callback)
	}
	function getStyle(el,style){
		 return window.getComputedStyle(el, null).getPropertyValue(style);
	}
	Touch.prototype.init.prototype = Touch.prototype;
	window['Touch'] = Touch;
}()
