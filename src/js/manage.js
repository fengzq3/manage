/**
 * Created by feng on 2016/3/22.
 */
$(function () {
    "use strict";

    //设置全局变量
    var timer;
    var designerWorks = $('#designerWorks'), orderFlow = $('#orderFlow');
    //施工流程自适应宽度
    setOrderProgress();
    function setOrderProgress() {
        var flowPanel = $('[data-custom="width"]'), flowItems = flowPanel.find('.flow-progress-item'), itemWidth = Math.floor(flowPanel.width() / flowItems.length);
        flowItems.width(itemWidth);
    }

    //定义全局load信息
    //初始化一个load容器
    var loadContent = '<div class=\"manage-loading\"><p class=\"loadLabel\"></p></div>', loading = $('.manage-loading');
    if (loading.length === 0) {
        $('body').append(loadContent);
        loading = $('.manage-loading');
    }
    //隐藏load信息
    function hideLoad(grade) {
        loading.animate({top: 0}, 300, function () {
            loading.removeClass(grade);
        });
    }


    /**
     * 显示load信息
     * @param message    提示信息
     * @param grade     信息级别，传入一个class来决定load颜色（默认无色）
     * @param time      显示持续时间
     */

    function showLoad(message, grade, time) {
        loading.addClass(grade).find('.loadLabel').html(message);
        loading.animate({top: '50px'}, 300);
        console.log('load time:' + time);
        if (typeof time !== 'undefined') {
            setTimeout(function () {
                hideLoad(grade);
            }, time);
        }
    }

    //处理提示工具
    var popoverElements = $('[data-toggle="popover"]');
    $('[data-toggle="tooltip"]').tooltip();
    popoverElements.popover({html: true, placement: 'top'}).click(function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
    popoverElements.hover(function () {
        $(this).popover('show');
    }, function () {
        $(this).popover('hide');
    });

    //处理侧边slide显示隐藏
    var hideSlide = $('.hideSlide'), munuSlide = $('.menuSlide'), mynuSlideFlag = $('.mynuSlide-flag'), manageContent = $('.manage-content');
    hideSlide.on('click', hideSlideFun);
    mynuSlideFlag.on('click', showSlideFun);

    function hideSlideFun() {
        manageContent.css('left', 0);
        munuSlide.animate({
            'left': '-180px'
        }, 100, function () {
            mynuSlideFlag.css('left', 0);
        });
    }

    function showSlideFun() {
        manageContent.css('left', '180px');
        mynuSlideFlag.animate({
            'left': '-3em'
        }, 100, function () {
            munuSlide.css('left', 0);
        });
    }

    //设计稿隐藏显示：用于主manageHtml 的列表
    /**
     * 每个订单tr上必须标有：data-orderid=订单id，设计稿tr上必须有对应的orderid 类
     * @type {*|jQuery|HTMLElement}
     */
    //订单全选
    var itemTr = $('.manage-panel-item .table tr'), allOrder = $('#allOrder'), labelUi = itemTr.find('.labelUi'), allorderItem = itemTr.find('[type="checkbox"]');
    allOrder.on('click', function () {
        console.log(allOrder);
        if (allOrder.hasClass('onChecked')) {
            allOrder.removeClass('onChecked');
            labelUi.removeClass('onChecked');
            //全取消
            allorderItem.each(function () {
                $(this).prop('checked', false);
            });
            itemTr.removeClass('on');
        } else {
            allOrder.addClass('onChecked');
            labelUi.addClass('onChecked');
            //全选
            allorderItem.each(function () {
                $(this).prop('checked', true);
            });
            itemTr.addClass('on');
        }
    });
    //订单选中事件
    itemTr.on('click', function () {
        console.log('tr click');
        var id = $(this).data('orderid');
        var thisTr = $(this).find('#' + id);
        var thisLabel = $(this).find('.labelUi');
        //处理逻辑
        if (thisTr.length !== 0) {
            allOrder.removeClass('onChecked');
            if (!thisTr.prop('checked')) {
                thisTr.prop('checked', true);
                $(this).addClass('on');
                thisLabel.addClass('onChecked');
            } else {
                thisTr.prop('checked', false);
                $(this).removeClass('on');
                thisLabel.removeClass('onChecked');
            }
        }

    });

    //查看订单设计稿
    itemTr.find('[data-custom="works"]').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var parentsR = $(this).parents('tr');
        var siblingsId = parentsR.data('orderid');
        if (typeof siblingsId !== 'undefined') {
            if (!parentsR.hasClass('orderIn')) {
                parentsR.addClass('orderIn').siblings('.' + siblingsId).show(500);
            } else {
                parentsR.removeClass('orderIn').siblings('.' + siblingsId).hide(500);
            }
        }
        console.log(siblingsId);

    });
    //上传设计稿
    itemTr.find('[data-custom="uploadWorks"]').on('click', function (e) {
        e.stopPropagation();
    });

//设置全局dialog,依赖customDialog.js

    var dialogFlag = $('[data-custom="dialog"]');
    console.log(dialogFlag);
    if (dialogFlag.length !== 0) {

        //初始化dialog
        customDialog.dialogFram('manageDialog', 'dialog');
        //绑定事件
        dialogFlag.on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            customDialog.setDialog(this, 'manageDialog');

        });

    }
    //全局confirm
    var confirmFlag = $('[data-custom="confirm"]'), thisConfirmOkUrl;
    if (confirmFlag.length !== 0) {
        //初始化一个confirm
        customDialog.dialogFram('manageConfirm', 'confirm');
        //绑定confirm显示事件
        confirmFlag.on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            customDialog.setDialog(this, 'manageConfirm');
            thisConfirmOkUrl = $(this).attr('href');
        });
        //绑定点击确认事件
        var manageConfirm = $('#manageConfirm');
        manageConfirm.find('#confirmOk').on('click', function () {

            //确认后操作
            confirmOkFun();

            manageConfirm.modal('hide');

        });
    }

    //confirm 回调函数
    function confirmOkFun() {
        console.log('确认定稿');
        console.log(thisConfirmOkUrl);
        $.get(thisConfirmOkUrl).done(function (data) {
            console.log(data);
            try {
                data = $.parseJSON(data);
            } catch (e) {
            }
            //显示信息

            if (data.error === 0) {
                console.log('成功定稿');
                showLoad(data.message, 'load-success', '2500');
                //定稿dom操作
                chooseWorkFinal();
            } else {
                console.log('定稿出错');
                showLoad(data.message, 'load-warning', '2500');
            }
        });
    }

    //全局slidePanel 设置
    var slidePanel = $('[data-custom="slidePanel"]');
    console.log(slidePanel);
    if (slidePanel.length !== 0) {
        //初始化slidePanel
        customDialog.slidePanelFarm('manageSlidePanel');
    }
    /**
     * 设计稿/报价 详情页面回调事件处理
     * @param status    状态标记：返回success为成功，返回fail为失败
     * @param data      返回的数据
     */
        //绑定设计师订单的 slidePanel 显示事件
    designerWorks.find(slidePanel).on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        customDialog.setSlidePanel(this, 'manageSlidePanel', setOfferEvent);
    });
    function setOfferEvent(status, data) {
        console.log('offer：' + status);
        $('[data-toggle="tooltip"]').tooltip();
        //报价栏声明
        var offerPic = $('.order-offer-pic');
        var offerDetail = $('.order-offer-detail');

        //开始绑定报价列表事件
        var orderOfferList = $('.order-offer-list');
        orderOfferList.find('a').off('click').on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            //处理工厂报价列表的两个状态
            if (!$(this).hasClass('on')) {
                $(this).addClass('on').parent().tooltip('hide').siblings().find('a').removeClass('on');
                var thisTargetUrl = $(this).attr('href');
                console.log(thisTargetUrl);
                //处理数据并动态调整大小
                offerPic.width('30%');
                //显示detail面板，占位数据
                offerDetail.width('40%').html('<div class=\"noDate\"><div class=\"noData-inner\"><img src=\"../img/listload.gif\" /><p>数据载入中...</p></div></div>');
                //获取数据
                $.ajax({type: 'get', url: thisTargetUrl})
                    .then(setOfferDetail, function (e) {
                        //获取失败，处理
                        offerDetail.html('<div class=\"noDate\"><img src=\"../img/error.png\" /><p>获取数据失败，请重试！</p></div>');
                    });
            } else {
                $(this).removeClass('on').parent().tooltip('hide');
                offerPic.width('70%');
                offerDetail.width(0).empty();
            }


        });

        //panel内detail 设置
        function setOfferDetail(data) {
            //获取成功，处理数据
            var detailData = data;
            offerDetail.html(detailData);
            //绑定 关闭/确认定稿 事件
            var offerPanelClose = offerDetail.find('#offerPanelClose');
            var offerPanelConfirm = offerDetail.find('#offerPanelConfirm');
            var offerPanelTwice = offerDetail.find('#offerPanelTwice');
            //关闭
            offerPanelClose.on('click', function () {
                orderOfferList.find('.on').removeClass('on');
                offerDetail.width(0).empty();
                offerPic.width('70%');
            });
            //确认定稿
            offerPanelConfirm.on('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                var thisUrl = $(this).attr('href');
                offerDetail.append('<div class=\"noDate\"><div class=\"noData-inner\"><img src=\"../img/listload.gif\" /><p>提交中...</p></div></div>');
                //处理url
                $.ajax({type: 'get', url: thisUrl})
                    .then(function (data) {
                        try {
                            data = $.parseJSON(data);
                        } catch (e) {
                        }

                        if (data.error === 0) {
                            //返回成功
                            showLoad(data.message, 'load-success', 2500);
                            offerDetail.find('.noDate').html('<div class=\"noData-inner\"><img src=\"../img/success.png\" /><p>' + data.message + '</p></div>');
                            if (typeof timer !== 'undefined') {
                                clearTimeout(timer);
                            }
                            timer = setTimeout(function () {
                                //方法迭代设置
                                //setOfferDetail(detailData);
                                customDialog.slidePanelHide('manageSlidePanel');
                                chooseWorkFinal();
                            }, 1000);

                        } else {
                            //返回失败
                            showLoad(data.message, 'load-warning', 2500);
                            offerDetail.find('.noDate').html('<div class=\"noData-inner\"><img src=\"../img/error.png\" /><p>' + data.message + '</p></div>');
                            if (typeof timer !== 'undefined') {
                                clearTimeout(timer);
                            }
                            timer = setTimeout(function () {
                                //定稿失败
                                offerDetail.find('.noDate').remove();
                            }, 1000);

                        }
                    }, function (e) {
                        showLoad('网络异常', 'load-warning', 2500);
                    });
            });
            //二次报价
            offerPanelTwice.on('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                var thisUrl = $(this).attr('href');
                offerDetail.append('<div class=\"noDate\"><div class=\"noData-inner\"><img src=\"../img/listload.gif\" /><p>提交中...</p></div></div>');
                $.ajax({type: 'get', url: thisUrl})
                    .then(function (data) {
                        try {
                            data = $.parseJSON(data);
                        } catch (e) {
                        }

                        if (data.error === 0) {
                            //返回成功
                            showLoad(data.message, 'load-success', 2500);
                            //提交二次报价成功后操作
                            offerDetail.find('.noDate').html('<div class=\"noData-inner\"><img src=\"../img/success.png\" /><p>' + data.message + '</p></div>');
                            if (typeof timer !== 'undefined') {
                                clearTimeout(timer);
                            }
                            timer = setTimeout(function () {
                                //方法迭代设置
                                setOfferDetail(detailData);
                            }, 1000);

                        } else {
                            //返回失败
                            showLoad(data.message, 'load-warning', 2500);
                            offerDetail.find('.noDate').html('<div class=\"noData-inner\"><img src=\"../img/error.png\" /><p>' + data.message + '</p></div>');
                            if (typeof timer !== 'undefined') {
                                clearTimeout(timer);
                            }
                            timer = setTimeout(function () {
                                //二次报价错误
                                offerDetail.find('.noDate').remove();
                            }, 1000);
                        }
                    }, function (e) {
                        showLoad('网络异常', 'load-warning', 2500);
                    });
            });

        }

        //panel内定detail设置 END

    }

    //定稿成功后的操作 设计师区域

    function chooseWorkFinal() {
        var designerWorksContent = designerWorks.find('.panel-body'), chooseWorkFinalUrl = designerWorks.data('workfinalurl');
        //操作设计师设计稿区域
        designerWorks.removeClass('now');
        designerWorksContent.html('<div class=\"noDate\"><img src=\"../img/listload.gif\" /><p>定稿中...</p></div>');
        $.ajax({type: 'get', url: chooseWorkFinalUrl})
            .then(function (data) {
                //定稿成功后获取定稿数据，并载入
                designerWorksContent.html(data);
                //绑定查看详情事件
                $('.media-orderFinal').children('a').on('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    customDialog.setSlidePanel(this, 'manageSlidePanel', setOfferEvent);
                });
            }, function (e) {
                designerWorksContent.html('<div class=\"noDate\"><img src=\"../img/error.png\" /><p>拉取数据失败，刷新重试！</p></div>');
            });
        //设计稿区 END
        //签单流程区开始
        orderFlow.addClass('now');
        getOrderFlow();

    }

    //TODO 签单数据 h5消息提示获取更新
    //签单区数据获取
    function getOrderFlow() {
        var orderFlowUrl = orderFlow.data('workfinalurl');
        orderFlow.html('<div class=\"noDate\"><img src=\"../img/listload.gif\" /><p>载入中...</p></div>');
        $.ajax({type: 'get', url: orderFlowUrl})
            .then(function (data) {
                orderFlow.html(data);
                //设置flowProgress宽度
                setOrderProgress();
                //设置slidePanel响应事件
                $('.order-flow-list-item').find('[data-custom="slidePanel"]').on('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    customDialog.setSlidePanel(this, 'manageSlidePanel', function (status, data) {
                        console.log('order-flow-list-item：' + status);
                    });
                });

            }, function (e) {
                orderFlow.addClass('now').html('<div class=\"noDate\"><img src=\"../img/error.png\" /><p>拉取开工信息失败，刷新重试！</p></div>');
            });
    }

    //slideMenu 中的 slidePanel 事件(个人信息/发票信息/管理人员)
    //个人信息
    munuSlide.find('#slideInfomation').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        customDialog.setSlidePanel(this, 'manageSlidePanel', infoFormEvent);
    });
    function infoFormEvent() {
        var manageSlidePanelForm = $('#manageSlidePanel').find('form');
        //绑定关闭事件
        manageSlidePanelForm.find('#offerPanelClose').on('click', function () {
            customDialog.slidePanelHide('manageSlidePanel');
        });
        //绑定focus/blur提示事件
        var inputCon = manageSlidePanelForm.find('.manage-form-item');
        inputCon.find('input,textarea').focus(function () {
            $(this).parent().siblings('.help-block').removeClass('success').addClass('error').html('<span class=\"glyphicon glyphicon-warning-sign\"></span>' + $(this).attr('placeholder'));
        }).blur(function () {
            if ($(this).val() !== '') {
                $(this).parent().siblings('.help-block').removeClass('error').addClass('success').html('<span class=\"glyphicon glyphicon-ok\"></span>');
            }
        });
        //提交表单
        /**
         * 问题1：如何兼容IE，ie不支持submit事件，如何截断form表单的提交
         */
        submitInfoForm(manageSlidePanelForm);

        //处理二级联动
    }

    //发票信息
    munuSlide.find('#slideInvoice').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        customDialog.setSlidePanel(this, 'manageSlidePanel', infoFormEvent);
    });

    //管理人员
    munuSlide.find('#slideStaff').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        customDialog.setSlidePanel(this, 'manageSlidePanel', infoFormEvent);
    });

    //提交表单方法
    function submitInfoForm(theForm) {
        //TODO 处理提交个人信息表单
        /**
         * 兼容IE方案：
         * 判断：
         * 若IE，则表单添加onsubmit="return false;"阻断默认表单提交,然后绑定确定按钮click事件
         * 非IE，则绑定submit事件提交
         */
        var actionUrl = theForm.attr('action'), data = theForm.serialize();
        if (navigator.userAgent.indexOf('MSIE') > 0) {
            //是IE
            theForm.attr('onsubmit', 'return false;').find('#offerPanelSubmit').on('click', function () {
                submitInfo();
            });
        } else {
            //不是IE
            theForm.on('submit', function (e) {
                e.preventDefault();
                e.stopPropagation();
                submitInfo();
            });

        }


        //提交方法
        function submitInfo() {
            $.ajax({
                type: 'post',
                url: actionUrl,
                data: data
            }).then(function (data) {
                try {
                    data = $.parseJSON(data);
                } catch (e) {
                }
                if (data.error === 0 || data.error === '0') {
                    showLoad(data.message, 'load-success', 2500);
                    if (typeof timer !== 'undefined') {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(function () {
                        customDialog.slidePanelHide('manageSlidePanel');
                    },2000);

                } else {
                    showLoad(data.message, 'load-warning', 2500);
                }

            }, function (e) {
                //提交失败
                showLoad('网络错误，请刷新重试！', 'load-warning', 2500);
            });
        }

        //提交方法 END
    }

    //二级联动方法
    function provinceCity() {
        //TODO 处理二级联动方法

    }


//报价列表
    $('.shang-offer-detail').on('click', function (e) {
        e.stopPropagation();
        if ($(this).hasClass('on')) {
            $(this).removeClass('on');
            $(this).next('.shang-table-detail').slideUp(200);
        } else {
            $(this).addClass('on');
            $(this).next('.shang-table-detail').slideDown(200);
        }
    });
    $('.detailAll').on('click', function () {
        if ($(this).hasClass('on')) {
            $('.shang-table-detail').slideDown(200);
        } else {
            $('.shang-table-detail').slideUp(200);
        }
    });
    //议价
    $('.table-data tr').on('click', function () {
        var mInput = $(this).find('input[type="checkbox"]'), offerCon = $('.reOffer-inner');
        if (mInput.prop('checked')) {
            $(this).removeClass('checked');
            mInput.prop('checked', false);
        } else {
            if (offerCon.children().length >= 5) {
                alert("您最多选择5家工厂");
                return false;
            }
            $(this).addClass('checked');
            mInput.prop('checked', true);
        }
        //添加容器
        var offerCheck = $('.offerListForm').find('tr.checked');
        getOffer(offerCheck, offerCon);

    });
    //二次议价展示
    $('.anotherOffer').off();

    //获取数组
    function getOffer(offerCheck, offerCon) {
        var content = '';

        offerCheck.each(function (i) {
            content = content + '<p class=\"col-sm-2\">' + $(offerCheck[i]).find('td a').html() + '</p>';
        });
        offerCon.html(content);
        $('.reOfferHead span').html(offerCon.children().length);
    }

    //处理不支持placeholder的浏览器
    if (!placeholderSupport()) {   // 判断浏览器是否支持 placeholder
        $('[placeholder]').focus(function () {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
            }
        }).blur(function () {
            var input = $(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
        }).blur();
    }
    function placeholderSupport() {
        return 'placeholder' in document.createElement('input');
    }

});