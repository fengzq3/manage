/**
 * Created by feng on 2016/3/22.
 */
$(function () {
    "use strict";

    //定义全局load信息
    //初始化一个load容器
    var loadContent = '<div class=\"manage-loading\"><p class=\"loadLabel\"></p></div>', loading = $('.manage-loading');
    if (loading.length === 0) {
        $('body').append(loadContent);
        loading = $('.manage-loading');
    }
    //隐藏load信息
    function hideLoad() {
        loading.animate({top:'-50px'},300);
    }

    //显示load信息
    function showLoad(mesage, grade, time) {
        loading.addClass(grade).find('.loadLabel').html(mesage);
        loading.animate({top:0},300);
        console.log('load time:' + time);
        if (typeof time !== 'undefined') {
            setTimeout(hideLoad, time);
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
    hideSlide.on('click', function () {
        manageContent.css('left', 0);
        munuSlide.animate({
            'left': '-180px'
        }, 100, function () {
            mynuSlideFlag.css('left', 0);
        });
    });
    mynuSlideFlag.on('click', function () {
        manageContent.css('left', '180px');
        mynuSlideFlag.animate({
            'left': '-3em'
        }, 100, function () {
            munuSlide.css('left', 0);
        });
    });

    //设计稿隐藏显示
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
        dialogFram('manageDialog','dialog');
        //绑定事件
        dialogFlag.on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            setDialog(this, 'manageDialog');

        });

    }
    //全局confirm
    var confirmFlag = $('[data-custom="confirm"]');
    if(confirmFlag.length !== 0){
        //初始化一个confirm
        dialogFram('manageConfirm','confirm');
        //绑定confirm显示事件
        confirmFlag.on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            setDialog(this,'manageConfirm');
        });
        //绑定点击确认事件
        var manageConfirm = $('#manageConfirm');
        $('#confirmOk').on('click', function () {
            console.log('确认弹窗');
            //TODO 确认后操作
            manageConfirm.modal('hide');
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


});