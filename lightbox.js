;(function($){
		   
	var LightBox = function(settings){
		var self = this;
		this.settings = {
			speed:500
			};
		$.extend(this.settings,settings||{});
		//创建遮罩和弹出窗
		this.popupMask = $('<div id="G-lightbox-mask">');
		this.popupWin = $('<div id="G-lightbox-popup">');
		//保存body
		this.bodyNode=$(document.body);
		//渲染剩余的dom，并加入到body
		this.renderDOM();
		
		this.picViewArea=this.popupWin.find("div.lightbox-pic-view");//图片预览区域
		this.popupPic = this.popupWin.find("img.lightbox-image");//图片
		this.picCaptionArea = this.popupWin.find("div.lightbox-pic-caption");//图片描述区域
		this.nextBtn = this.popupWin.find("span.lightbox-next-btn");
		this.prevBtn = this.popupWin.find("span.lightbox-prev-btn");
		
		this.captionText = this.popupWin.find("p.lightbox-pic-desc");//图片描述
		this.currentIndex = this.popupWin.find("span.lightbox-of-index");//图片当前索引
		this.closeBtn = this.popupWin.find("span.lightbox-close-btn");//关闭按钮
		
		//准备开发事件委托，获得组数据
		this.groupName=null;
		this.groupData=[];	//放置同一组数据
		this.bodyNode.delegate(".js-lightbox,*[data-role=lightbox]","click",function(e){
			//alert(this);
			//阻止事件冒泡
			e.stopPropagation();
			var currentGroupName=$(this).attr("data-group");
			if(currentGroupName != self.groupName){
				self.groupName=currentGroupName;
				//alert(currentGroupName);
				//根据当前组名获取同一组数据
				self.getGroup();
			}
			//初始化弹出
			self.initPopup($(this));
		});

		//关闭弹出
		this.popupMask.click(function(){
			$(this).fadeOut();
			self.popupWin.fadeOut();
			self.clear=false;
		});
		this.closeBtn.click(function(){
			self.popupMask.fadeOut();
			self.popupWin.fadeOut();
			self.clear = false;
		});
		//绑定上下切换按钮事件
		this.flag = true;
		this.nextBtn.hover(function(){
									if(!$(this).hasClass("disabled") && self.groupData.length > 1){
										$(this).addClass("lightbox-next-btn-show");
									}
								},function(){
									if(!$(this).hasClass("disabled") && self.groupData.length > 1){
										$(this).removeClass("lightbox-next-btn-show");
									}									
								}).click(function(e){
									if(!$(this).hasClass("disabled")&&self.flag){
										self.flag=false;
										e.stopPropagation();
										self.goto("next");
										}
									});
		this.prevBtn.hover(function(){
									if(!$(this).hasClass("disabled") && self.groupData.length > 1){
										$(this).addClass("lightbox-prev-btn-show");
									}
								},function(){
									if(!$(this).hasClass("disabled") && self.groupData.length > 1){
										$(this).removeClass("lightbox-prev-btn-show");
									}									
								}).click(function(e){
									if(!$(this).hasClass("disabled")&&self.flag){
										self.flag=false;
										e.stopPropagation();
										self.goto("prev");
										}
									});
		//判断是不是IE6
		this.isIE6 = /MSIE 6.0/gi.test(window.navigator.userAgent);
		//绑定窗口调整事件
		var timer = null;
		this.clear = false;
		$(window).resize(function(){
			//alert(this.clear+","+self.clear);								 
			if(self.clear){
				window.clearTimeout(timer);
				timer = window.setTimeout(function(){
					self.loadPicSize(self.groupData[self.index].src);		
					//alert("resize");
				},500);	
				if(self.isIE6){
					self.popupMask.css({
						width:$(window).width(),
						height:$(window).height()
					});
				}
			}
		}).keyup(function(e){
			var keyValue=e.which;
			//console.log(keyValue);
			if(self.clear){
				if(keyValue==38 || keyValue==37){
					self.prevBtn.click();
				}else if(keyValue==40 || keyValue==39){
					self.nextBtn.click();
				}
			}
		});
		//alert(this.isIE6);
		//如果是IE6
		if(this.isIE6){
			$(window).scroll(function(){
				self.popupMask.css("top",$(window).scrollTop());
				//self.popupWin.css("top",$(window).scrollTop());
			});
		}
	};
	LightBox.prototype={
		goto:function(dir){
			if(dir==="next"){
				//this.groupData
				//this.index
				this.index++;
				if(this.index >= this.groupData.length-1){
					this.nextBtn.addClass("disabled").removeClass("lightbox-next-btn-show");
				}
				if(this.index != 0){
					this.prevBtn.removeClass("disabled");
				}
				
				var src=this.groupData[this.index].src;
				//console.log(this.index);
				this.loadPicSize(src);
			}else if(dir==="prev"){
				this.index--;
				if(this.index<=0){
					this.prevBtn.addClass("disabled").removeClass("lightbox-prev-btn-show");
				}
				if(this.index != this.groupData.length-1){
					this.nextBtn.removeClass("disabled");
				}
				var src=this.groupData[this.index].src;
				this.loadPicSize(src);
			}
		},
		loadPicSize:function(sourceSrc){
			var self = this;
			self.popupPic.css({width:"auto",height:"auto"}).hide();
			this.picCaptionArea.hide();
			this.preLoadImg(sourceSrc,function(){
				self.popupPic.attr("src",sourceSrc);
				var picWidth = self.popupPic.width(),
					picHeight = self.popupPic.height();
				//console.log(picWidth+","+picHeight);
				self.changePic(picWidth,picHeight);
			});
		},
		preLoadImg:function(src,callback){
			var img = new Image();
			if(!!window.ActiveXObject){
				img.onreadystatechange=function(){
					if(this.readyState==="complete"){
						callback();
					}
				}
			}else{
				img.onload=function(){
					callback();
				}
			}
			img.src=src;
		},
		changePic:function(width,height){
			var self = this,
				winWidth = $(window).width(),
				winHeight = $(window).height();
			//alert(winWidth+","+winHeight);
			//如果图片的宽高大约浏览器窗口的宽高比例，看是否溢出
			var scale = Math.min(winWidth/(width+10),winHeight/(height+10),1);
			width=width*scale;
			height=height*scale;
			this.picViewArea.animate({
									 width:width-10,
									 height:height-10
									 },self.settings.speed);
			var top = (winHeight-height)/2;
			if(this.isIE6){
				top +=$(window).scrollTop();
			}
			this.popupWin.animate({
								  width:width,
								  height:height,
								  marginLeft:-(width/2),
								  top:top
								  },self.settings.speed,function(){
									  self.popupPic.css({
														width:width-10,
														height:height-10
														}).fadeIn();
									  self.picCaptionArea.fadeIn();
									  self.flag=true;
									  self.clear = true;
									  //alert(this.clear);
									  });
			//设置描述文字和索引
			//console.log(this.index);
			this.captionText.text(this.groupData[this.index].caption);
			this.currentIndex.text("当前索引："+(this.index+1)+" of "+this.groupData.length);
		},
		initPopup:function(currentObj){
			var self = this,
				sourceSrc=currentObj.attr("data-source"),
				currentId=currentObj.attr("data-id");
			this.showMaskAndPopup(sourceSrc,currentId);
		},
		getGroup:function(){
			var self = this;
			//根据当前组名获取同一组数据
			var groupList = this.bodyNode.find("*[data-group="+this.groupName+"]");
			//alert(groupList.length);
			//清空
			self.groupData.length=0;
			groupList.each(function(){
				self.groupData.push({
									src:$(this).attr("data-source"),
									id:$(this).attr("data-id"),
									caption:$(this).attr("data-caption")
									});
			});
			//console.log(self.groupData);
		},
		renderDOM:function(){
			var strDom='<div class="lightbox-pic-view">'+
							'<span class="lightbox-btn lightbox-prev-btn"></span>'+
							'<img class="lightbox-image" src="images/2-2.jpg" >'+
							'<span class="lightbox-btn lightbox-next-btn"></span>'+
						'</div>'+
						'<div class="lightbox-pic-caption">'+
							'<div class="lightbox-caption-area">'+
								'<p class="lightbox-pic-desc">图片标题</p>'+
								'<span class="lightbox-of-index">当前索引：0 of 0 </span>'+
							'</div>'+
							'<span class="lightbox-close-btn"></span>'+
						'</div>';
			//插入到this.popupWin
			this.popupWin.html(strDom);
			//把遮罩和弹出框插入到body
			this.bodyNode.append(this.popupMask,this.popupWin);
		},
		showMaskAndPopup:function(sourceSrc,currentId){
			var self = this;
			
			this.popupPic.hide();
			this.picCaptionArea.hide();
			
			//this.popupMask.fadeIn();
			
			var winWidth=$(window).width(),
			    winHeight = $(window).height();
				
			this.picViewArea.css({
								 width:winWidth/2,
								 height:winHeight/2
								 });
			if(this.isIE6){
				var scrollTop = $(window).scrollTop();
				this.popupMask.css({
					width:winWidth,
					height:winHeight
				});
			}
			this.popupMask.fadeIn();
			this.popupWin.fadeIn();
			
			var viewHeight = winHeight/2+10;
			var topAnimate = (winHeight-viewHeight)/2;
			this.popupWin.css({
							  width:winWidth/2+10,
							  height:winHeight/2+10,
							  marginLeft:-(winWidth/2+10)/2,
							  top:(this.isIE6?-(viewHeight+scrollTop):-viewHeight)
							  }).animate({
								  top:(this.isIE6?(topAnimate+scrollTop):topAnimate)
								},self.settings.speed,function(){
										//加载图片
										self.loadPicSize(sourceSrc);
										});
			//根据当前点击的元素ID获取在当前组别里面的索引
			this.index = this.getIndexOf(currentId);
			//console.log(this.index);
			//$(this).index()
			var groupDataLength=this.groupData.length;
			if(groupDataLength>1){
				//this.nextBtn,this.nextBtn
				if(this.index===0){
					this.prevBtn.addClass("disabled");
					this.nextBtn.removeClass("disabled");
				}else if(this.index===groupDataLength-1){
					this.nextBtn.addClass("disabled");
					this.prevBtn.removeClass("disabled");					
				}else{
					this.nextBtn.removeClass("disabled");
					this.prevBtn.removeClass("disabled");					
				}
			}
		},
		getIndexOf:function(currentId){
			var index = 0;
			
			$(this.groupData).each(function(i){
               index = i;
			    if(this.id===currentId){
					return false;
				}
			});
			return index;
		}
	};		
	window["LightBox"]=LightBox;
})(jQuery);
