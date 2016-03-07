;(function($){

    /*
     *  基于 jQuery 的 --- 图片画廊 UI 组件
     *  
     *      
     *  新手练习 ---- 以后有待完善.......
     */
    
    'use strict'

    var Gallary = (function(){
        function Gallary(element, options){
            var me = this

            this.settings = $.extend({}, $.fn.Gallary.defaults, options || {});

            this.element = element                                                        // 组件本身
            this.items = this.element.find(".UI-gallary-item img")         // 每张缩略图
            // console.log(this.items.length)
            this.imgLen = this.items.length                                             // 图片的数量
            // this.oIndex = 0
            this.dataId = this.element.attr("data-id")

            // 保存 Body
            this.bodyNode = $(document.body)
            // 创建遮罩
            this.mask = $('<div class="UI-gallary-mask">' +

        '<div class="UI-gallary-popup">' +
            '<ul class="UI-gallary-view">' +
                '<li class="UI-gallary-image"></li>' +
                '<li class="UI-gallary-image"></li>' +
                '<li class="UI-gallary-image"></li>' +
                '<li class="UI-gallary-image"></li>' +
            '</ul>' +
            '<div class="UI-gallary-caption">' +
                '<div class="UI-gallary-count">' +
                    '<span class="count-current"></span>&frasl;' +
                    '<span class="count-total"></span>' +
                '</div>' +
            '</div>' +
            '<div class="UI-gallary-prev"></div>' +
            '<div class="UI-gallary-next"></div>' +
            '<div class="UI-gallary-close"></div>' +
        '</div>' +
    '</div>')
            this.mask.attr("id", this.dataId)
            this.gallaryImg = this.mask.find(".UI-gallary-image")       // 图片画廊中的图片
            this.captions = this.mask.find(".UI-gallary-caption")        // 图片画廊的标题


            this.renderDOM()
            this.items.each(function(){
                $(this).click(function(){                           // 点击图片 获取每个图片的 index 值
                    me.oIndex = me.items.index($(this))
                    me.gallaryInit().showMask()
                })
            })
            this.toggleGallary().closeMask()
        }
        
        Gallary.prototype = {
            renderDOM : function(){                            // 渲染 DOM，将弹层添加到 body
                var bodyNode = this.bodyNode,           // body
                      mask = this.mask,                            // 弹层
                      gallaryImg = this.gallaryImg,           // 图片画廊的图片
                      imgLen = this.imgLen,                     // 图片数量
                      items = this.items,                           // 预览图片
                      captions = this.captions,                 // 图片标题
                      totalCount = mask.find(".count-total"),    // 图片总数
                      imgSrc = [],
                      captionData = [];                                      

                for(var i = 0; i < items.length; i ++){     // 将预览图中的图片地址保存在 imgSrc 中
                    var src = items.eq(i).attr("src");
                    imgSrc.push(src)
                }

                for(var i = 0; i < gallaryImg.length; i ++){    // 在图片画廊中添加图片和图片地址
                    var img = new Image();
                    img.src = imgSrc[i];
                    gallaryImg.eq(i).append(img);
                }

                items.each(function(){                                  // 获取图片标题
                    var data = $(this).attr("data-caption")
                    captionData.push(data)
                })

                for(var i = 0; i < imgLen; i++){
                    var p = $("<p></p>")
                    p.html(captionData[i])
                    captions.append(p)
                }

                totalCount.html(imgLen)
                // 将弹层添加到 body
                bodyNode.append(mask)

                return this
            },
            loadResize : function(){                // 动态判断视口的宽高
                var mask = this.mask;

                var view = mask.find(".UI-gallary-view");
                
                function viewFun(){                 // 视口宽度判断
                    var winWidth = $(window).width(),
                          winHeight = $(window).height();
                    // 如果图片宽高大于浏览器视口的宽高比例，我们就看下图片的宽高是否溢出
                    var scale = Math.min(winWidth / 1366 , winHeight / 768 , 1 );       // 取最小比例，使图片能够放进视口
                    var width = 1366 * scale ;
                    var height = 768 * scale ;
                    view.width(width)
                    view.height(height)
                    console.log("视口变化");
                }

                viewFun()  
                $(window).resize(viewFun)       // 动态判断
            },
            showMask : function(){                // 显示弹层
                var mask = this.mask,
                      me = this;

                me.loadResize()  
                mask.addClass('active')
                return this
            },
            gallaryInit : function(){                                               // 初始化 gallary 画廊
                var mask = this.mask,
                      gallaryImg = this.gallaryImg,                            // 每张图片
                      gallaryPrev = mask.find(".UI-gallary-prev"),      // 上一页按钮
                      imgLen = this.imgLen,                                      // 图片数量
                      gallaryNext = mask.find(".UI-gallary-next"),     // 下一页按钮
                      currentCount = mask.find(".count-current"),     // 当前的图片 index
                      oIndex = this.oIndex,
                      captions = this.captions;

                if(oIndex === 0) {                              // 判断是不是第一个
                    gallaryPrev.hide() 
                    gallaryNext.show()
                } else if(oIndex === (imgLen - 1)){     // 判断是不是最后一个
                    gallaryNext.hide()
                    gallaryPrev.show()
                } else {
                    gallaryPrev.show()
                    gallaryNext.show()
                }
             
                gallaryImg.eq(oIndex).addClass("UI-gallary-active-image")
                if(gallaryImg.eq(oIndex - 1)) gallaryImg.eq(oIndex - 1).addClass("UI-gallary-prev-image")
                if(gallaryImg.eq(oIndex + 1)) gallaryImg.eq(oIndex + 1).addClass("UI-gallary-next-image")
                captions.find("p").removeClass("active").eq(oIndex).addClass("active")
                currentCount.html(oIndex + 1)

                return this
            },
            toggleGallary : function(){                                              // gallary 的切换
                var mask = this.mask,
                      gallaryImg = this.gallaryImg,                               // 每张图片
                      gallaryPrev = mask.find(".UI-gallary-prev"),         // 上一页按钮
                      imgLen = this.imgLen,                                         // 图片数量
                      gallaryNext = mask.find(".UI-gallary-next"),        // 下一页按钮
                      currentCount = mask.find(".count-current"),       // 当前的图片 index
                      captions = this.captions,
                      isAnimate = false,
                      me = this;

                gallaryNext.on("click", function(e){                       // 下一页
                    e.stopPropagation()
                    
                    if(isAnimate) return false                                  // 判断是否在动画

                    gallaryImg.removeClass("UI-gallary-active-image").removeClass("UI-gallary-prev-image").removeClass("UI-gallary-next-image")                        

                    me.oIndex ++;
                    isAnimate = true;
                    if(me.oIndex >= (imgLen - 1)) {
                        $(this).hide()
                        me.oIndex = (imgLen - 1)
                    } else {
                        gallaryPrev.show()
                    }   

                    gallaryImg.eq(me.oIndex).addClass("UI-gallary-active-image")
                    if(gallaryImg.eq(me.oIndex - 1)) gallaryImg.eq(me.oIndex - 1).addClass("UI-gallary-prev-image")
                    if(gallaryImg.eq(me.oIndex + 1)) gallaryImg.eq(me.oIndex + 1).addClass("UI-gallary-next-image")
                    captions.find("p").removeClass("active").eq(me.oIndex).addClass("active")
                    currentCount.html(me.oIndex + 1)

                    setTimeout(function(){                                    // 动画完成是1s，禁止重复点击
                        isAnimate = false           
                    }, 1000);
                })

                gallaryPrev.on("click", function(e){                     // 上一页
                    e.stopPropagation()

                    if(isAnimate) return false                               // 判断是否在动画

                    gallaryImg.removeClass("UI-gallary-active-image").removeClass("UI-gallary-prev-image").removeClass("UI-gallary-next-image")
                    me.oIndex --;
                    console.log(me.oIndex)
                    isAnimate = true;
                    if(me.oIndex <= 0) {
                        $(this).hide()
                        me.oIndex = 0
                    } else {
                       gallaryNext.show()
                    }

                    gallaryImg.eq(me.oIndex).addClass("UI-gallary-active-image")
                    if(gallaryImg.eq(me.oIndex - 1)) gallaryImg.eq(me.oIndex - 1).addClass("UI-gallary-prev-image")
                    if(gallaryImg.eq(me.oIndex + 1)) gallaryImg.eq(me.oIndex + 1).addClass("UI-gallary-next-image")
                    captions.find("p").removeClass("active").eq(me.oIndex).addClass("active")
                    currentCount.html(me.oIndex + 1)


                    setTimeout(function(){                                  // 动画完成是1s，禁止重复点击
                        isAnimate = false
                    }, 1000);
                })

                return this
            },
            closeMask : function(){                 // 关闭弹层
                var mask = this.mask,
                      gallaryClose = this.mask.find(".UI-gallary-close"),
                      gallaryImg = this.gallaryImg,  
                      me = this;
            
                gallaryClose.on("click", function(){
                    mask.removeClass("active")
                    gallaryImg.removeClass("UI-gallary-active-image").removeClass("UI-gallary-prev-image").removeClass("UI-gallary-next-image")     
                })
       
                $(window).on("keydown", function(e){        // 按下 esc 键 也可以关闭弹层
                    if(e.keyCode === 27){
                        mask.removeClass("active")
                        gallaryImg.removeClass("UI-gallary-active-image").removeClass("UI-gallary-prev-image").removeClass("UI-gallary-next-image")     
                    }
                })

                return this
            }
        }

        return Gallary;
    })();

    $.fn.Gallary = function(options){
        return this.each(function(){
            var me = $(this),
                  instance = me.data("Gallary");

            if(!instance){
                instance = new Gallary(me, options);
                me.data("Gallary", instance);
            }

            if($.type(options) === "string") return instance[options]();
        })
    }

    $.fn.Gallary.defaults = {

    }

    $(".UI-gallary").Gallary();
})(jQuery);