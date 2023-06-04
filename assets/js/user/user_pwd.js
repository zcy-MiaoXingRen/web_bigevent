// 从layui中获取form对象
var form = layui.form;
// 从layui中获取layer对象
var layer = layui.layer;
// 入口函数
$(function () {
    form.verify({
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        // 判断新旧密码是否相同
        samePwd: function (value) {
            var oldPwd = $(".layui-form [name=oldPwd]").val();
            if (value === oldPwd) {
                return "新旧密码不能一样!";
            }
        },
        // 判断新密码和确认新密码是否相同
        rePwd: function (value) {
        // 获取新密码
            var newPwd = $(".layui-form [name=newPwd]").val();
            if (value !== newPwd) {
                return "两次密码不一致!";
            }
        }
    })
    // 发送ajax请求
    $('.layui-form').on('submit', function(e){
        // 阻止表单的默认提交行为
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if(res.status !== 0){
                    return layer.msg(res.msg)
                }
                layer.msg(res.msg)
                // 重置表单内容
                $('.layui-form')[0].reset()
            }
        });
    })
})
