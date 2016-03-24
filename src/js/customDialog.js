/**
 * 使用样式
 * <a href="#" data-toggle="tooltip" data-custom="confirm" title="确认删除信息" data-confirm-content="确定需要删除吗？" data-mywidth="400px">测试confirm</a>
 * @param id 初始化弹窗并设置一个id
 * @param type 弹窗样式：dialog 或 confirm
 */

//初始化容器
function dialogFram(id,type) {
    var content = '';
    content = content + '<div class=\"modal fade\" id=\"' + id + '\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myDialogLabel\" aria-hidden=\"true\">';
    content = content + '<div class=\"modal-dialog\">';
    content = content + '<div class=\"modal-content\">';
    content = content + '<div class=\"modal-header\">';
    content = content + '<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>';
    content = content + '<h4 class=\"modal-title\" id=\"myDialogLabel\"></h4>';
    content = content + '</div>';
    content = content + '<div class=\"modal-body\"></div>';

    if(type === 'confirm'){
        content = content + '<div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">关闭</button><button type=\"button\" class=\"btn btn-primary\" id=\"confirmOk\">确认</button></div>';
    }

    content = content + '</div></div></div>';

    $('body').append(content);
}

//设置弹窗属性
function setDialog(obj,id) {
    /**
     * 定义全局方法
     * @param action 数据连接地址
     * @param title 弹出框标题
     * @param mywidth   弹框宽度
     * @param id    设置dialogId
     */

    var action = $(obj).data('action');
    var title = $(obj).attr('title');
    var mywidth = $(obj).data('mywidth');
    var confirmContent = $(obj).data('confirm-content');
    var dialog = $('#' + id);

    //兼容a标签和button标签
    if (action === '' || typeof action === 'undefined') {
        action = $(obj).attr('href');
    }
    if (title === '' || typeof title === 'undefined') {
        title = $(obj).data('original-title');
    }

    console.log(action + ' | ' + title + ' | ' + mywidth + ' | ' + dialog);
    //设置宽高
    if (typeof mywidth !== 'undefined') {
        dialog.find('.modal-dialog').css('width', mywidth);
    }

    //设置标题
    dialog.find('.modal-title').html(title);

    //显示dialog
    dialog.modal('show');

    if(confirmContent ==='' || typeof confirmContent === 'undefined'){
        //显示占位
        dialog.find('.modal-body').html('<div class=\"noDate\"><img src=\"../img/listload.gif\" /><p>数据载入中...</p></div>');
        //获取并设置内容
        $.ajax({
            url: action,
            type: 'get',
            cache: false
        }).done(function (data) {
            //console.log(data);
            dialog.find('.modal-body').html(data);
        });
    }else{
        dialog.find('.modal-body').html(confirmContent);
    }

}


