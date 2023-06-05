// 从layui中获取form对象
var form = layui.form
// 从layui中获取layer对象
var layer = layui.layer
// 从layui中获取laypage对象
var laypage = layui.laypage

// 定义一个美化时间的过滤器
template.defaults.imports.dataFormat = function(date){
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
}

// 定义时间补零的函数
function padZero(n){
    return n > 9 ? n : '0' + n
}

// 定义查询的参数对象，用于向服务器提交数据
var q = {
    pagenum: 1,         // 默认请求第一页的数据
    pagesize: 2,        // 每页显示的数据条数
    cate_id: '',        // 文章分类ID
    state: ''           // 文章的发布状态 
}

// 入口函数
$(function(){
    // 调用获取文章列表数据的函数
    initTable()

    // 调用获取文章分类的函数
    initCate()

    // 为筛选表单绑定事件
    $('#form_search').on('submit', function(e){
        // 阻止表单的默认行为
        e.preventDefault()
        // 获取下拉菜单中的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        
        // 根据新的查询参数对象来获取文章列表数据
        initTable()
    })

    // 通过代理的形式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn_delete', function(){
        // 获取当前删除文章的id
        var id = $(this).attr('data-id')
        // 获取页面中删除按钮的个数
        var len = $('.btn_delete').length
        // 询问框
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            // 发送ajax请求
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if(res.status !== 0){
                        return layer.msg(res.msg)
                    }
                    layer.msg(res.msg)
                    // 通过删除按钮的个数判断删除本条数据后当前页码内是否还有数据，若没有数据让页码值减一
                    if(len === 1){
                        // 判断当前页码值是否为最小值1，若不是则让其减一，若是让其等于1
                        q.pagenum = (q.pagenum === 1 ? 1 : q.pagenum - 1)
                    }
                    // 重新渲染页面中的文章数据
                    initTable()
                }
            });
            layer.close(index);
        })
    })
})

// 获取文章列表数据
function initTable(){
    $.ajax({
        type: "get",
        url: "/my/article/list",
        data: q,
        success: function (res) {
            if(res.status !== 0){
                return layer.msg(res.msg)
            }
            // 使用模板引擎渲染页面数据
            var htmlStr = template('tpl_table', res)
            $('tbody').html(htmlStr)
            
            // 调用渲染分页的函数
            renderPage(res.total)
        }
    })
}


// 初始化文章分类
function initCate(){
    $.ajax({
        type: "get",
        url: "/my/article/cates",
        success: function (res) {
            if(res.status !== 0){
                return layer.msg(res.msg)
            }
            // 调用模板引擎渲染数据
            var htmlStr = template('tpl_cate', res)
            $('[name=cate_id]').html(htmlStr)
            // 使用layui重新渲染下拉表单区域的结构
            form.render()
        }
    });
}

// 定义渲染分页的方法
function renderPage(total){
    // 初始化分页区域
    laypage.render({
        elem: 'pageBox',            // 分页容器的ID
        count: total,               // 总数据条数
        limit: q.pagesize,          // 每页数据条数
        curr: q.pagenum,            // 设置默认被选中的分页
        // 用于定义分页组件中需要添加哪些功能，页面中的功能项顺序由数组中的元素顺序决定
        layout: ['count','limit','prev','page','next','skip'],
        limits: [2,3,5,10],          // 用于定义每页展示几条数据
        // 分页发生切换时的回调函数，触发时机：点击页码值会触发、点击每页条目会触发、调用laypage.render()方法时会自动触发
        jump: function(obj, first){
            // 获取最新的页码值并赋值给查询参数对象中对应的属性
            q.pagenum = obj.curr
            // 获取每页中显示的数据条数并赋值给查询参数对象中对应的属性
            q.pagesize = obj.limit
            // 判断是否由于初始加载时触发的该回调函数，首次不执行
            if(!first){
                // 根据新的查询参数对象来获取文章列表数据
                initTable()
            }
        }
    })
}