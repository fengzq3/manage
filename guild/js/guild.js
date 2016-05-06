/**
 * Created by Feng on 2016/4/28.
 */

$(function () {

    //元素
    var guildBgP = $('#guildBgP'), guildPerson = $('.guild-person');
    //消息区
    var messageA = $('#messageArea');

    //初始载入 小人走入画面
    guildPerson.addClass('guild-start').animate(
        {left: '500px'},
        {
            duration: 6000,
            easing: 'linear',
            complete: setp1
        }
    );

    //进入flow
    function setp1() {
        //展开消息区
        messageA.show(500);
        //继续走动
        var moveBgA = moveBg();
        moveBgA.startMove();

        guildBgP.on('guildMove', function (e, leftL) {
            console.log(leftL);


        });


    }


    //幕布移动方法
    function moveBg() {
        var leftL =0, timer, flag = true;

        function startMove(flg) {
            if (!!flg) {
                flag = true;
            }

            leftL--;
            guildBgP.css('left', leftL);
            guildBgP.trigger('guildMove', [leftL]);
            if (leftL > -8739 && flag) {
                timer = setTimeout(startMove, 10);
            } else {
                //停止小人走路
                guildPerson.removeClass('guild-start');
                //清除定时器
                clearTimeout(timer);
                //隐藏消息框
                messageA.hide(300);
                //派发停止事件
                guildBgP.trigger('guildStop', [leftL]);
            }
        }

        function stopMove() {
            clearTimeout(timer);
            flag = false;
        }

        return {
            startMove: startMove,
            stopMove: stopMove
        }

    }


});

