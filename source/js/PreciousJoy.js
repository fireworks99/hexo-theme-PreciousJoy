// ---------------------文章导航----------------------------
$(document).ready(function () {
    // hljs.initHighlightingOnLoad();
    // clickTreeDirectory();
    // serachTree();
    // pjaxLoad();
    showArticleIndex();
    wrapImageWithFancyBox();

    // Add line number for highlight.js
    // $("pre code").each(function(){
    // 	$(this).html("<ol><li>" + $(this).html().replace(/\n/g,"\n</li><li>") +"\n</li></ol>");
    // });
    
    if($('#recent-posts-box').length > 0){
    	$('.menu-item-search').css({
    		"display": "flex"
    	})
    }
    

    $('pre code').each(function(){
        var texts = $(this).text().split('\n');
        var lines = texts.length;
        $.each(texts, function(index, value){
            // console.log(index, value);
            if(index === texts.length - 1 && value === "") {
                // console.log("Caught you!");
                lines--;
            }
        })
        
        var $numbering = $('<ul/>').addClass('pre-numbering');
        $(this)
        .addClass('has-numbering')
        .parent()
        .append($numbering);
        for(i=1;i<=lines;i++){
            $numbering.append($('<li/>').text(i));
        }
    });

    $('p code').each(function(){
        $(this).addClass('p_code')
    });

    $('blockquote p').each(function(){
        $(this).addClass('blockquote_p')
    });

    $("pre code").mCustomScrollbar({
        axis:"x",
        theme:"light-thick"
    });

});

function showArticleIndex() {
    // 先刷一遍文章有哪些节点，把 h1 h2 h3 加入列表，等下循环进行处理。
    // 如果不够，可以加上 h4 ,只是我个人觉得，前 3 个就够了，出现第 4 层就目录就太长了，太细节了。
    var h1List = h2List = h3List = [];
    var labelList = $("#details-post-item").children();
    for ( var i=0; i<labelList.length; i++ ) {
        if ( $(labelList[i]).is("h1") ) {
            h2List = new Array();
            h1List.push({node: $(labelList[i]), id: i, children: h2List});
        }

        if ( $(labelList[i]).is("h2") ) {
            h3List = new Array();
            h2List.push({node: $(labelList[i]), id: i, children: h3List});
        }

        if ( $(labelList[i]).is("h3") ) {
            h3List.push({node: $(labelList[i]), id: i, children: []});
        }
    }

    // 闭包递归，返回树状 html 格式的文章目录索引
    function show(tocList) {
        var content = "<ul>";
        tocList.forEach(function (toc) {
            toc.node.before('<span class="anchor" id="_label'+toc.id+'"></span>');
            if ( toc.children == 0 ) {
                content += '<li><a href="#_label'+toc.id+'">'+toc.node.text()+'</a></li>';
            }
            else {
                content += '<li><a href="#_label'+toc.id+'">'+toc.node.text()+'</a>'+show(toc.children)+'</li>';
            }
        });
        content += "</ul>"
        return content;
    }

  // 最后组合成 div 方便 css 设计样式，添加到指定位置
    $("div #toc").empty();
    $("div #toc").append(show(h1List));

    // 点击目录索引链接，动画跳转过去，不是默认闪现过去
    $("#toc a").on("click", function(e){
        e.preventDefault();
        // 获取当前点击的 a 标签，并前触发滚动动画往对应的位置
        var target = $(this.hash);
        $("body, html").animate(
            {'scrollTop': target.offset().top},
            500
        );
    });

    // 监听浏览器滚动条，当浏览过的标签，给他上色。
    $(window).on("scroll", function(e){
        var anchorList = $(".anchor");
        anchorList.each(function(){
            var tocLink = $('#toc a[href="#'+$(this).attr("id")+'"]');
            var anchorTop = $(this).offset().top;
            var windowTop = $(window).scrollTop();
            if ( anchorTop <= windowTop+50 ) {
                tocLink.addClass("read");
            }
            else {
                tocLink.removeClass("read");
            }
        });
    });
}

// ---------------------文章导航----------------------------

// ---------------------Fancybox----------------------------

// $(document).ready(function() {
//     wrapImageWithFancyBox();
// });

/**
 * Wrap images with fancybox support.
 */
function wrapImageWithFancyBox() {
    
    // console.log('wrapImageWithFancyBox');

    $('img').not('.sidebar-image img').not('#author-avatar img').each(function() {
        var $image = $(this);
        var imageCaption = $image.attr('alt');
        var $imageWrapLink = $image.parent('a');

        if ($imageWrapLink.length < 1) {
            var src = this.getAttribute('src');
            var idx = src.lastIndexOf('?');
            if (idx != -1) {
                src = src.substring(0, idx);
            }
            $imageWrapLink = $image.wrap('<a href="' + src + '"></a>').parent('a');
        }

        $imageWrapLink.attr('data-fancybox', 'images');
        if (imageCaption) {
            $imageWrapLink.attr('data-caption', imageCaption);
        }

    });

    $().fancybox({
        selector: '[data-fancybox="images"]',
        thumbs: false,
        hash: true,
        loop: false,
        fullScreen: false,
        slideShow: false,
        protect: true,
    });
}

// ---------------------Fancybox----------------------------
