/**
 * Created by feng on 2016/3/22.
 */
$(function () {
    //处理提示工具
    var popoverElements = $('[data-toggle="popover"]');
    popoverElements.popover({html: true, placement: 'top'}).click(function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
    popoverElements.hover(function () {
        $(this).popover('show');
    }, function () {
        $(this).popover('hide');
    });

    //处理slide显示隐藏
    var hideSlide = $('.hideSlide'),munuSlide = $('.menuSlide'),mynuSlideFlag = $('.mynuSlide-flag'),manageContent = $('.manage-content');
    hideSlide.on('click', function () {
        manageContent.css('left',0);
        munuSlide.animate({
            'left':'-180px'
        },200, function () {
            mynuSlideFlag.css('left',0);
        });
    });
    mynuSlideFlag.on('click', function () {
        manageContent.css('left','180px');
        mynuSlideFlag.animate({
            'left':'-3em'
        },200, function () {
            munuSlide.css('left',0);
        });
    });

    //设计稿隐藏显示
    /**
     * 每个订单tr上必须标有：data-orderid=订单id，设计稿tr上必须有对应的orderid 类
     * @type {*|jQuery|HTMLElement}
     */
    //订单全选
    var itemTr = $('.manage-panel-item .table tr'), allOrder = $('#allOrder'), allorderItem = itemTr.find('[type="checkbox"]');
    allOrder.on('click', function () {
        console.log(allorderItem);
        if (!$(this).prop('checked')) {
            allorderItem.each(function () {
                $(this).prop('checked', false);
            });
        } else {
            allorderItem.each(function () {
                $(this).prop('checked', true);
            });
        }
    });
    //订单选中事件
    itemTr.on('click', function () {
        console.log('tr click');
        var id = $(this).data('orderid');
        var thisTr = $(this).find('#' + id);
        if (thisTr.length !== 0) {
            allOrder.prop('checked', false);
            if (!thisTr.prop('checked')) {
                thisTr.prop('checked', true);
                $(this).addClass('on');
            } else {
                thisTr.prop('checked', false);
                $(this).removeClass('on');
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

    //设置全局dialog
    var dialogFlag = itemTr.find('[data-custom="dialog"]');
    if (dialogFlag.length !== 0) {
        //初始化dialog
        dialogFram('manageDialog');

        dialogFlag.on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            setDialog(this,'manageDialog');
        });
    }

//报价列表
    $('.shang-offer-detail').on('click', function (e) {
        e.stopPropagation();
        if($(this).hasClass('on')){
            $(this).removeClass('on');
            $(this).next('.shang-table-detail').slideUp(200);
        }else{
            $(this).addClass('on');
            $(this).next('.shang-table-detail').slideDown(200);
        }
    });
    $('.detailAll').on('click', function () {
        if($(this).hasClass('on')){
            $('.shang-table-detail').slideDown(200);
        }else{
            $('.shang-table-detail').slideUp(200);
        }
    });
    //议价
    $('.table-data tr').on('click', function () {
        var mInput = $(this).find('input[type="checkbox"]'),offerCon = $('.reOffer-inner');
        if(mInput.prop('checked')){
            $(this).removeClass('checked');
            mInput.prop('checked',false);
        }else{
            if(offerCon.children().length >= 5){
                alert("您最多选择5家工厂");
                return false;
            }
            $(this).addClass('checked');
            mInput.prop('checked',true);
        }
        //添加容器
        var offerCheck = $('.offerListForm').find('tr.checked');
        getOffer(offerCheck,offerCon);

    });
    //二次议价展示
    $('.anotherOffer').off();

    //获取数组
    function getOffer(offerCheck,offerCon){
        var content = '';

        offerCheck.each(function (i) {
            content = content + '<p class=\"col-sm-2\">'+$(offerCheck[i]).find('td a').html()+'</p>';
        });
        offerCon.html(content);
        $('.reOfferHead span').html(offerCon.children().length);
    }



    //定义设置数据方法
    function setDialog(obj,id) {
        /**
         * 定义全局方法
         * @param action 数据连接地址
         * @param title 标题
         * @param mywidth   宽度
         * @param id    设置dialogId
         * @param fullscroll 是否全屏
         */

        var action = $(obj).data('action');
        var title = $(obj).attr('title');
        var mywidth = $(obj).data('mywidth');
        var dialog = $('#' + id);

        //设置宽高
        if(typeof mywidth !== 'undefined'){
            dialog.find('.modal-dialog').css('width', mywidth);
        }

        //设置标题
        dialog.find('.modal-title').html(title);

        //显示dialog
        dialog.modal('show');

        //获取并设置内容
        $.ajax({
            url: action,
            type: 'get',
            cache: false
        }).done(function (data) {
            //console.log(data);
            dialog.find('.modal-body').html(data);
        });


    }


//定义dialog基本框架
    function dialogFram(id) {
        var content = '';
        content = content + '<div class=\"modal fade\" id=\"' + id + '\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myDialogLabel\" aria-hidden=\"true\">';
        content = content + '<div class=\"modal-dialog\">';
        content = content + '<div class=\"modal-content\">';
        content = content + '<div class=\"modal-header\">';
        content = content + '<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>';
        content = content + '<h4 class=\"modal-title\" id=\"myDialogLabel\"></h4>';
        content = content + '</div>';
        content = content + '<div class=\"modal-body\"></div>';
        content = content + '<div class=\"modal-footer\"></div>';
        content = content + '</div></div></div>';

        $('body').append(content);
    }

});