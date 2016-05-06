/**
 * 使用样式
 * <a href="#" data-custom="confirm" title="确认删除信息" data-confirm-content="确定需要删除吗？" data-mywidth="400px">测试confirm</a>
 * @param id 初始化弹窗并设置一个id
 * @param type 弹窗样式：dialog 或 confirm
 * dialog callback回调函数，传回两个参数：第一个为状态status，第二个为data为ajax请求返回的数据，第三个obj（调用setSlidePanel方法的this对象）
 */

(function ($, document) {
    "use strict";

    window.customDialog = {

        //初始化容器
        dialogFram: function (id, type) {
            var thisContext = $('body');
            if(thisContext.find('#'+id).length === 0){
                var content = '';
                content = content + '<div class=\"modal fade\" id=\"' + id + '\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myDialogLabel\" aria-hidden=\"true\">';
                content = content + '<div class=\"modal-dialog\">';
                content = content + '<div class=\"modal-content\">';
                content = content + '<div class=\"modal-header\">';
                content = content + '<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>';
                content = content + '<h4 class=\"modal-title\" id=\"myDialogLabel\"></h4>';
                content = content + '</div>';
                content = content + '<div class=\"modal-body\"></div>';

                if (type === 'confirm') {
                    content = content + '<div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">关闭</button><button type=\"button\" class=\"btn btn-primary\" id=\"confirmOk\">确认</button></div>';
                }

                content = content + '</div></div></div>';

                thisContext.append(content);
            }
        },
        //设置弹窗属性
        setDialog: function (obj, id, successCallBack) {
            /**
             * 定义全局方法
             * @param action 数据连接地址
             * @param title 弹出框标题
             * @param mywidth   弹框宽度
             * @param id    设置dialogId
             */

            //兼容a标签和button标签
            var action = $(obj).data('action') || $(obj).attr('href');
            var title = $(obj).attr('title') || $(obj).data('original-title');
            var mywidth = $(obj).data('mywidth');
            var confirmContent = $(obj).data('confirm-content');
            var dialog = $('#' + id);


            //if (action === '' || typeof action === 'undefined') {
            //    action = ;
            //}
            //if (title === '' || typeof title === 'undefined') {
            //    title = ;
            //}

            console.log(action + ' | ' + title + ' | ' + mywidth + ' | ' + dialog);
            //设置宽高
            if (typeof mywidth !== 'undefined') {
                dialog.find('.modal-dialog').css('width', mywidth);
            }

            //设置标题
            dialog.find('.modal-title').html(title);

            //显示dialog
            dialog.modal('show');

            if (confirmContent === '' || typeof confirmContent === 'undefined') {
                //显示占位
                dialog.find('.modal-body').html('<div class=\"noDate\"><img src=\"/xhltpl/default/img/listload.gif\" /><p>数据载入中...</p></div>');
                //获取并设置内容
                $.ajax({
                    url: action,
                    type: 'get',
                    cache: false
                }).done(setDialogBody).fail(setDialogError);

            } else {
                //confirm 弹框内容处理
                dialog.find('.modal-body').html(confirmContent);
                //d.resolve(dialog);
            }

            //TODO 处理confirm弹窗确认事件
            if(!!successCallBack){
                var suCallBack = successCallBack;
            }

            dialog.find('#confirmOk').off('click').on('click',function () {
                //隐藏confirm
                dialog.modal('hide');
                //处理数据
                $.get(action).always(suCallBack);

            });

            function setDialogBody(data) {
                //console.log(data);
                dialog.find('.modal-body').html(data);
                //设置dialog回调
                if(!!successCallBack){
                    successCallBack = successCallBack('success');
                }

            }

            function setDialogError(e) {
                dialog.find('.modal-body').html('<div class=\"noDate\"><img src=\"/xhltpl/default/img/error.png\" /><p>数据载入错误，请重试！</p></div>');
                if(!!successCallBack){
                    successCallBack = successCallBack('error');
                }
            }


        },
        //slidePanel
        slidePanelFarm: function (id) {
            var thisContext = $('body');
            if(thisContext.find('#'+id).length === 0){
                var content = '';
                content = content + '<div class=\"slidePanelBg\"></div>';
                content = content + '<div id=\"' + id + '\" class=\"panel slidePanel panel-default\">';
                content = content + '<div class=\"panel-heading\"><h3 class=\"panel-title\"><i class=\"pull-right\">&times;</i><span></span></h3></div>';
                content = content + '<div class=\"panel-body\"></div></div>';

                thisContext.append(content);
            }

        },
        setSlidePanel: function (obj, id, callBack) {
            //定义参数
            var action = $(obj).data('action') || $(obj).attr('href');
            var title = $(obj).attr('title') || $(obj).data('original-title');
            var myWidth = $(obj).data('mywidth');
            var slidePanel = $('#' + id);
            //var d = new $.Deferred();
            //设置宽度
            slidePanel.css({width: myWidth});
            //暗色背景
            var slidePanelBg = $('.slidePanelBg');
            //关闭按钮
            var slidePanelClose = slidePanel.find('.panel-title i');

            //设置标题
            slidePanel.find('.panel-title span').html(title);
            //设置占位内容
            slidePanel.find('.panel-body').html('<div class=\"noDate\"><img src=\"/xhltpl/default/img/listload.gif\" /><p>数据载入中...</p></div>');
            //显示slidePanel
            slidePanelBg.show();
            slidePanel.css({right: 0});
            //获取内容
            $.ajax({
                url: action,
                type: 'get',
                cache: false
            }).done(setSlideBody).fail(setSlideFail);
            //设置成功回调
            function setSlideBody(data) {
                console.log('插入slideBody');
                slidePanel.find('.panel-body').html(data);
                if (typeof callBack === 'function') {
                    callBack = callBack('success', data);
                }
            }

            //获取失败回调
            function setSlideFail(data) {
                slidePanel.find('.panel-body').html('<div class=\"noDate\"><img src=\"/xhltpl/default/img/error.png\" /><p>数据载入失败，请重试！</p></div>');
                if (typeof callBack === 'function') {
                    callBack = callBack('fail', data);
                }
            }

            //点击暗色背景隐藏panel
            slidePanelBg.off('click').on('click', function () {
                customDialog.slidePanelHide(id);
            });
            //设置成功绑定hide方法
            slidePanelClose.off('click').on('click', function () {
                customDialog.slidePanelHide(id);
            });

            //return d.promise();
        },
        slidePanelHide: function (id) {
            console.log('关闭slidePanel');
            //暗色背景
            var slidePanelBg = $('.slidePanelBg');
            var slidePanel = $('#' + id);
            slidePanelBg.hide();
            slidePanel.css({right: '-100%'});
            slidePanel.find('.panel-body').empty();
        }

    };

})(jQuery, document);




