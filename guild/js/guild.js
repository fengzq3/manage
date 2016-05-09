/**
 * Created by Feng on 2016/4/28.
 */

$(function () {
    //元素
    var guildBgP = $('#guildBgP'), guildPerson = $('.guild-person'), loading = $('.guild-load');
    //载入loading
    guildBgP.find('img').load(function () {
        loading.animate(
            {opacity:0},
            {
                duration: 1000,
                easing: 'linear',
                complete: initAni
            }
        );
    });

    //退场loading
    function loadOut(){

    }

    //消息区
    var messageA = $('#messageArea');

    //初始载入 小人走入画面
    function initAni() {
        guildPerson.addClass('guild-start').animate(
            {left: '500px'},
            {
                duration: 6000,
                easing: 'linear',
                complete: step1
            }
        );
    }

    //显示消息框
    function showMessage() {
        messageA.animate(
            {top: '130px'},
            {
                duration: 500,
                easing: 'easeOutBounce'
            }
        );
    }

    //隐藏消息框
    function hideMessage() {
        messageA.animate(
            {top: '-300px'},
            {
                duration: 500,
                easing: 'easeOutBounce'
            }
        );
    }

    //小人走出可视区
    function personOut() {
        guildPerson.animate(
            {left: '1300px'},
            {
                duration: 6000,
                easing: 'linear',
                complete: hideMessage
            }
        );
    }

    guildBgP.on('guildStop', personOut);

    //进入flow
    function step1() {
        //继续走动
        var moveBgA = moveBg();
        moveBgA.startMove();
        //信息框
        showMessage();
        //停止小人摆动

        //messageA.find('h2').text('');
        showWord(['简单三步，轻松搞定展台搭建']);
        //展开消息区
        messageA.show(500);

        guildBgP.on('guildMove', function (e, leftL) {
            console.log(leftL);
            switch (leftL) {
                case -200:
                    messageA.find('h2').text('第一步：提交需求');
                    messageA.find('.message-area').empty();
                    break;
                case -500:
                    //停止走动
                    moveBgA.stopMove();
                    messageA.find('h2').text('');
                    showWord(['1、在线提交需求，只需提交一次即可让所有设计师了解', '2、手机和电脑同步，不论任何地点随时掌握状态'])
                        .then(function () {
                            moveBgA.startMove();
                        });
                    break;
                case -936:
                    messageA.find('h2').text('设计阶段');
                    messageA.find('.message-area').empty();
                    break;
                case -1136:
                    messageA.find('h2').text('');
                    showWord(['多名设计师同时出稿 快速', '全网专业大咖设计师随意选择']);
                    break;
                case -1748:
                    messageA.find('h2').text('报价阶段');
                    messageA.find('.message-area').empty();
                    break;
                case -1948:
                    messageA.find('h2').text('');
                    showWord(['平台综合评估工厂，推荐最优报价']);
                    break;
                case -2500:
                    messageA.find('h2').text('第二步：提交需求');
                    messageA.find('.message-area').empty();
                    break;
                case -2700:
                    //停止走动
                    moveBgA.stopMove();
                    messageA.find('h2').text('');
                    showWord(['1、带价选稿，多维度考评', '2、签约工厂直价，减去中间商'])
                        .then(function () {
                            moveBgA.startMove();
                        });
                    break;
                case -3000:
                    messageA.find('h2').text('工程监理');
                    messageA.find('.message-area').empty();
                    break;
                case -3200:
                    messageA.find('h2').text('');
                    showWord(['专业监理严格把控搭建质量', '搭建进度实时查看，全程透明可监控']);
                    break;
                case -4600:
                    messageA.find('h2').text('第三步：成功参展');
                    messageA.find('.message-area').empty();
                    break;
                case -4800:
                    //停止走动
                    moveBgA.stopMove();
                    messageA.find('h2').text('');
                    showWord(['1、省心省力，专业监理24小时监督', '2、资金保障，多重保险安心放心'])
                        .then(function () {
                            moveBgA.startMove();
                        });
                    break;
                case -5200:
                    messageA.find('h2').text('后期服务');
                    messageA.find('.message-area').empty();
                    break;
                case -5400:
                    messageA.find('h2').text('');
                    showWord(['快速撤展，无需展商操心']);
                    break;
                case -6000:
                    messageA.find('h2').text('');
                    showWord(['期待下次！']);
                    break;
            }

        });


    }

    //打字机效果
    function showWord(words) {
        var d = $.Deferred();
        var arrLength = words.length;
        var con = messageA.find('.message-area');
        var i = 0;

        //清空容器
        con.empty();
        //显示方法
        function showW(word) {
            var dd = $.Deferred();
            var index = 0, timer;

            console.log(word.length);

            timer = setInterval(function () {

                if (index < word.length) {
                    con.append(word.charAt(index));
                    index++;
                } else {
                    clearInterval(timer);
                    index = 0;
                    dd.resolve();
                }

            }, 50);

            return dd.promise();

        }


        //循环words
        loopWords();
        function loopWords() {

            showW(words[i]).then(function () {

                if (i < arrLength - 1) {
                    con.append('<br/>');
                    i++;
                    loopWords();
                } else {
                    d.resolve();
                }

            });
        }

        return d.promise();
    }


    //幕布移动方法
    function moveBg() {
        var leftL = 0, timer, flag = true;

        function move() {
            leftL--;
            guildBgP.css('left', leftL);
            guildBgP.trigger('guildMove', [leftL]);
            if (leftL < -6102) {
                //停止小人走路
                //guildPerson.removeClass('guild-start');
                //清除定时器
                clearInterval(timer);
                //TODO 隐藏消息框
                //messageA.hide(300);
                //派发停止事件
                guildBgP.trigger('guildStop', [leftL]);
            }
        }

        timer = setInterval(function () {
            if (flag)move();
        }, 10);

        function startMove() {
            flag = true;
            guildPerson.addClass('guild-start');
        }

        function stopMove() {
            //clearTimeout(timer);
            flag = false;
            guildPerson.removeClass('guild-start');
            //clearInterval(timer);
        }

        return {
            startMove: startMove,
            stopMove: stopMove
        }

    }


});

