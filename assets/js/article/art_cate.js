// 从layui中获取form对象
var form = layui.form
// 从layui中获取layer对象
var layer = layui.layer

// 入口函数
$(function(){
    // 调用获取文章分类列表的函数
    initArtCateList()
    
    // 定义一个变量用于存放打开的弹出层的索引
    var indexAdd = null
    // 为添加类别按钮绑定点击事件
    $('#btnAdd').on('click', function(){
        // 弹出层
        indexAdd = layer.open({
            // 设置弹出框的类型
            type: 1,
            // 设置弹出框的宽高
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog_add').html()
        })
    })

    // 通过代理的形式为form表单绑定事件
    $('body').on('submit', '#form_add', function(e){
        // 阻止表单的默认事件
        e.preventDefault()
        // 发送ajax请求
        $.ajax({
            type: "post",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if(res.status !== 0){
                    return layer.msg(res.msg)
                }
                // 调用获取文章分类列表的函数
                initArtCateList()
                layer.msg(res.msg)
                // 根据索引关闭对应的弹出层
                layer.close(indexAdd)
            }
        })  
    })

    // 定义一个变量用于存放打开的弹出层的索引
    var indexEdit = null
    // 通过代理的形式为编辑按钮绑定事件
    $('tbody').on('click', '#btn_edit', function(){
        // 弹出层
        indexEdit = layer.open({
            // 设置弹出框的类型
            type: 1,
            // 设置弹出框的宽高
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog_edit').html()
        })
        // 获取对应分类的id
        var id = $(this).attr('data-id')
        // 发送jajx请求获取对应数据
        $.ajax({
            type: "get",
            url: "/my/article/cates/" + id,
            success: function (res) {
                form.val('form_edit', res.data)
            }
        })
    })

    // 通过代理的形式为修改按钮绑定事件
    $('body').on('submit', '#form_edit', function(e){
        //  阻止表单的默认行为
        e.preventDefault()
        // 发送sjax请求修改文章分类
        $.ajax({
            type: "post",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if(res.status !== 0){
                    return layer.msg(res.msg)
                }
                // 调用获取文章分类列表的函数
                initArtCateList()
                layer.msg(res.msg)
                // 根据索引关闭对应的弹出层
                layer.close(indexEdit)
            }
        });
    })

    // 通过代理的形式为重置按钮绑定事件
    $('body').on('click', '#btn_reset', function(e){
        // 阻止重置按钮的默认行为
        e.preventDefault()
        // 获取对应分类的id
        var id = $('#form_edit [name=id]').val()
        // 发送jajx请求获取对应数据
        $.ajax({
            type: "get",
            url: "/my/article/cates/" + id,
            success: function (res) {
                form.val('form_edit', res.data)
            }
        })
    })

    // 通过代理的形式为删除按钮绑定事件
    $('tbody').on('click', '#btn_delete', function(){
        // 获取对应分类的id
        var id = $(this).attr('data-id')
        // 询问提示框
        layer.confirm('确认删除?',
            {icon: 3, title:'提示'},
            function(index){
                // 发送sjax请求
                $.ajax({
                    type: "get",
                    url: "/my/article/deletecate/" + id,
                    success: function (res) {
                        if(res.status !== 0){
                            return layer.msg(res.msg)
                        }
                        layer.msg(res.msg)
                        // 调用获取文章分类列表的函数
                        initArtCateList()
                    }
                })
                layer.close(index);
            });
    })
})


// 获取文章分类列表
function initArtCateList(){
    $.ajax({
        type: "get",
        url: "/my/article/cates",
        success: function (res) {
            if(res.status !== 0){
                return layer.msg(res.msg)
            }
            // 使用模板引擎渲染数据
            var htmlStr = template('tpl_table', res)
            $('tbody').html(htmlStr)
        }
    });
}