/**
 * Created by feng on 2016/3/22.
 */
$(function () {
    //处理提示工具
    var popoverElements = $('[data-toggle="popover"]');
    popoverElements.popover({html:true,placement:'top'}).click(function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
    popoverElements.hover(function () {
        $(this).popover('show');
    }, function () {
        $(this).popover('hide');
    });

    //设计稿隐藏显示
    /**
     * 每个订单tr上必须标有：data-orderid=订单id，设计稿tr上必须有对应的orderid 类
     * @type {*|jQuery|HTMLElement}
     */
    //订单全选
    var itemTr = $('.manage-panel-item .table tr'), allOrder =$('#allOrder') ,allorderItem = itemTr.find('[type="checkbox"]');
    allOrder.on('click', function () {
        console.log(allorderItem);
        if(!$(this).prop('checked')){
            allorderItem.each(function () {
                $(this).prop('checked',false);
            });
        }else{
            allorderItem.each(function () {
                $(this).prop('checked',true);
            });
        }
    });
    //订单选中事件
    itemTr.on('click', function () {
        console.log('tr click');
        var id = $(this).data('orderid');
        var thisTr = $(this).find('#'+id);
        if(thisTr.length !== 0){
            allOrder.prop('checked',false);
            if(!thisTr.prop('checked')){
                thisTr.prop('checked',true);
                $(this).addClass('on');
            }else{
                thisTr.prop('checked',false);
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
        if(typeof siblingsId !== 'undefined'){
            if(!parentsR.hasClass('orderIn')){
                parentsR.addClass('orderIn').siblings('.'+siblingsId).show(500);
            }else{
                parentsR.removeClass('orderIn').siblings('.'+siblingsId).hide(500);
            }
        }
        console.log(siblingsId);

    });
    //上传设计稿
    itemTr.find('[data-custom="uploadWorks"]').on('click', function (e) {
        e.stopPropagation();
    });
});