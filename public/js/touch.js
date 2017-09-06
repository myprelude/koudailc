!function(){
	
	function Touch(option){
		return new Touch.prototype.init(option);
	}
	Touch.prototype={
		constructor:Touch,
		init:function(option){
			this.el = option.el;
			this.target = option.target;
			this.callback =option.callback;
			this.direction =option.direction || 'width';
			this.time = option.time || '300ms'
			if(!this.el&&(this.el.nodeType!=1||this.el.nodeType!=9)){
				throw Error(el+'is not element or document');
			}
			this.dri();
			
		},
		dri:function(){
			var _this = this;
			var startx,starty,startt1,endx,endy,endt1,status=0,num;
			var wid = parseFloat(getStyle(_this.el,_this.direction));
			on(_this.el,'touchstart',function(e){
				e.stopPropagation();
				e.preventDefault();
				num = _this.target.querySelectorAll('div').length;
				startx=e.changedTouches[0].clientX;
				starty=e.changedTouches[0].clientY;
				_this.target.style.transition='none';
				_this.target.style.transform=_this.direction=='height'?'translate3d(0,'+wid*status+'px,0)':'translate3d('+wid*status+'px,0,0)';
				startt1=new Date().getTime();
			})
			on(_this.el,'touchmove',function(e){
				e.stopPropagation();
				e.preventDefault();
				endx=e.changedTouches[0].clientX;
				endy=e.changedTouches[0].clientY;
				endt1=new Date().getTime();
				var s = _this.direction=='height'?endy-starty:endx-startx;
				var t = endt1-startt1;
				_this.callback&&_this.callback(s+wid*status,t,status);
			})
			on(_this.el,'touchend',function(e){
				e.stopPropagation();
				e.preventDefault();
				_this.target.style.transition='all '+_this.time+' ease';
				endx=e.changedTouches[0].clientX;
				endy=e.changedTouches[0].clientY;
				endt1=new Date().getTime();
				var s = _this.direction=='height'?endy-starty:endx-startx;
				var t = endt1-startt1;
				var dir = s>0?1:-1;
				if(Math.abs(s)<1){return}
				if(t<200||Math.abs(s)>wid/7){
					status=status+dir;
					if(dir<0&&status*dir>=num){
						status = (num-1)*dir;
					}
					if(dir>0&&status*dir>=0){
						status = 0;
					}
				}
				_this.callback&&_this.callback(wid*status,t,status);
			})
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
