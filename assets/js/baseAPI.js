// 在调用ajax之前会调用该函数
// 通过该函数可以获取ajax中的配置对象
$.ajaxPrefilter(function(options){
    // 在发送ajax请求之前拼接一个完整路径
    options.url = 'http://127.0.0.1:8080' + options.url
})