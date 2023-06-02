$(function(){
    // 调用获取用户信息的函数
    getUserInfo()
    
    // 从layui中获取layer对象
    var layer = layui.layer
    
    // 给退出按钮绑定点击事件
    $('#btn_logout').on('click', function(){
        // 弹出信息提示框
        layer.confirm(
            '确定退出登录?',
            {icon: 3, title:'提示'},
            function(index){
                // 点击确定后的回调函数
                // 清空本地浏览器中存储的token字符串
                localStorage.removeItem('token')
                // 重新跳转到登录界面
                location.href = '/web/login.html'
                // 关闭提示框的弹出层
                layer.close(index)
            }
        );
    })
})

// 获取用户信息
function getUserInfo(){
    $.ajax({
        method: 'GET',
        url: "/my/userinfo",
        success: function (res) {
            if(res.status !== 0){
                return layui.layer.msg('获取用户信息失败!')
            }
            // 调用渲染用户头像的函数
            renderAvatar(res.data)
        }
    });
}

// 用于渲染用户头像
function renderAvatar(user){
    // 获取用户昵称或用户名
    var name = user.nickname || user.uname
    // 设置首页用户名称的显示
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按序渲染用户头像
    if(user.pic !== null){
        // 渲染用户头像
        $('.layui-nav-img').attr('src', user.pic).show()
        $('.text_avatar').hide()
    }else{
        // 渲染默认头像
        // 取出用户名的第一个字符并转为大写
        var first = name[0].toUpperCase()
        $('.layui-nav-img').hide()
        $('.text_avatar').html(first).show()
    }
}