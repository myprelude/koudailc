(function(root,document,Math){
	'use strict';
	var support = support_css();
	var transform = support?support+'Transform':'transform';
	var transition= support?support+'Transition':'transition';
	function on(el,type,callback){
		el.addEventListener(type,callback)
	}
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
	function isArr(arr){
		return Object.prototype.toString.call(arr)==='[object Array]';
	}
	/**
	 * [TouchScroll description]
	 * @param {[type]}   el       [事件触发元素]
	 * @param {[type]}   height   [滚动一步的距离]
	 * @param {[type]}   line     [滚动容器的高度]
	 * @param {[type]}   start    [开始的位置]
	 * @param {Function} callback [description]
	 */
	function TouchScroll(el,height,line,start,index,callback){
		var y=0,//初始位置
			y1=0,// 结束位置
			t=0,//开始时间
			t1=0,//结束时间
			step= start,// 移动位置的计数器(判断初始位置)
			node=0,//选中的dom 节点
			ratio1=2,//拖拽时灵敏系数
			ratio2=10,//快速滚动时摩擦系数
			max = Math.floor(line/2),//滚动范围最大值
			min = 0,//滚动范围最小值
			count = 0;
		on(el,'touchstart',function(e){
			count = el.childNodes[0].childNodes.length;
			min = Math.ceil(line/2)-count;
			e.stopPropagation();
	            	e.preventDefault();
	            	y = e.changedTouches[0].pageY;
	            	t = new Date().getTime();
		})
		on(el,'touchmove',function(e){
			e.stopPropagation();
           		e.preventDefault();
			t1 = new Date().getTime();
			if(t1-t<=300){
				return;
			}
			y1 = e.changedTouches[0].pageY;
			el.childNodes[0].style[transform]='translate(0,'+(step*height+(y1-y)*ratio1)+'px)';				
		})
		on(el,'touchend',function(e){
			e.stopPropagation();
            		e.preventDefault();
            		var list = el.childNodes[0];
            		var listdom = el.childNodes[0].childNodes;
        		for(var i=0;i<listdom.length;i++){
            			listdom[i].className =listdom[i].className.replace('active','');
           		 }
            		y1 = e.changedTouches[0].pageY;
            		t1 = new Date().getTime();
            		if(t1-t<110){
		            	var st = y1-y>0?1:-1;
		            	var kun = (Math.floor(Math.abs(y1-y)/ratio2)+1)*st+step;// 快速滚动时 滚动格子
		            	step = getNum(st,max,min,kun);
		            	list.style[transform]='translate(0,'+(step*height)+'px)';
		            	node = max-step;
		            	listdom[node].className = 'active';
		            	callback&&callback(node,el,index);
		            	return;
	            }
	            if(t1-t>=300){
	            		var st = y1-y>0?1:-1;
	            		if(  (st==1&&step==max)
	            			|| (st==-1&&step==min)
	            			|| Math.abs(y1-y)<(height/2)  ){
        				list.style[transform]='translate(0,'+step*height+'px)';
        			}else{
        				var stepAdd = Math.floor(Math.abs(y1-y)/height)*st+step;
        				step = getNum(st,max,min,stepAdd);
        				list.style[transform]='translate(0,'+step*height+'px)';
				}
				node =max-step;
				listdom[node].className = 'active';
				callback&&callback(node,el,index);
				return;
	            }
	            	var st = y1-y>0?1:-1;
	            	if(st==1&&step>=max){listdom[0].className='active';return}
	            	if(st==-1&&step<=min){listdom[count-1].className = 'active';return;}
	            	list.style[transform]='translate(0,'+(step+1*st)*height+'px)';
			step = step+1*st;
			node = max-step;
			listdom[node].className = 'active';
			callback&&callback(node,el,index);
		})

	}
	/**
	 * [getdom 获取关联数组对象]
	 * @param  {[type]} status1 [状态值]
	 * @param  {[type]} status2 [状态值]
	 * @param  {[type]} i       [下标]
	 * @param  {[type]} data    [数据]
	 * @return {[type]}         [description]
	 */
	function getdom(status1,status2,i,data){
		var text='';
		if(status1&&status2){
			if(i==0){
				for(var j=0;j<data[i].length;j++){
					text+='<li>'+data[i][j]+'</li>';
				}
				
			}
			if(i==1){
				var t = Math.floor(data[i-1].length/2);
				for(var j=0;j<data[i][t].length;j++){
					text+='<li>'+data[i][t][j]+'</li>';
				}
				
			}
			if(i==2){
				var t = Math.floor(data[i-2].length/2);
				var k = Math.floor(data[i-1][t].length/2);
				for(var j=0;j<data[i][t][k].length;j++){
					text+='<li>'+data[i][t][k][j]+'</li>';
				}
			}
		}else if(status1&&!status2){
			if(i==0||i==2){
				for(var j=0;j<data[i].length;j++){
					text+='<li>'+data[i][j]+'</li>';
				}
			}
			if(i==1){
				var t = Math.floor(data[i-1].length/2);
				for(var j=0;j<data[i][t].length;j++){
					text+='<li>'+data[i][t][j]+'</li>';
				}
			}
		}else if(!status1&&status2){
			if(i==0||i==1){
				for(var j=0;j<data[i].length;j++){
					text+='<li>'+data[i][j]+'</li>';
				}
			}
			if(i==2){
				var t = Math.floor(data[i-2].length/2);
				for(var j=0;j<data[i][t].length;j++){
					text+='<li>'+data[i][t][j]+'</li>';
				}
			}	
		}else{
			for(var j=0;j<data[i].length;j++){
				text+='<li>'+data[i][j]+'</li>';
			}
		}
		return text;
	}
	/**
	 * [getNum 求取step临界值状态]
	 * @return {[type]}     [step]
	 */
	function getNum(st,max,min,step){
		if(st==1&&max<=step){return max}
		else if(st==-1&&min>=step){return min}
		else{return step}
	}
/**
 * [setStyle 设置元素的高度和行高]
 * @param {[type]} li     [元素对象]
 * @param {[type]} height [行高]
 */
	function setStyle(li,height){
		for(var i=0;i<li.length;i++){
			li[i].style.height = height+'px';
			li[i].style.lineHeight = height+'px';
		}
	}
	function DataPicker(options){
		this.title = options.title || '';
		this.data = options.data || 'Data';
		this.line = options.line||5;
		this.height = options.height||40;
		this.separator = options.separator || '-';
		this.callback = options.callback;
		this.relate = options.relate||[];
	}
	DataPicker.prototype = {
		constructor:DataPicker,
		create:function(){
			var _this = this,
				text = '',//选择器列表
				node='',// 选择器容器
				messageInfo='';//错误提示
			if(isArr(_this.relate)&&isArr(_this.data)){
				for(var i = 0;i<this.data.length;i++){
					text='';
					if(this.relate.length==0){
						for(var j=0;j<this.data[i].length;j++){
							text+='<li>'+this.data[i][j]+'</li>'
						}
						node+='<div class="listBox"><ul>'+text+'</ul></div>';
					}else{
						text  = getdom(this.relate[0],this.relate[1],i,this.data);
						node+='<div class="listBox"><ul>'+text+'</ul></div>';	
					}
				}		
			}else{
				node = '<div class="listBox"></div>';
				messageInfo = '您填充的内容不符合规范';
			}
			var dom = "<div class='dataPicker-container'>"+
							"<div class='dataPicker-head'>"+
								"<div class='dataPicker-conform'>取消</div>"+
								"<div>"+this.title+"</div>"+
								"<div class='dataPicker-ok'>确定</div>"+
							"</div>"+
							"<div class='dataPicker-info'>"+node+
							"<div class='dataPickerTop'></div>"+
							"<div class='dataPickerMiddle'>"+messageInfo+"</div>"+
							"<div class='dataPickerBottom'></div>"+
							"</div>"+	
						"</div>"
			this.evenJs(dom)
		},
		evenJs:function(dom){
			var mask = document.querySelector('#dataPicker-mask');
			var body = document.querySelector('body');
			if(mask){return;}
			var dataMask = document.createElement('div');
			dataMask.id = 'dataPicker-mask';
			dataMask.innerHTML =dom ;
			body.appendChild(dataMask);
			var _this = this,checked=[];
			var container = document.querySelector('.dataPicker-container');
			var dataPicker = document.querySelector('.dataPicker-info');
			var dataPickerTop = dataPicker.querySelector('.dataPickerTop');
			var dataPickerMiddle = dataPicker.querySelector('.dataPickerMiddle');
			var dataPickerBottom = dataPicker.querySelector('.dataPickerBottom');
			var dataLi = dataPicker.querySelectorAll('li');
			var selectDiv = dataPicker.querySelectorAll('.listBox');
			var selectUl = dataPicker.querySelectorAll('ul');
			var conform = document.querySelector('.dataPicker-conform');
			var ok = document.querySelector('.dataPicker-ok');
			var highlight = Math.floor(this.line/2);
			container.style[transition] = 'transform 500ms ease-in-out';
			setTimeout(function(){
				container.style[transform] = 'translate(0,0)';
			},0)
			dataPickerTop.style.height = highlight*this.height+'px';
			dataPickerMiddle.style.height = this.height+'px';
			dataPickerMiddle.style.lineHeight = this.height+'px';
			dataPickerMiddle.style.textAlign = 'center';
			dataPickerMiddle.style.top = highlight*this.height+'px';
			dataPickerBottom.style.height = (this.line-1-highlight)*this.height+'px';
			dataPicker.style.height=this.line*this.height+'px';
			for(var i=0;i<selectDiv.length;i++){
				selectDiv[i].style.width = (100/selectDiv.length).toFixed(3)+'%';	
			}
			for(var i=0;i<selectUl.length;i++){
				var lilen = selectUl[i].childNodes.length;
				var trans = highlight+1-Math.ceil(lilen/2);
				selectUl[i].style[transform]='translate(0,'+trans*_this.height+'px)';
				selectUl[i].style[transition]='transform 500ms ease-in-out'
				selectUl[i].childNodes[Math.ceil(lilen/2)-1].className='active';
				TouchScroll(selectDiv[i],this.height,this.line,trans,i,function(id,el,index){
					if(selectUl.length==1){
						return;
					}
					if(selectUl.length==2){
						if(index==0&&_this.relate[0]){
							selectUl[1].innerHTML='';
							for(var x=0;x<_this.data[1][id].length;x++){
								selectUl[1].innerHTML+="<li>"+_this.data[1][id][x]+"</li>";
							}
							ref(1,2)
						}
					}
					if(selectUl.length==3){
						if(_this.relate[0]&&_this.relate[1]&&!_this.relate[2]){
							if(index==0){
								selectUl[1].innerHTML='';
								selectUl[2].innerHTML='';
								for(var x=0;x<_this.data[1][id].length;x++){
									selectUl[1].innerHTML+="<li>"+_this.data[1][id][x]+"</li>";
								}
								for(var y=0;y<_this.data[2][id][Math.ceil(lilen/2)-1].length;y++){
									selectUl[2].innerHTML+="<li>"+_this.data[2][id][Math.ceil(lilen/2)-1][y]+"</li>";
								}
								ref(1,3)
								
							}
							if(index==1){
								for(var d=0,d1;d<selectUl[0].childNodes.length;d++){
									if(selectUl[0].childNodes[d].className=='active'){
										d1=d;
									}
								}
								selectUl[2].innerHTML='';
								for(var x=0;x<_this.data[2][d1][id].length;x++){
									selectUl[2].innerHTML+="<li>"+_this.data[2][d1][id][x]+"</li>";
								}
								ref(2,3)
							}
						}
						if(index==0&&_this.relate[0]&&!_this.relate[1]&&!_this.relate[2]){
							selectUl[1].innerHTML='';
							for(var x=0;x<_this.data[1][id].length;x++){
								selectUl[1].innerHTML+="<li>"+_this.data[1][id][x]+"</li>";
							}
							ref(1,2)

						}
						if(index==0&&!_this.relate[0]&&_this.relate[1]&&!_this.relate[2]){
							selectUl[2].innerHTML='';
							for(var x=0;x<_this.data[2][id].length;x++){
								selectUl[2].innerHTML+="<li>"+_this.data[2][id][x]+"</li>";
							}
							ref(2,3);
						}
						if(index==1&&!_this.relate[0]&&_this.relate[1]&&_this.relate[2]){
							selectUl[2].innerHTML='';
							for(var x=0;x<_this.data[2][id].length;x++){
								selectUl[2].innerHTML+="<li>"+_this.data[2][id][x]+"</li>";
							}
							ref(2,3);
						}
					}
				});
			}
			function ref(z,s){
				setTimeout(function(){
					for(var m=z;m<s;m++){
						var lilen = selectUl[m].childNodes.length;
						var trans = highlight+1-Math.ceil(lilen/2);
						selectUl[m].style[transform]='translate(0,'+trans*_this.height+'px)';
						setStyle(selectUl[m].childNodes,_this.height);
						selectUl[m].childNodes[Math.ceil(lilen/2)-1].className='active';
					}
				},0)
			}
			setStyle(dataLi,this.height);
			on(conform,'click',function(){
				_this.hide(body,container,dataMask);
			})
			on(ok,'click',function(){
				for(var i=0;i<selectUl.length;i++){
					checked.push(selectUl[i].querySelector('.active').innerHTML);
				}
				_this.callback&&_this.callback(checked);
				_this.hide(body,container,dataMask);
			})
		},
		hide:function(body,container,dataMask){
			var _this = this;
			container.style[transform] = 'translateY(100%)';
			setTimeout(function(){
				body.removeChild(dataMask);
			},600)
		}
	}

	root['picker'] = DataPicker;
})(window,document,Math)