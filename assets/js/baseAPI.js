// 在调用ajax之前会调用该函数
// 通过该函数可以获取ajax中的配置对象
$.ajaxPrefilter(function(options){
    // 在发送ajax请求之前拼接一个完整路径
    options.url = 'http://127.0.0.1:8080' + options.url
    // 统一为有权限的接口设置headers请求头
    if(options.url.indexOf('/my/') !== -1){
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 发送ajax请求时不论成功/失败都会调用该函数
    // 用于当用户直接通过网址访问指定页面时的安全验证
    options.complete = function(res){
        // 根据服务器响应的数据判断用户是否登录
        if(res.responseJSON.status === 1 && res.responseJSON.msg === '身份认证失败!'){
            // 强制清空本地浏览器中的token字符串
            localStorage.removeItem('token')
            // 强制跳转到登录界面
            location.href = '/web/login.html'
        }
    }
})