// 从layui中获取layer对象
var layer = layui.layer

// 入口函数
$(function(){
    // 获取裁剪区域的DOM元素
    var $image = $('#image');
    // 配置选项
    const options = {
        // 剪裁区的纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
     // 创建裁剪区域
     $image.cropper(options)

    //  为上传按钮绑定一个点击事件
    $('#btnChooseImage').on('click', function(){
        // 模拟文件上传事件
        $('#file').click()
    })
    // 为隐藏的文件选择文本框添加一个改变内容的事件
    $('#file').on('change', function(e){
        var filelist = e.target.files
        if(filelist.length === 0){
            return layer.msg('请选择照片!')
        }
        // 获取用户选择的文件
        var file = e.target.files[0]
        // 根据选择的文件创建一个对应的url地址
        var imgURL = URL.createObjectURL(file)
        // 将图片放入裁剪区
        $image
            .cropper('destroy')         // 销毁旧的裁剪区域
            .attr('src', imgURL)        // 重新设置图片路径
            .cropper(options)           // 重新初始化裁剪区域
    })

    // 将本地图片上传到服务器
    $("#btnUpload").on('click', function(){
        // 获取用户本地上传的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', {      // 创建一个Canvas画布
                width: 100,
                heigeht: 100
            })
            .toDataURL('image/png')             // 将画布上的内容转化为base64格式的字符串
        // 调用ajax将图片上传到服务器
        $.ajax({
            type: "post",
            url: "/my/update/avatar",
            data: {
                pic: dataURL
            },
            success: function (res) {
                if(res.status !== 0){
                    return layer.msg(res.msg)
                }
                layer.msg(res.msg)
                // 调用父页面中的方法重新获取用户信息渲染头像
                window.parent.getUserInfo()
            }
        });
    })
})