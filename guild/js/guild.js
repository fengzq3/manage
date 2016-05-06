/**
 * Created by Feng on 2016/4/28.
 */

$(function () {

    //元素
    var guildBgP = $('#guildBgP'), guildPerson = $('.guild-person');

    //初始载入 小人走入画面
    //根据移动距离计算时间
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
        //停止走动
        //guildPerson.removeClass('guild-start');
        //step1
        var step = [], i = 0;
        step[0] = $('#setp1');
        step[1] = $('#setp1-1');
        step[2] = $('#setp1-2');
        step[3] = $('#setp1-3');
        step[4] = $('#setp2');
        step[5] = $('#setp2-1');
        step[6] = $('#setp2-2');
        step[7] = $('#setp3');
        step[8] = $('#setp3-1');
        step[9] = $('#setp3-2');


        //继续走动
        var moveBgA = moveBg();
        moveBgA.startMove();

        guildBgP.on('guildMove', function (e, leftL) {
            setActive();
            //判断元素位置
            function setActive() {
                if (i < step.length) {

                    if ((step[i].offset().left - ($(document).width() - 1200) / 2) < 600) {

                        //开始处理动作
                        if (i == 0 || i == 4 || i == 7) {
                            bounceSign(step[i]);
                        } else {
                            step[i].addClass('zoomIn').delay(1000);
                            //停止运动一秒
                            console.log('停止');
                            guildPerson.removeClass('guild-start');
                            moveBgA.stopMove();
                            //一秒后开始
                            setTimeout(function () {
                                moveBgA.startMove(true);
                                guildPerson.addClass('guild-start');
                            }, 1000);

                        }

                        //循环判断
                        i++;
                        setActive();
                    }
                } else {
                    return false;
                }

            }

        });


    }

    //弹出标牌
    function bounceSign(obj) {
        obj.animate(
            {marginBottom: 0, opacity: 1},
            {
                duration: 500,
                easing: 'easeOutBounce'
            }
        );
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
            if (leftL > -9617 && flag) {
                timer = setTimeout(startMove, 10);
            } else {
                clearTimeout(timer);
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

