// 从layui中获取form对象
var form = layui.form
// 从layui中获取layer对象
var layer = layui.layer

// 入口函数
$(function(){
    // 调用加载文章分类的函数
    initCate()

    // 初始化富文本编辑器
    initEditor()

    // 获取裁剪区域的DOM元素
    var $image = $('#image');
    // 配置选项
    const options = {
        // 纵横比
        aspectRatio: 400 / 280,
        // 指定预览区域
        preview: '.img-preview'
    };
    // 创建裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮绑定点击事件
    $('#btnChooseImage').on('click', function(){
        // 模拟文件选择框的行为
        $('#coverFile').click()
    })

    // 获取用户选择的文件列表
    $('#coverFile').on('change', function(e){
        // 获取文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if(files.length === 0){
            return 
        }
        // 根据文件创建对应的url地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')             // 销毁旧的裁剪区域
            .attr('src', newImgURL)        // 重新设置图片路径
            .cropper(options)               // 重新初始化裁剪区域
    })

    // 定义一个变量用于存放文章的发布状态
    var art_state = '已发布'

    // 为存为草稿按钮绑定点击事件
    $('#btn_save').on('click', function(){
        // 改变文章的发布状态
        art_state = '草稿'
    })

    // 为表单绑定提交事件
    $('#form_pub').on('submit', function(e){
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 基于form表单快速创建一个FormData格式的查询参数对象
        var fd = new FormData($(this)[0])
        // 将文章的发布状态存到查询参数对象中
        fd.append('state', art_state)

        // 将裁剪的图片输出为一个文件对象
        $image.cropper('getCroppedCanvas',
            {
                // 创建一个Canvas画布存放裁剪的图片
                width: 400,
                height: 200
            }).toBlob(function(blob){
                // 将画布上的图片转化为文件对象
                // 将获取的文件对象存放到查询参数对象中
                fd.append('img', blob)

                // 调用发布文章的函数
                publishArticle(fd)
            })
    })
})


// 定义加载文章分类的方法
function initCate(){
    $.ajax({
        type: "GET",
        url: "/my/article/cates",
        success: function (res) {
            if(res.status !== 0){
                return layer.msg(res.msg)
            }
            // 调用模板引擎渲染文章分类的下拉菜单
            var htmlStr = template('tpl_cate', res)
            $('[name=cate_id]').html(htmlStr)
            
            // 使用layui重新渲染下拉表单区域的结构
            form.render()
        }
    });
}

// 定义一个发布文章的方法
function publishArticle(fd){
    // 发送ajax请求
    $.ajax({
        type: "POST",
        url: "/my/article/add",
        data: fd,
        // 向服务器提交FormData格式的数据需要提供两个配置项
        contentType: false,
        processData: false,
        success: function (res) {
            if(res.status !== 0){
                return layer.msg(res.msg)
            }
            layer.msg(res.msg)

            // 跳转到文章列表页面
            location.href = '/web/article/art_list.html'

            // 在iframe中获取父元素
            var pWindow= window.parent; 
            // 获取父元素中的标签
            var pDiv=pWindow.document.getElementsByClassName('layui-nav-child')
            var divs = pDiv[1].getElementsByTagName('dd')
            // 用于切换侧边栏内的导航
            for(let i = 0; i<divs.length; i++){
                divs[i].className = ''
            }
            divs[1].className = 'layui-this'
        }
    })
}