//封装一个用于登录/注册的构造函数

//定义入口变量
window.pageTools = window.pageTools || {};
(function(){
  // 1 登录与注册
  function Login(isLogin, selector, eventListener){
    this.isLogin = isLogin; //用来判断是登录还是注册
    this.selector = $(selector); //获取DOM节点
    this.init();
    this.eventListener = eventListener;
  }

  Login.prototype.init = function(){
    var isShow = this.isLogin ? 'none' : 'block'; //登录或注册对话框要不要显示
    var buttonText = this.isLogin ? '登录' : '注册';
    //添加对话框
    this.dialog = $('<div class="dialog">\
                    <button class="close-btn">&times;</button>\
                    <div class="input-box">\
                      <input type="text" placeholder="用户名">\
                      <input type="password" placeholder="密码">\
                      <input type="password" placeholder="确认密码" class="again-pwd">\
                      <button class="btn"><button>\
                    </div>\
                  </div>');

    //添加DOM到文档
    this.selector.append(this.dialog);

    //如果是登入则不显示确认密码框，注册则显示
    $('.again-pwd').css('display', isShow);

    //单击“登录”或“注册”
    $('.btn').html(buttonText).click(function(){
      this.dialog.remove();
      this.dialog = null;
      this.eventListener();
    }.bind(this));//改变this指向

    //当单击“关闭”；清除上面创建的对话框DOM
    $('.close-btn').click(function(){
      this.dialog.remove();
      this.dialog = null;
      this.eventListener();
    }.bind(this));
  }

  //2 导航栏
  function Nav(selector,datas,callback){
    this.width = 100;
    this.datas = datas || [];
    this.callback = callback;
    this.selector = $(selector || '');
  }

  //创建导航栏界面
  Nav.prototype.createNav = function(){
    var nav = $('<ul class="nav-list"></ul>'); //创建导航栏DOM
    var w = this.width / (this.datas.length);
    this.datas.forEach(function(info){
      var item = $('<li class="nav-item" style="width:' + w + '%;">\
                      <a href="' + info.url +'">\
                        <img class="icon" src="' + info.imageUrl +'">\
                        <span>' + info.title +'</span>\
                      </a>\
                    </li>');
      nav.append(item); //将所有菜单项添加到前面的ul标签中
    }.bind(this));

    this.selector.append(nav);//将结果渲染到前端
  }

  //3 分类导航
  function Category(selector,datas,callback){
    this.selector = $(selector || '');
    this.datas = datas || [];
    this.callback = callback;
  }

  Category.prototype.createCategoryNav = function(){
    // console.log(this);
    var _this = this;
    //创建一级菜单
    var Category_menu = $('<ul class="category-menu"></ul>');
    this.selector.append(Category_menu);
    this.datas.forEach(function(item){
      // console.log(this);
      var Category_menu_item = $('<li><a href="#">' + item.title + '</a></li>');
      Category_menu.append(Category_menu_item);

      Category_menu_item.mouseenter(function(item){
        // console.log(this);
        return function(e){
          // console.log(this);
          e.preventDefault(); //阻止a标签的默认行为
          _this.callback($(this).text());

          if($('.category-sub-menu')){ //如果分类二级菜单有内容，则先清空内容
            $('.category-sub-menu').remove();
          }

          //创建分类二级菜单
          var Category_sub_menu = $('<ul class="category-sub-menu"></ul>');
          $(this).append(Category_sub_menu);
          Category_sub_menu.css('width', Category_sub_menu.css('width')!='20rem'?'20rem':'0');
          item.des.forEach(function(info){
            var sub_menu_item = $('<li><a href="#">' + info.title + '</a></li>');
            Category_sub_menu.append(sub_menu_item);
          })
        }
      }(item)).mouseleave(function(){
        $('.category-sub-menu').remove();
      })
    }.bind(this))
  }

  //4 商品分类
  function Goods(selector,datas,callback){
    this.selector = $(selector || '');
    this.datas = datas || [];
    this.callback = callback;
  }

  Goods.prototype.createGoods = function(){
    //商品一级分类
    var goods_container = $('<ul class="goods"></ul>');
    this.selector.append(goods_container);
    this.datas.forEach(function(item){
      var goods_item = $('<li class="item">\
                            <div class="addr" style="background-image:url(' + item.addr + ')"></div>\
                            <h3 id="' + item.id + '" class="title">' + item.title +'</h3>\
                          </li>');

      goods_container.append(goods_item);

      //商品二级分类
      var goods = $('<ul class="goods-list"></ul>');
      goods_item.append(goods);
      item.des.forEach(function(info){
        var goods_item = $('<li class="goods-item">\
                              <a href="../view/goods_details.html?type=' + item.type + '&id=' + info.id + '">\
                                <img class="image" src="' + info.image + '" alt="' + info.name + '"/>\
                                <p class="name">' + info.name +'</p>\
                                <p class="price">￥' + info.price + '</p>\
                                <button class="btnBuy">抢购</button>\
                              </a>\
                            </li>');

        goods.append(goods_item);
      })
    });
  }

  //5 放大镜
  function Zoom(el){
    this.el = $(el || '');
  }

  Zoom.prototype.createView = function(){
    var scaleView = $('<div class="zoom"></div>'); //创建用于存放另一张大图的DOM
    this.el.append(scaleView);

    //设置放大镜所显示的大图
    scaleView.css('background-image',this.el.css('background-image'));

    this.el.mouseenter(function(){
      scaleView.css('display','block');
    }).mousemove(function(e){
      // console.log(1);
      scaleView.css({
        "background-position": (-e.offsetX + 200) + 'px ' + (-e.offsetY + 200) + 'px'
      })
    }).mouseleave(function(){
      scaleView.css('display','none');
    })
  }

  window.pageTools = {
    Login,
    Nav,
    Category,
    Goods,
    Zoom
  }; // 定义构造函数暴露出去
})();