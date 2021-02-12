;(function(){
  var dataUrl = null;
  // console.log(location.search)

  if(location.search){
    dataUrl = '../res/data/data.json';
  }else{
    dataUrl = './res/data/data.json';
  }

  function Page(url){
    if(location.search){
      var urlStr = location.search.replace('?','');
      var temp = urlStr.split('&');
      var type = temp[0].replace('type=','');
      var id = temp[1].replace('id=','');

      this.loadData(url).then(function(data){
        //获取首页传过来的商品具体数据
        var goodsDetails = data.goods[type].des[id];

        this.goodsInfo(goodsDetails);

        this.zoom();
        this.loginRegister();
        this.banner();
        this.nav(data.nav);
        this.categoryNav(data.category);
        this.addRightBar(); //右侧栏QQ客服
      }.bind(this))
    }else{
      this.loadData(url).then(function(data){
        this.init(data);
      }.bind(this))
    }

  }

  //异步获取data.json文件
  Page.prototype.loadData = function(url){
    
    return new Promise(function(success, fail){
      $.ajax({
        type: 'get',
        url: url
      }).then(function(res){
        success(res);
      })
    })
  }

  //初始化项目
  Page.prototype.init = function(data){
    this.loginRegister();
    this.banner();
    this.nav(data.nav);
    this.categoryNav(data.category);
    this.goodsList(data.goods);
    this.addLeftBar(data.goods);
    this.addRightBar();
  }

  //主函数
  function main(){
    new Page(dataUrl); //相对主页
  }

  main();

  //登入注册页面
  var loginView = null; // 设置变量用于存放对话框

  function loginRegisterAction(event){
    event.preventDefault(); //阻止a标签的默认行为
    if(!loginView){ // 如果对话框没有显示出来
      var type = event.target.dataset.type;
      loginView = new pageTools.Login(type == 'login', 'body', function(){
        loginView = null;
      })
    }
  }
  //注册登入
  Page.prototype.loginRegister = function (){
    $('.login').click(loginRegisterAction);
    $('.register').click(loginRegisterAction);
  }
  //导航栏实例化
  Page.prototype.nav = function(datas){
    navtool = new pageTools.Nav('.nav_container', datas, function(text){
      console.log(text);
    })
    navtool.createNav();
  }
  //轮播图
  Page.prototype.banner = function(){
    var mySwiper = new Swiper ('.swiper-container', {
      loop: true, // 循环模式选项
      
      //自动播放
      autoplay: {
        delay: 3000,
        stopOnLastSlide: false,
        disableOnInteraction: false,
      },

      // 如果需要分页器
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      
      // 如果需要前进后退按钮
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
      
    })
  }
  //分类导航实例化
  Page.prototype.categoryNav = function(category){
    navtool = new pageTools.Category('.category-nav', category, function(res){
      console.log(res);
    })
    navtool.createCategoryNav();
  }
  //实例化商品类
  Page.prototype.goodsList = function(goods){
    navtool = new pageTools.Goods('.main-container', goods, function(){
      console.log('goods');
    })
    navtool.createGoods();
  }

  // 商品详情
  Page.prototype.goodsInfo = function(data){
    $('.goods-img').css('background-image','url(' + data.image + ')');
    $('.title').html(data.title);
    $('.price').html(data.price);
  }

  // 放大镜
  Page.prototype.zoom = function(){
    zoomtool = new pageTools.Zoom('.goods-img');
    zoomtool.createView();
  }

  //左侧快速固定
  Page.prototype.addLeftBar = function(classic){
    // console.log(classic);
    var leftBar = $('<ul class="left-bar"></ul>');

    classic.forEach(function(item){
      var clsLi = $('<li><a href="#' + item.id + '">' + item.title + '</a></li>');
      leftBar.append(clsLi);
    })
    $(document.body).append(leftBar);
  }

  //右侧栏QQ客服&快速回到顶部
  Page.prototype.addRightBar = function(){
    var rightBar = $('<ul class="right-bar"></ul>');

    rightBar.append($('<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=672479535&site=qq&menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:672479535:52" alt="请问您有什么问题？" title="请问您有什么问题？"/></a>'));
    var toTop = $('<li><a href="">回到顶部</a></li>');
    rightBar.append(toTop);

    toTop.click(function(e){
      e.preventDefault();
      $('html,body').animate({
        scrollTop: 0,
      },'slow');
    })
    $(document.body).append(rightBar);
  }

})();