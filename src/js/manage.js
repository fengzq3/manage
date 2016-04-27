/**
 * Created by feng on 2016/3/22.
 */
(function () {
    "use strict";
    var loading = $('<div class=\"manage-loading\"><p class=\"loadLabel\"></p></div>'), timer;

    window.load = {
        init: function () {
            if ($('.manage-loading').length === 0) {
                $('body').append(loading);
            }
        },
        hideLoad: function (grade) {
            //隐藏load信息
            loading.stop().animate({top: '-50px', opacity: 0}, 500, function () {
                loading.removeClass(grade);
            });
            //清空定时器timer
            if (!!timer) clearTimeout(timer);
        },
        showLoad: function (message, grade, time) {
            /**
             * 显示load信息
             * @param message    提示信息
             * @param grade     信息级别，传入一个class来决定load颜色（默认无色）
             * @param time      显示持续时间
             */
            loading.addClass(grade).find('.loadLabel').html(message);
            loading.stop().animate({top: '50px', opacity: 1}, 300);
            console.log('load time:' + time);
            if (typeof time !== 'undefined') {
                timer = setTimeout(function () {
                    load.hideLoad(grade);
                }, time);
            }
        }
    };

})(jQuery);

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
    load.init();

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
    }
    //全局confirm
    var confirmFlag = $('[data-custom="confirm"]');
    if (confirmFlag.length !== 0) {
        //初始化一个confirm
        customDialog.dialogFram('manageConfirm', 'confirm');
        //绑定confirm显示事件
        confirmFlag.on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            customDialog.setDialog(this, 'manageConfirm', confirmOkFun);

        });
    }

    //confirm 回调函数
    function confirmOkFun(data) {
        console.log('确认定稿');
        console.log(data);
        try {
            data = $.parseJSON(data);
        } catch (e) {
        }
        //显示信息

        if (data.error === 0) {
            console.log('成功定稿');
            load.showLoad(data.message, 'load-success', '2500');
            //定稿dom操作
            chooseWorkFinal();
        } else {
            console.log('定稿出错');
            load.showLoad(data.message, 'load-warning', '2500');
        }

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
                offerDetail.width('40%').html('<div class=\"noDate\"><div class=\"noData-inner\"><img src=\"/expo/expo/center/img/listload.gif\" /><p>数据载入中...</p></div></div>');
                //获取数据
                $.ajax({type: 'get', url: thisTargetUrl})
                    .then(setOfferDetail, function (e) {
                        //获取失败，处理
                        offerDetail.html('<div class=\"noDate\"><img src=\"/expo/expo/center/img/error.png\" /><p>获取数据失败，请重试！</p></div>');
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
                offerDetail.append('<div class=\"noDate\"><div class=\"noData-inner\"><img src=\"/expo/expo/center/img/listload.gif\" /><p>提交中...</p></div></div>');
                //处理url
                $.ajax({type: 'get', url: thisUrl})
                    .then(function (data) {
                        try {
                            data = $.parseJSON(data);
                        } catch (e) {
                        }

                        if (data.error === 0) {
                            //返回成功
                            load.showLoad(data.message, 'load-success', 2500);
                            offerDetail.find('.noDate').html('<div class=\"noData-inner\"><img src=\"/expo/expo/center/img/success.png\" /><p>' + data.message + '</p></div>');
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
                            load.showLoad(data.message, 'load-warning', 2500);
                            offerDetail.find('.noDate').html('<div class=\"noData-inner\"><img src=\"/expo/expo/center/img/error.png\" /><p>' + data.message + '</p></div>');
                            if (typeof timer !== 'undefined') {
                                clearTimeout(timer);
                            }
                            timer = setTimeout(function () {
                                //定稿失败
                                offerDetail.find('.noDate').remove();
                            }, 1000);

                        }
                    }, function (e) {
                        load.showLoad('网络异常', 'load-warning', 2500);
                    });
            });
            //二次报价
            offerPanelTwice.on('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                var thisUrl = $(this).attr('href');
                offerDetail.append('<div class=\"noDate\"><div class=\"noData-inner\"><img src=\"/expo/expo/center/img/listload.gif\" /><p>提交中...</p></div></div>');
                $.ajax({type: 'get', url: thisUrl})
                    .then(function (data) {
                        try {
                            data = $.parseJSON(data);
                        } catch (e) {
                        }

                        if (data.error === 0) {
                            //返回成功
                            load.showLoad(data.message, 'load-success', 2500);
                            //提交二次报价成功后操作
                            offerDetail.find('.noDate').html('<div class=\"noData-inner\"><img src=\"/expo/expo/center/img/success.png\" /><p>' + data.message + '</p></div>');
                            if (typeof timer !== 'undefined') {
                                clearTimeout(timer);
                            }
                            timer = setTimeout(function () {
                                //方法迭代设置
                                setOfferDetail(detailData);
                            }, 1000);

                        } else {
                            //返回失败
                            load.showLoad(data.message, 'load-warning', 2500);
                            offerDetail.find('.noDate').html('<div class=\"noData-inner\"><img src=\"/expo/expo/center/img/error.png\" /><p>' + data.message + '</p></div>');
                            if (typeof timer !== 'undefined') {
                                clearTimeout(timer);
                            }
                            timer = setTimeout(function () {
                                //二次报价错误
                                offerDetail.find('.noDate').remove();
                            }, 1000);
                        }
                    }, function (e) {
                        load.showLoad('网络异常', 'load-warning', 2500);
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
        designerWorksContent.html('<div class=\"noDate\"><img src=\"/expo/expo/center/listload.gif\" /><p>定稿中...</p></div>');
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
                designerWorksContent.html('<div class=\"noDate\"><img src=\"/expo/expo/center/img/error.png\" /><p>拉取数据失败，刷新重试！</p></div>');
            });
        //设计稿区 END
        //签单流程区开始
        orderFlow.addClass('now');
        getOrderFlow();

    }

    //签单区数据获取
    setFlowPanel();
    function getOrderFlow() {
        var orderFlowUrl = orderFlow.data('workfinalurl');
        orderFlow.html('<div class=\"noDate\"><img src=\"/expo/expo/center/img/listload.gif\" /><p>载入中...</p></div>');
        $.ajax({type: 'get', url: orderFlowUrl})
            .then(function (data) {
                orderFlow.html(data);
                //设置flowProgress宽度
                setOrderProgress();
                //设置slidePanel响应事件
                setFlowPanel();

            }, function (e) {
                orderFlow.addClass('now').html('<div class=\"noDate\"><img src=\"/expo/expo/center/img/error.png\" /><p>拉取开工信息失败，刷新重试！</p></div>');
            });
    }

    //设置slidePanel响应事件
    function setFlowPanel() {
        var orderFlowItem = $('.order-flow-list-item');
        //初始化签单流程项目
        orderFlowItem.find('[data-custom="slidePanel"]').on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            customDialog.setSlidePanel(this, 'manageSlidePanel', function (status, data) {
                console.log('order-flow-list-item：' + status);
            });
        });
    }

    //slideMenu 中的 slidePanel 事件(个人信息/发票信息/管理人员)
    //定义form提示
    function setFromTip(inputCon) {
        inputCon.find('input,textarea').focus(function () {
            $(this).parent().siblings('.help-block').removeClass('success').addClass('error').html('<span class=\"glyphicon glyphicon-warning-sign\"></span>' + $(this).attr('placeholder'));
        }).blur(function () {
            if ($(this).val() !== '') {
                $(this).parent().siblings('.help-block').removeClass('error').addClass('success').html('<span class=\"glyphicon glyphicon-ok\"></span>');
            }
        });
    }

    //个人信息（#slideInfomation） 发票信息（#slideInvoice） 管理人员（#slideStaff）
    munuSlide.find('a[data-custom="slidePanel"]').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        customDialog.setSlidePanel(this, 'manageSlidePanel', infoFormEvent);
    });
    //绑定 btnGroup 的btn事件
    $('.manage-order-btnGroup').find('.btn').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        customDialog.setSlidePanel(this, 'manageSlidePanel', infoFormEvent);
    });

    function infoFormEvent() {
        var manageSlidePanel = $('#manageSlidePanel'), manageSlidePanelForm = manageSlidePanel.find('form');
        //绑定关闭事件
        manageSlidePanelForm.find('#offerPanelClose').on('click', function () {
            customDialog.slidePanelHide('manageSlidePanel');
        });
        //绑定focus/blur提示事件
        var inputCon = manageSlidePanelForm.find('.manage-form-item');
        setFromTip(inputCon);

        //处理radio事件
        /**
         *定义一个upload项目，由myUploader回传实例，用于下面的与表单同步上传功能
         * @type {JQuery|jQuery|Array}
         * invoiceType 发票种类选择
         * invoiceCon 增值税发票特殊要求
         * uploaderFlag 是否初始化uploader组件成功 (boolean)
         */
        var invoiceType = $('#invoiceType'), invoiceCon = $('#invoiceCon'), uploaderFlag;
        if (invoiceType.length !== 0) {
            console.log('radio');
            invoiceType.find('input').change(function () {
                var radioVal = invoiceType.find('input:checked').val();
                console.log(radioVal);
                //console.log(invoiceCon);
                if (radioVal == 0) {
                    invoiceCon.slideUp(300);
                }
                if (radioVal == 1) {
                    invoiceCon.slideDown(300);
                    //引用初始化上传控件
                    uploaderFlag = customUpload.init();
                    //提交表单
                    submitInfoForm(manageSlidePanelForm, uploaderFlag);
                }

            });
        } else {
            uploaderFlag = customUpload.init({listCon: '.designerWork-list', btnCls: '.designerPicker'});
        }

        //处理 remove-this 功能
        var removeThis = manageSlidePanel.find('a.remove-this');
        if (removeThis.length !== 0) {
            removeThis.on('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                delPicListItem($(this));
            });
        }

        //处理上传提交文件


        //引入二级联动方法
        var areaSelect = $('[data-custom="area"]');
        console.log(areaSelect);
        if (areaSelect.length !== 0) {
            setArea(areaSelect);
        }

        //dataPicker实现
        setDataPick();

        //管理人员 改密/删除 功能
        //删除人员
        var formConfirmFlag = manageSlidePanel.find('[data-custom="confirm"]');
        console.log(formConfirmFlag);
        if (formConfirmFlag.length !== 0) {
            //初始化confirm
            customDialog.dialogFram('manageConfirm', 'confirm');

            //绑定confirm显示事件
            formConfirmFlag.on('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                var _this = $(this).parent().parent();
                customDialog.setDialog(this, 'manageConfirm', function (data) {
                    console.log(data);
                    //管理人员修改删除
                    try {
                        data = $.parseJSON(data);
                    } catch (e) {
                    }

                    if (data.error == 0) {
                        load.showLoad(data.message, 'load-success', 2500);
                        _this.animate({opacity: 0}, 1000, function () {
                            _this.remove();
                        });
                    } else {
                        load.showLoad(data.message, 'load-warning', 2500);
                    }

                });

            });
        }

        //修改人员
        var formChangeFlag = manageSlidePanel.find('[data-custom="change"]');
        if (formChangeFlag.length !== 0) {
            formChangeFlag.on('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                var _this = $(this).parent().siblings('span');

                manageSlidePanelForm.find('#ppUid').val($(_this[0]).text());
                manageSlidePanelForm.find('#ppUser').val($(_this[1]).text());
                manageSlidePanelForm.find('#ppName').val($(_this[2]).text());
                manageSlidePanelForm.find('#ppTel').val($(_this[3]).text());

            });
        }

        //提交表单
        submitInfoForm(manageSlidePanelForm, uploaderFlag);

    }

    //添加订单-需要设计
    $('.manage-panel-inner').find('[data-custom="dialog"]').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        customDialog.setDialog(this, 'manageDialog', dialogFormCallback);
    });
    //修改订单
    $('.manage-order-info').find('[data-custom="dialog"]').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        customDialog.setDialog(this, 'manageDialog', dialogFormCallback);
    });

    //订单dialog回调
    function dialogFormCallback(status) {
        //dialog提交订单
        console.log(status);
        //绑定input提示信息
        var manageDialog = $('#manageDialog'), manageDialogForm = manageDialog.find('.manage-form'), uploaderFlag;
        var inputCon = manageDialogForm.find('.manage-form-item');
        setFromTip(inputCon);

        //dataPicker实现
        setDataPick();

        //处理表单提交
        submitDialogForm(manageDialogForm, uploaderFlag);

    }

    //dialog提交表单方法
    function submitDialogForm(dialogForm, uploaderFlag) {
        //定义timer
        var timer;
        //兼容IE
        if (navigator.userAgent.indexOf('MSIE') > 0) {
            //是IE
            dialogForm.attr('onsubmit', 'return false;').find('#offerPanelSubmit').off('click').on('click', function () {
                uploadPic();
            });
        } else {
            //不是IE
            dialogForm.off('submit').on('submit', function (e) {
                e.preventDefault();
                e.stopPropagation();
                uploadPic();
            });

        }


        //处理上传方法
        function uploadPic() {
            /**
             * 检测uploader，如果存在：
             * ----则先提交uploader
             */
            console.log(!!uploaderFlag);
            if (!!uploaderFlag) {
                var dUpload = customUpload.uploading();

                console.log(dUpload);
                //全部上传成功
                dUpload.then(function (data) {
                    console.log('全部上传成功');
                    submitForm();
                }, function (e) {
                    console.log(e);
                });
            } else {
                submitForm();
            }


        }

        //提交方法
        function submitForm() {
            var actionUrl = dialogForm.attr('action'), data = dialogForm.serialize();
            //AJAX提交表单
            $.ajax({
                type: 'post',
                url: actionUrl,
                data: data
            }).then(function (data) {

                try {
                    data = $.parseJSON(data);
                } catch (e) {
                }
                var forward = data.forward;
                if (data.error == 0) {
                    load.showLoad(data.message, 'load-success');
                    if (!!forward) {
                        /**
                         * 若forward 存在，则后台get forward数据，成功后跳转（为了增加交互效果）
                         */
                        console.log(forward);
                        $.get(forward).then(function () {
                            if (typeof timer !== 'undefined') {
                                clearTimeout(timer);
                            }
                            timer = setTimeout(function () {
                                window.location.href = forward;
                            }, 2000);
                        }, function (e) {
                            if (!!timer) {
                                clearTimeout(timer);
                            }
                            timer = setTimeout(function () {
                                load.showLoad('跳转发生错误，请检测网络后刷新重试！', 'load-warning', 2500);
                            }, 2000);

                        });


                    }

                } else {
                    load.showLoad(data.message, 'load-warning', 2500);
                }

            }, function (e) {
                //提交失败
                load.showLoad('网络错误，请刷新重试！', 'load-warning', 2500);
            });
        }

    }

    //slidePanel提交表单方法
    function submitInfoForm(theForm, uploaderFlag) {

        //处理提交个人信息表单
        /**
         * 兼容IE方案：
         * 判断：
         * 若IE，则表单添加onsubmit="return false;"阻断默认表单提交,然后绑定确定按钮click事件
         * 非IE，则绑定submit事件提交
         */

        if (navigator.userAgent.indexOf('MSIE') > 0) {
            //是IE
            theForm.attr('onsubmit', 'return false;').find('#offerPanelSubmit').off('click').on('click', function () {
                uploadPic();
            });
        } else {
            //不是IE
            theForm.off('submit').on('submit', function (e) {
                e.preventDefault();
                e.stopPropagation();
                uploadPic();
            });

        }

        function uploadPic() {
            /**
             * 检测uploader，如果存在：
             * ----则先提交uploader
             */

            console.log(!!uploaderFlag);
            if (!!uploaderFlag) {
                var dUpload = customUpload.uploading();

                console.log(dUpload);
                //全部上传成功
                dUpload.then(function (data) {
                    console.log('全部上传成功');
                    submitInfo();
                }, function (e) {
                    console.log(e);
                });
            } else {
                submitInfo();
            }


        }


        //提交方法
        function submitInfo() {
            var actionUrl = theForm.attr('action'), data = theForm.serialize();
            console.log(data);
            //AJAX提交表单
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
                    load.showLoad(data.message, 'load-success', 2500);
                    if (typeof timer !== 'undefined') {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(function () {
                        customDialog.slidePanelHide('manageSlidePanel');
                    }, 2000);

                } else {
                    load.showLoad(data.message, 'load-warning', 2500);
                }

            }, function (e) {
                //提交失败
                load.showLoad('网络错误，请刷新重试！', 'load-warning', 2500);
            });
        }

        //提交方法 END

    }


    //订单第二步：填写需求或上传设计稿
    //判断OEM或定制
    var chooseOem = $('[data-custom="chooseOem"]');
    if (chooseOem.length !== 0) {
        chooseOem.on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            console.log(this);
            var chooseOemBtn = $(this), dataUrl = chooseOemBtn.attr('href'), btnText = chooseOemBtn.html();
            //显示loading状态
            chooseOemBtn.html('<div class=\"noDate\"><div class=\"noData-inner\"><img src=\"/expo/expo/center/img/listload.gif\" /><h2>loading...</h2></div></div>');
            $.get(dataUrl).then(function () {
                window.location.href = dataUrl;
            }, function (e) {
                load.showLoad('网络错误，请刷新重试！', 'load-warning', 2500);
                chooseOemBtn.html(btnText);
            });
        });
    }

    //isOem 判断 OEM页面开始绑定上传按钮
    var isOem = $('[data-custom="isOem"]');
    if (isOem.length !== 0) {
        //上传按钮容器
        var manageOrderPanelBtn = $('.manage-order-panelBtn');
        //绑定上传设计稿 上传设计稿初始化方法
        var setUploadDesignerWork = customUpload.init({
            listCon: '.designerWork-list',
            btnCls: '.designerPicker'
        });
        //pin底部按钮
        manageOrderPanelBtn.pinDown({offsetH: 20, offsetW: 20});

        //绑定上传动作
        if (!!setUploadDesignerWork) {

            manageOrderPanelBtn.find('.btn').on('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                var that = $(this);
                that.text('上传中...');
                customUpload.uploading().then(function () {
                    //上传成功后提交表单
                    var thisForm = $('#oemUploadForm');
                    $.ajax({
                        type: 'post',
                        url: thisForm.attr('action'),
                        data: thisForm.serialize()
                    }).then(function (data) {
                        //格式化数据
                        try {
                            data = $.parseJSON(data);
                        } catch (e) {
                        }
                        if (data.error == 0) {
                            load.showLoad(data.message, 'load-success');
                            //forward 是下一个页面跳转地址
                            if (!!data.forward) {
                                $.get(data.forward).then(function () {
                                    if (!!timer) clearTimeout(timer);
                                    timer = setTimeout(function () {
                                        window.location.href = data.forward;
                                    }, 2000);
                                }, function (e) {
                                    load.showLoad(data.message, 'load-warning', 2500);
                                    that.text('重新提交');
                                });
                            }

                        } else {
                            load.showLoad(data.message, 'load-warning', 2500);
                            that.text('重新上传');
                        }
                    });
                }, function (e) {
                    load.showLoad('有文件上传失败，请重新上传', 'load-warning', 2500);
                    that.text('重新上传');
                });
            });
        }

        //删除按钮事件
        isOem.find('a.remove-this').on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            delPicListItem($(this));
        });


    }

    //通用dataPicker实现
    function setDataPick() {
        var dataPicker = $('[data-custom="datepicker"]');
        if (dataPicker.length !== 0) {
            //判断endTime的开始时间
            var startData = dataPicker.find('#startData').val() || 'tody';

            //datapicker实例
            dataPicker.datepicker({
                startDate: startData,
                language: "zh-CN",
                keyboardNavigation: false,
                autoclose: true
            });
            //实例 END
        }
    }

    //通用二级联动
    function setArea(obj) {
        /**
         * areaJson 获取数据连接
         * 当province选择时，异步get城市数据：请求命令 ?province*
         */

        var areaJson = obj.data('areaurl'), provinceInp = obj.find('#province'), cityInp = obj.find('#city');
        $.get(areaJson).then(function (data) {
            console.log(data);
            try {
                data = $.parseJSON(data);
            } catch (e) {
            }

            //引入省份
            setProvince(data.province);
            provinceInp.change(function () {
                $.get(areaJson + '?province=' + provinceInp.val()).then(function (data) {
                    try {
                        data = $.parseJSON(data);
                    } catch (e) {
                    }
                    //引入城市
                    setCity(data.city);
                });
            });

        });

        //设置省份（province）方法
        function setProvince(proData) {

            var content = '';
            $.each(proData, function (i, value) {
                content = content + '<option value=\"' + i + '\">' + value + '</option>';
            });
            provinceInp.html(content);
        }

        //设置城市（city）方法
        function setCity(ctData) {
            if ($.isArray(ctData)) {
                var content = '';
                $.each(ctData, function (i, value) {
                    content = content + '<option value=\"' + i + '\">' + value + '</option>';
                });
                cityInp.html(content);
            }

        }

    }

    //订单问询表
    var officeForm = $('.office-form');
    if (officeForm.length !== 0) {
        //启用表单底部pin
        officeForm.find('.manage-order-panelBtn').pinDown({offsetH: 20, offsetW: 20});
    }

    //OEM编辑列表
    //var picListEdit = $('[data-custom="picListEdit"]');
    //if (picListEdit.length !== 0) {
    //    picListEdit.find('a.remove-this').on('click', function (e) {
    //        e.stopPropagation();
    //        e.preventDefault();
    //        delPicListItem($(this));
    //    });
    //
    //}

    //通用图片列表删除方法
    function delPicListItem(thisRemoveBtn) {
        $.get(thisRemoveBtn.attr('href')).then(function (data) {
            try {
                data = $.parseJSON(data);
            } catch (e) {
            }
            if (data.error == 0) {
                load.showLoad(data.message, 'load-success', 2500);
                thisRemoveBtn.parent().animate({opacity: 0, width: 0}, 500, function () {
                    thisRemoveBtn.parent().remove();
                });
            } else {
                load.showLoad(data.message, 'load-warning', 2500);
            }
        }, function (e) {
            load.showLoad('网络错误，请重试！', 'load-warning', 2500);
        });
    }

    //通用退出方法
    var myQuit = $('[data-custom="quit"]');
    if (myQuit.length !== 0) {
        myQuit.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $.get($(this).attr('href')).then(function (data) {
                try {
                    data = $.parseJSON(data);
                } catch (e) {
                }
                if (data.error == 0) {
                    load.showLoad(data.message, 'load-success', 2500);
                    if (!!data.forward) {
                        $.get(data.forward).then(function () {
                            if (!!timer) clearTimeout(timer);
                            timer = setTimeout(function () {
                                window.location.href = data.forward;
                            }, 2000);

                        });
                    }

                } else {
                    load.showLoad(data.message, 'load-warning', 2500);
                }
            }, function (e) {

            });
        });
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