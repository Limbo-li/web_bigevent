$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    //定义一个查询的参数对象，将来请求数据的时候需要将请求数据对象提交到服务器
    //定义美化时间过滤器
    template.defaults.imports.dataFormat = function(date) {
            const dat = new Date(date)

            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())

            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())
            return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ':' + ss
        }
        //定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    var q = {
        pagenum: 1, //页码值为一
        pagesize: 2,
        cate_id: '', //文章分类的id
        state: '' //文章的状态
    }


    initTable()
    initCate()

    //获取文章列表请求
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                layer.msg('获取文章列表成功')
                    // console.log(res);

                var htmlStr = template('tpl_table', res)
                $('tbody').html(htmlStr)
                    //调用分页
                renderPage(res.total)
            }
        })
    }
    //初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            URL: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败')
                }
                layer.msg('获取分类成功')
                    //调用模板引擎
                var htmlStr = template('tpl-cate', res)
                    //console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
            e.preventDefault()
                //获取表单中选项的值
            var cate_id = $('[name=cate_id]').val()
            var state = $('[name=state]').val()
                //为查询参数q赋值
            q.cate_id = cate_id
            q.state = state
                //根据条件渲染页面
            initTable()
        })
        //定义渲染分页
    function renderPage(total) {
        //调用laypage.render（）方法
        laypage.render({
            //分页容器id
            elem: 'pageBox',
            //总条数
            count: total,
            //每页显示几条数据
            limit: q.pagesize,
            //设置默认选中的页码
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页发生切换是触发jump
            jump: function(obj, first) {
                //console.log(obj.curr);
                //把最新的页码值赋值到q这个对象中
                q.pagenum = obj.curr
                    //把最新的条目数赋值到q查询参数对象中
                q.pagesize = obj.limit
                    //最新的q获取列表
                    //1.点击页码时候触发jump
                    //2.调用laypage.render方法触发jump回调
                if (!first) {
                    initTable()
                }
            }
        })

    }
    //通过代理绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var len = $('.btn-delete').length
            //获取到的文章
        var id = $(this).attr('data-id')
        layer.confirm('是否删除', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/:id',
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index);

        })
    })
})