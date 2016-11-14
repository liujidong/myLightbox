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
	};
	LightBox.prototype={
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