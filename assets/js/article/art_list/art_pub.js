$(function() {
    var layer = layui.layer
    var form = layui.form
        //初始化富文本
    initEditor()
        //调用初始化文章分类
    initCate()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
        //绑定btnchooseimage点击事件
    $('#btnchooseimage').on('click', function() {
            $('#coverfile').click()
        })
        //监听coverfile的change事件
    $('#coverfile').on('change', function(e) {
            //获取文件列表数组
            var files = e.target.files
                //判断用户是否选择文件
            if (files.length === 0) {
                return
            }
            //根据文件创建地址
            var newImgURL = URL.createObjectURL(files[0])
                //为裁剪区设置图片
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        //定义文章发布状态
    var art_state = '已发布'
        //为存为草稿添加事件处理函数
    $('#btnsave2').on('click', function() {
            art_state = '草稿'
        })
        //为表单绑定submit提交事件
    $('#form_pub').on('submit', function(e) {
            //阻止表单默认提交行为
            e.preventDefault()
                //创建一个FormData对象
            var fd = new FormData($(this)[0])
                //将文章发布状态存到fd
            fd.append('state', art_state)
                //将封面裁剪后的图片输出位一个对象
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) {
                    // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    fd.append('cover_img', blob)
                        //发起ajax数据请求
                    publishArticle(fd)
                })
        })
        //发布文章的函数
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //如果想数据提交FormData格式数据必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                    //跳转到文章列表页
                location.href = '/article/art_list/art_list.html'
            }
        })
    }
})