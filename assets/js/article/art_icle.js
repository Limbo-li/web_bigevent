$(function() {
    var layer = layui.layer
    var form = layui.form
    initArtiCateList()
        //获取文章分类列表
    function initArtiCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlstr = template('tpl-table', res)
                $('tbody').html(htmlstr)
            }
        })
    }
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
            indexAdd = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章类别',
                content: $('#dialog-add').html()
            });
        })
        //通过代理方式
    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('新增分类失败')
                    }
                    layer.msg('新增分类成功')
                        //根据索引关闭对应弹出层
                    layer.close(indexAdd)
                }
            })
        })
        //通过代理方式
    var indexEdit = null
    $('body').on('click', '.btn-edit', function() {
            indexEdit = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '修改文章类别',
                content: $('#dialog-edit').html()
            });

            var id = $(this).attr('data-id')
            $.ajax({
                method: 'GET',
                url: '/my/article/cates/' + id,
                success: function(res) {
                    form.val('form-edit', res.data)
                }
            })
        })
        //通过代理形式绑定submit
    $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新数据失败')
                    }
                    layer.msg('更新数据成功')
                    layer.close(indexEdit)
                    initArtiCateList()
                }
            })
        })
        //通过代理方式为删除绑定点击事件
    $('tbody').on('click', '.btn-deldet', function() {

        var id = $(this).attr('data-id')
        console.log(id);

        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtiCateList()
                }
            })

            // layer.close(index);
        });
    })
})