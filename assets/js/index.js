$(function() {
    getUserinfo()
})
var layer = layui.layer
$('#btnLogout').on('click', function() {
    //提示用户是否退出
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
        //do something
        //清除本地存储的 token
        localStorage.removeItem('token')
            //重新跳转登录页年
        location.href = '/login.html'
            //关闭confirm
        layer.close(index);
    });

})

function getUserinfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户列表失败')
                }
                //调用renderAvatar渲染用户头像
                renderAvatar(res.data)
            }
            //不论成功失败都会调用complete
            // complete: function(res) {
            //     //在complete回调函数中可以使用res.responseJSON拿到服务器响应回来的数据
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //         //清空token
            //         localStorage.removeItem('token')
            //             //调到登录页面
            //         location.href = '/login.html'
            //     }
            // }
    })

    function renderAvatar(user) {
        var name = user.nickname || user.username
        $('#welcome').html('欢迎&nbsp&nbsp' + name)
        if (user.user_pic !== null) {
            //渲染图片头像
            $('.layui-nav-img').attr('src', user.user_pic).show()
            $('.text-avater').hide()
        } else {
            //渲染文本头像
            $('.layui-nav-img').hide()
            var first = name[0].toUpperCase()
            $('.text-avater').html(first).show()
        }
    }
}