/**
 * Created by Feng on 2016/5/6.
 */
$(function () {
    var $sction = $('#section'), $s3 = $('#s3');
    $s3.find('input[type="radio"]').change(function () {
        if ($(this).val() == 1) $sction.show(300);
        if ($(this).val() == 0) $sction.hide(300);
    });
});