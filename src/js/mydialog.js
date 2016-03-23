/**
 * Created by feng on 2015/12/26.
 * 第一步：初始化一个dialog框架到页面中，备用
 * 第二步：页面按钮被点击后传入参数加载dialog body内容，并显示
 */
$(function () {
    //初始化dialog框架
    if($('#myDialog').length ===0){
        dialogFram();

        //查找可激活dialog的元素，绑定事件
        var mydialog = $('[data-mydialog]');
        mydialog.on('click', function () {
            //console.log(this);
            var id = $(this).attr('id');
            var action = $(this).data('action');
            var title = $(this).attr('title');
            var mywidth = $(this).data('mywidth');
            var fullscroll = $(this).data('fullscroll');

            setDialog(action,title,mywidth,id,fullscroll);
        });

    }




});

//定义设置数据方法
function setDialog(action,title,mywidth,id,fullscroll){
    var dialog = $('#myDialog');
    //确定全屏
    if(fullscroll !='' && typeof(fullscroll) != 'undefined' && fullscroll){
        dialog.css('overflow','hidden');
        dialog.find('.modal-dialog').css({'margin':'0 auto','width':'100%','position':'absolute'});
    }else {
        //设置宽高
        dialog.find('.modal-dialog').css('width',mywidth);
    }
    dialog.find('.modal-body').css('overflow','hidden').attr('id',id);
    //设置标题
    dialog.find('.modal-title').html(title);

    //显示dialog
    dialog.modal('show');

    //获取并设置内容
    $.ajax({
        url:action,
        type:'get',
        async:true,
        cache:false,
        success: function (data) {
            //console.log(data);
            $('#myDialog').find('.modal-body').html(data);
        }
    });

    //显示后计算高度
    //兼容全屏属性
    if(fullscroll !='' && typeof(fullscroll) != 'undefined' && fullscroll){
        var fullheight = $(window).height()-117;
        dialog.on('shown.bs.modal', function () {
            $(this).find('.factory-offer-demo').height(fullheight);
        });
    }

}


//定义dialog基本框架
function dialogFram(){
    var content = '';
    content = content + '<div class=\"modal fade\" id=\"myDialog\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myDialogLabel\" aria-hidden=\"true\">';
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