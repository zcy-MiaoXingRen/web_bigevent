$(function(){
    // 从layui中获取form对象
    var form = layui.form
    // 从layui中获取layer对象
    var layer = layui.layer


    // 点击去注册账号的链接
    $('#link_reg').on('click', function(){
        $('.login_box').hide()
        $('.reg_box').show()
    })
    // 点击去登录的链接
    $('#link_login').on('click', function(){
        $('.reg_box').hide()
        $('.login_box').show()
    })


    // 自定义表单验证规则
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个用户名校验规则
        // value：表单的值、item：表单的DOM对象
        // 为了兼容性所有字符（包括汉字）都以unicode编码实现，\u4e00-\u9fa5是unicode编码，并且正好是中文编码的开始和结束的两个值
        uname:function(value, item){
            if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                return '用户名不能有特殊字符';
            }
            if(/(^\_)|(\__)|(\_+$)/.test(value)){
                return '用户名首尾不能出现下划线\'_\'';
            }
            if(/^\d+\d+\d$/.test(value)){
                return '用户名不能全为数字';
            }
        },
        // 自定义了一个密码校验规则
        pwd:[
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 自定义一个确认密码的校验规则
        repwd:function(value){
            // 函数中的形参获取的是确认密码框中的值
            // 获取密码框中的值，[]表示属性选择器
            var pwd = $('.reg_box [name=pwd]').val()
            if(pwd !== value){
                return '两次密码不一致!'
            }
        }
    })


    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e){
        // 阻止表单默认提交行为
        e.preventDefault()
        // 通过ajax发送post请求
        $.post(
            "/api/reguser",
            {
                uname: $('#form_reg [name=uname]').val(),
                pwd: $('#form_reg [name=pwd]').val()
            },
            function(res){
                if(res.status !== 0){
                    // 弹出错误信息提示框
                    return layer.msg(res.msg)
                }
                // 弹出成功提示框
                layer.msg('注册成功，请登录!');
                // 当点击注册按钮注册成功后跳转到登录界面
                $('#link_login').click()
            }
        )
    })


    // 监听登录表单的提交事件
    $('#form_login').submit(function(e){
        // 阻止表单默认提交行为
        e.preventDefault()
        // 通过ajax发送post请求
        $.ajax({
            type: "post",
            url: "/api/login",
            // 快速获取表单中数据
            data: $(this).serialize(),
            success: function (res) {
                if(res.status !== 0){
                    // 弹出失败提示框
                    return layer.msg('登录失败!')
                }
                // 弹出成功提示框
                layer.msg('登录成功!')
                // 将登录成功后获取的token字符串保存到localStorage中
                localStorage.setItem('token', res.token)
                // 跳转到后台主页 
                location.href = '/index.html'
            }
        });
    })
})