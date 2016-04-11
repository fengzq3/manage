/**
 * 用于订住dom在视图内
 * Created by feng on 2016/4/11.
 */

(function ($) {
    "use strict";
    $.fn.extend({
        pinUp: function (opt) {
            var defaultOpt = {
                scrollCon: '.manage-content',
                paddingTop: 0,
                offsetH: 0,
                offsetW: 0
            };
            opt = $.extend(defaultOpt, opt);

            console.log('pinup');
            this.each(function () {
                /**
                 * 初始化时先计算宽高位置
                 * 防止fixed时变形
                 */

                var pinDom = $(this), scrollCon = opt.scrollCon, pinDomH = pinDom.height() + opt.offsetH, pinDomTop = pinDom.offset().top;

                //设置位置
                pinDom.css({
                    width: pinDom.width() + opt.offsetW,
                    height: pinDom.height() + opt.offsetH,
                    position: 'absolute',
                    top: 0
                }).parent().css({'padding-top': pinDomH});

                //绑定scroll事件
                $(scrollCon).scroll(function () {
                    console.log($(scrollCon).scrollTop() + " | " + pinDomTop);
                    //固定顶部：判断滚动出顶部
                    if ($(scrollCon).scrollTop() > pinDomTop - 50) {
                        pinDom.css({position: 'fixed', top: 50});
                    }
                    if ($(scrollCon).scrollTop() <= pinDomTop - 50) {
                        pinDom.css({position: 'absolute', top: 0});
                    }
                });

            });

        },
        pinDown: function (opt) {
            console.log('pinDown');

            var defaultOpt = {
                scrollCon: '.manage-content',
                paddingTop: 0,
                offsetH: 0,
                offsetW: 0
            };
            opt = $.extend(defaultOpt, opt);


            this.each(function () {
                /**
                 * 初始化时先计算宽高位置
                 * 防止fixed时变形
                 */

                var pinDom = $(this), scrollCon = opt.scrollCon, pinDomH = pinDom.height() + opt.offsetH, pinDomTop = pinDom.offset().top, windowH = $(window).height();

                //设置位置
                pinDom.css({
                    width: pinDom.width() + opt.offsetW,
                    height: pinDom.height() + opt.offsetH,
                    position: 'absolute',
                    bottom: 0
                }).parent().css({'padding-bottom': pinDomH});
                fixedBottom();
                //绑定scroll事件
                $(scrollCon).scroll(function () {
                    //固定顶部：判断滚动出顶部
                    fixedBottom();
                });
                //固定底部方法
                function fixedBottom(){
                    if ($(scrollCon).scrollTop() + windowH < pinDomTop + pinDomH) {
                        pinDom.css({position: 'fixed', bottom: 0}).addClass('pinBottom');
                    }
                    if ($(scrollCon).scrollTop() + windowH >= pinDomTop + pinDomH) {
                        pinDom.css({position: 'absolute', bottom: 0}).removeClass('pinBottom');
                    }
                }
                //底部固定 END
            });

        }
    });


})(jQuery);