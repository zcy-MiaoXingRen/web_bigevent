// 从layui中获取form对象
var form = layui.form
// 从layui中获取layer对象
var layer = layui.layer

// 入口函数
$(function(){
    // 自定义表单验证规则
    form.verify({
        nickname: function(value){
            if(value.length > 6){
                return '昵称长度必须在1~6个字符之间!'
            }
        }
    })

    // 调用获取用户信息的函数
    initUserInfo()

    // 重置表单数据
    $('#btnReset').on('click', function(e){
        // 阻止重置按钮的默认行为
        e.preventDefault()
        // 调用获取用户信息的函数
        initUserInfo()
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e){
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 修改用户信息
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('更新用户信息失败!')
                }
                layer.msg('更新用户信息成功!')

                // 调用父页面中的方法重新渲染用户的头像等信息
                window.parent.getUserInfo()
            }
        })
    })
})

// 初始化用户的基本信息
function initUserInfo(){
    $.ajax({
        methods: "GET",
        url: "/my/userinfo",
        success: function (res) {
            if(res.status !== 0){
                return layer.msg('获取用户信息失败!')
            }
            // 使用layui的内置方法快速为表单中的文本框赋值
            form.val('formUserInfo', res.data);
        }
    });
}