;(function($){

    /*
     *  基于 jQuery 的 --- 选项卡 UI 组件
     *
     *  @ param index 设置选项卡第几项显示
     *      下标从 0 开始, 默认值为 0
     * 
     *  @ param skin 皮肤的设置
     *      "default"         默认皮肤 
     *      "UnderLine"    标题下面有下划线和箭头
     *      
     *  @ param effect 切换的方式
     *      "default" 简单的显示、隐藏
     *      "swipe"   右侧划入
     *      
     *  新手练习 ---- 以后有待完善.......
     */
    
    'use strict'

    var Tab = (function(){
        function Tab(element, options){
            this.settings = $.extend({}, $.fn.Tab.defaults, options || {})

            this.element = element
            this.navs = this.element.find(".UI-tabs-nav")               // 选项卡标题
            this.nav = this.navs.find("li")                                        // 每个选项卡标题
            this.panels = this.element.find(".UI-tabs-panels")       // 选项卡面板
            this.panel = this.panels.find(".UI-tabs-panel")             // 每个面板
            this.init().toggle()
        }
        
        Tab.prototype = {

            /*
             *  初始化插件，目前来设置皮肤, 设置 index 值
             *  @ param skin 皮肤的设置
             *      "default"         默认皮肤 
             *      "UnderLine"    标题下面有下划线和箭头
             */
            
            init : function(){
                var element = this.element,
                      index = this.settings.index,
                      nav = this.nav,
                      panel = this.panel,
                      skin = this.settings.skin;

                if(skin === "UnderLine"){       // 设置皮肤
                    element.addClass("UI-tabs-UnderLine")
                }

                // 设置 index 值
                nav.removeClass("active").eq(index).addClass("active")
                panel.removeClass("active").eq(index).addClass("active")

                return this
            },
            toggle : function(){
                var nav = this.nav,
                      panel = this.panel,
                      effect = this.settings.effect;

                if(effect === "swipe"){
                    panel.parent().addClass("effect-swipe")
                }

                nav.each(function(){
                    $(this).on("click", function(){
                        var index = nav.index($(this))
                        nav.removeClass("active")
                        $(this).addClass("active")
                        panel.removeClass("active").eq(index).addClass("active")
                    })
                })

                return this
            }
        }

        return Tab;
    })();

    $.fn.Tab = function(options){
        return this.each(function(){
            var me = $(this),
                  instance = me.data("Tab");

            if(!instance){
                instance = new Tab(me, options);
                me.data("Tab", instance);
            }

            if($.type(options) === "string") return instance[options]();
        })
    }

    $.fn.Tab.defaults = {
        index : 0,
        skin : null,
        effect : "default"
    }

    $(function(){
        $("[data-widgets='UI-tabs']").Tab({
            skin : "UnderLine",
            effect : "swipe"
        });
    })

    

})(jQuery);