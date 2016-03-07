;(function($){

    /*
     *  基于 jQuery 的 --- 折叠面板 UI 组件
     *  
     *  @ param skin 皮肤的设置
     *      "default" 默认皮肤 标题前面有箭头
     *      "basic"    极简皮肤 标签前面什么都没
     *      
     *  @ param effect 展开折叠面板的方式
     *      "default" 简单的显示、隐藏
     *      "fade"     渐隐渐现的方式
     *      
     *  新手练习 ---- 以后有待完善.......
     */
    
    'use strict'

    var Accordion = (function(){
        function Accordion(element, options){
            this.settings = $.extend({}, $.fn.Accordion.defaults, options || {});

            this.element = element                                                 // 组件本身
            this.items = this.element.find(".UI-accordion-item")    // 每个折叠面板
            this.titles = this.items.find(".UI-accordion-title")          // 每个折叠面板的标题
            this.init().toggle(this.settings.effect)

        }
        
        Accordion.prototype = {

            /*
             *  初始化插件，目前主要来定义皮肤
             *  @ param skin "default" 默认皮肤 标题前面有箭头
             *  @ param skin "basic"    极简皮肤 标签前面什么都没
             */
            
            init : function(){          
                var skin = this.settings.skin,
                      element = this.element;

                // 默认皮肤
                if(skin === null){
                    element.addClass("UI-accordion-default")
                }

                // 极简皮肤
                if(skin === "basic"){
                    element.addClass("UI-accordion-basic")
                }

                return this;
            },

            /*
             *  展开折叠面板时的方式
             *  @ param effect "default" 简单的显示、隐藏
             *  @ param effect "fade"     渐隐渐现的方式
             */

            toggle : function(effect){   
                var items = this.items;
                // 切换的方式 默认
                if(effect == "default"){
                    items.each(function(){
                        $(this).on("click", function(){
                            if($(this).hasClass("accordion-active")){
                                $(this).removeClass("accordion-active");
                                $(this).find(".UI-accordion-content").hide()
                            } else {
                                $(this).addClass("accordion-active");
                                $(this).find(".UI-accordion-content").show()
                            }
                        
                        })
                    })
                }

                // 切换方式 渐隐渐现
                if(effect == "fade"){
                    items.each(function(){
                        $(this).on("click", function(){
                            if($(this).hasClass("accordion-active")){
                                $(this).removeClass("accordion-active");
                                $(this).find(".UI-accordion-content")
                            } else {
                                $(this).addClass("accordion-active");
                                $(this).find(".UI-accordion-content").css("opacity", 0).animate({
                                    opacity : 1
                                }, 800)
                            }          
                        })
                    })
                }

                return this;
            }
        }

        return Accordion;
    })();

    $.fn.Accordion = function(options){
        return this.each(function(){
            var me = $(this),
                  instance = me.data("Accordion");

            if(!instance){
                instance = new Accordion(me, options);
                me.data("Accordion", instance);
            }

            if($.type(options) === "string") return instance[options]();
        })
    }

    $.fn.Accordion.defaults = {
        skin : null,
        effect : "default"          //切换方式
    }

})(jQuery);