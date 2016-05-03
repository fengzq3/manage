/**
 * Created by Feng on 2016/4/28.
 */

$(function () {

    //图片移动
    var guildBgP = $('#guildBgP'), guildPerson = $('.guild-person');

    //初始载入
    var durTime = (200 * $(document).width())/100;
    guildPerson.addClass('guild-start').animate(
        {left: '20%'},
        {
            duration: durTime,
            easing: 'linear',
            complete: function () {
                setp1();
            }
        }
    );

    //进入flow

    function setp1() {
        guildPerson.removeClass('guild-start');
        $('.guild-setp1').delay(1000).animate({bottom: '-20px'}, {
            duration: 500, easing: 'easeOutBounce'
        });
    }

});

