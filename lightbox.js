;(function($){
		   
	var LightBox = function(){
		var self = this;
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
		});
		//初始化弹出
		//self.initPopup($(this));
		//关闭弹出
		this.popupMask.click(function(){
			$(this).fadeOut();
			self.popupWin.fadeOut();
		});
		this.closeBtn.click(function(){
			self.popupMask.fadeOut();
			self.popupWin.fadeOut();
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
									});;		
	};
	LightBox.prototype={
		goto:function(dir){
			if(dir==="next"){
				//this.groupData
				//this.index
				this.index++;
				if(this.index >= this.groupData.length-1){
					this.nextBtn.addClass("disabled").removeClass("lightbox-next-show");
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
					this.prevBtn.addClass("disabled").removeClass("lightbox-prev-show");
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
			
			this.preLoadImg(soureSrc,function(){
				self.puppupPic.attr("src",sourceSrc);
				var picWidth = self.popupPic.width(),
					picHeight = self.popupPic.height();
				self.changePic(picWidth,picHeight);
			});
		},
		changePic:function(){
			var self = this,
				winWidth = $(window).width(),
				winHeight = $(window).height();
			this.popupWin.animate({
								  width:width,
								  height:height,
								  marginLeft:(width/2),
								  top:(winHeight-height)/2
								  },function(){
									  self.popupPic.css({
														width:width-10,
														height:height-10
														}).fadeIn();
									  self.picCaptionArea.fadeIn();
									  self.flag=true;
									  });				
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
			console.log(self.groupData);
		},
		renderDOM:function(){
			var strDom='<div class="lightbox-pic-view">'+
							'<span class="lightbox-btn lightbox-prev-btn"></span>'+
							'<img class="lightbox-image" src="images/2-2.jpg" width="100%">'+
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
			
			this.popupMask.fadeIn();
			
			var winWidth=$(window).width(),
			    winHeight = $(window).height();
				
			this.picViewArea.css({
								 width:winWidth/2,
								 height:winHeight/2
								 });
			this.popupWin.fadeIn();
			
			var viewHeight = winHeight/2+10;
			
			this.popupWin.css({
							  width:winWidth/2+10,
							  height:winHeight/2+10,
							  marginLeft:-(winWidth/2+10)/2
							  });
			//根据当前点击的元素ID获取在当前组别里面的索引
			this.index = this.getIndexOf(currentId);
			//console.log
		},
		getIndexOf:function(currentId){
			var index = 0;
			
			$(this.groupData).each(function(i){
               index ++;
			    if(this.id===currentId){
					return false;
				}
			});
			return index;
		}
	};		
	window["LightBox"]=LightBox;
})(jQuery);