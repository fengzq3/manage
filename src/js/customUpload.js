/**
 * 自定义upload方法
 */

(function ($) {

    var uploads = [];

    window.customUpload = {
        init: function () {
            var mainCon = $('[data-custom="uploader"]');

            if (mainCon.length !== 0) {
                mainCon.each(function () {
                    uploads.push(myUploader({mainCon: this}));
                });
                return true;
            } else {
                return false;
            }

        },
        uploading: function () {

            var i = 0, d = new $.Deferred();
            /**
             * 采用递归函数来完成多个uploader实例的一次提交
             *
             * TODO 若有某个文件提交出错如何处理？
             */

            burstUpload();

            function burstUpload() {
                console.log(uploads[i]);

                uploads[i].uploader.upload();
                uploads[i].allSuccess.done(function (data) {
                    console.log('完成一次提交');
                    if (i < uploads.length - 1) {
                        i++;
                        //递归函数
                        burstUpload();
                    } else {
                        i = 0;
                        d.resolve();
                    }
                });
            }

            return d.promise();


        }
    };

    /**
     * callback 传入一个回调函数，全部上传完成后触发
     * @returns {Object}    返回
     * ---uploader      返回uploader实例，方便调用实例的其他方法
     * ---success       deferred对象 当一个文件上传成功后标记resolve，失败标记reject
     * ---allSuccess    deferred对象 当某个实例队列全部文件上传成功后标记resolve
     * @param opt {Object}  传入配置
     * ---mainCon       uploader主容器
     * ---listCon       预览图片容器
     * ---inputCon      存放回传数据，待与表单一块提交
     * ---btnCls        按钮容器
     * ---limit         上传数量限制
     */
    function myUploader(opt) {

        //处理上传参数
        var defaultOpt = {
            mainCon: '.myUploader',
            listCon: '.uploader-list',
            inputCon: '.uploader-input',
            btnCls: '.filePicker',
            limit: 0
        };
        opt = $.extend(defaultOpt, opt);

        var mainCon = $(opt.mainCon);
        var serUrl = mainCon.data('uploadurl');
        if (!serUrl) throw '请设置上传地址！';
        var limit = mainCon.data('uploadlimit') || opt.limit;
        var allSuccessPromise = new $.Deferred();

        console.log(serUrl + ' | ' + limit);
        console.log('处理webUploader');
        //console.log(mainCon);
        //设置标记
        mainCon.data('uploaderFlag', true);
        //上传采集按钮dom
        var pickBtn = mainCon.find(opt.btnCls);

        var uploader = WebUploader.create({

            // 选完文件后，是否自动上传。
            auto: false,

            // swf文件路径
            swf: '../js/Uploader.swf',

            // 文件接收服务端。
            server: serUrl,

            //可上传文件数量
            fileNumLimit: limit,

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: pickBtn,

            // 只允许选择图片文件。
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            }
        });

        // 当有文件添加进来的时候 创建缩略图
        var thumCon = mainCon.find(opt.listCon), inputCon = mainCon.find(opt.inputCon), photoUrl;

        uploader.on('fileQueued', function (file) {
            var $li = $(
                    '<div id="' + file.id + '" class="file-item thumbnail">' +
                    '<img>' +
                    '<div class="info">' + file.name + '</div>' +
                    '</div>'
                ),
                $img = $li.find('img');


            // $list为容器jQuery实例
            thumCon.append($li);

            // 创建缩略图
            // 如果为非图片文件，可以不用调用此方法。
            // thumbnailWidth x thumbnailHeight 为 100 x 100
            uploader.makeThumb(file, function (error, src) {
                if (error) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }

                $img.attr('src', src);
            }, '100', '100');
        });

        //上传状态处理
        // 文件上传过程中创建进度条实时显示。
        uploader.on('uploadProgress', function (file, percentage) {
            var $li = $('#' + file.id),
                $percent = $li.find('.progress span');

            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<p class="progress"><span></span></p>')
                    .appendTo($li)
                    .find('span');
            }

            $percent.css('width', percentage * 100 + '%');
        });

        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
        uploader.on('uploadSuccess', function (file, response) {
            $('#' + file.id).addClass('upload-state-done');
            console.log(response._raw);
            //处理返回数据
            try {
                response = $.parseJSON(response);
            } catch (e) {
            }
            //组装url存入hidden input
            if (typeof photoUrl === 'undefined') {
                photoUrl = response.photo;
            } else {
                photoUrl = photoUrl + ',' + response.photo;
            }

            //装入input
            inputCon.val(photoUrl);

            console.log(photoUrl);

            //回调
            //console.log(response);
            //if (!!successCallback) {
            //    successCallback = successCallback(response);
            //}
        });

        // 文件上传失败，显示上传出错。
        uploader.on('uploadError', function (file, reason) {
            var fileItem = $('#' + file.id),
                $error = fileItem.find('div.error');

            // 避免重复创建
            if (!$error.length) {
                $error = $('<div class="error"></div>').appendTo(fileItem);
            }

            $error.text('上传失败');
            //回调
            //if (!!errorCallback) {
            //    errorCallback = errorCallback(reason);
            //}
        });

        //检测队列失败情况
        uploader.on('error', function (e) {
            console.log(e);
            if (e === 'Q_EXCEED_NUM_LIMIT') {
                load.showLoad('添加文件数量超限', 'load-warning', 2500);
            }
            if (e === 'F_DUPLICATE') {
                load.showLoad('已经添加过该文件', 'load-warning', 2500);
            }
        });


        /**
         * 上传成功事件：
         * 对比队列和实际上传成功标记数，相等则全部上传成功
         */

        uploader.on('uploadComplete', function (file) {
            console.log('上传结束1个文件');
            // 完成上传完了，成功或者失败，先删除进度条。
            $('#' + file.id).find('.progress').remove();

        });

        uploader.on('uploadFinished', function () {
            allSuccessPromise.resolve('resolve完成' + new Date());
            //if (!!allSuccessCallback) allSuccessCallback = allSuccessCallback();
        });

        //实现webUploader END
        return {
            uploader: uploader,
            allSuccess: allSuccessPromise.promise()
        };

    }

})(jQuery);