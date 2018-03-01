/**
 * Created by Administrator on 2017/9/24.
 */

$(function () {

    //搜索
    (function () {
        var searchText = $('#search-text');
        var searchResult = $('.search-result');

        searchText
            .on('focus click input propertychange', function (e) {
                if ($(this).val() == '') {
                    searchResult.fadeIn();
                } else {
                    searchResult.fadeOut();
                }
                e.stopPropagation();
            })
            .on('blur', function () {
                searchResult.fadeOut();
            });

        $(document).on('click', function () {
            searchResult.fadeOut();
        });

        var searchHistoryBox = $('.search-history-box');
        var searchHistoryBody = $('.search-history-body');

        $('#search-submit')
            .on('click', function () {
                var text = searchText.val();
                if (text != '') {
                    searchHistoryBox.show();
                    var newItem = '<a class="search-history-body-item" href="javascript:;">' + text + '</a>';
                    searchHistoryBody.prepend(newItem);
                    searchText.val('');
                }
            });

        searchResult.on('click', '.clear-history', function () {
            searchHistoryBox.hide();
            searchHistoryBody.empty();
        })

    })();

    // 横幅广告 注释鼠标跟随
    (function () {
        var top,
            left,
            $this = $('.header-banner .point');

        $('.header-banner .banner-href')
            .on('mouseover', function (e) {
                top = e.pageY;
                left = e.pageX;
                $this.removeClass('hidden').css({left: left + 20 + 'px'});
            })
            .on('mousemove', function (e) {
                top = e.pageY;
                left = e.pageX;

                var header_marginTop = parseInt($('.header-banner').css('margin-top'));
                // console.log(header_marginTop);

                // 横幅广告的高度
                var $self = $(this);
                var selfHeight = $self.outerHeight();

                //横幅广告 提示框  高度
                var thisHeight = $this.outerHeight() / 2;

                $this.removeClass('hidden').css({left: left + 20 + 'px'});

                //横幅广告 提示框  最低 top 位置
                var topGap = top < ( thisHeight + header_marginTop);
                //横幅广告 提示框  最高 top 位置
                var bottomGap = top > (  selfHeight - thisHeight + header_marginTop);

                //判断横幅广告 当前top 最高或最低不为空 执行
                if (topGap || bottomGap) {
                    if (topGap) {
                        $this.css({top: 0 + 'px'});
                    }
                    if (bottomGap) {
                        $this.css({top: selfHeight - $this.outerHeight() + 'px'});
                    }
                } else {
                    $this.css({top: top - thisHeight - header_marginTop + 'px'});
                }

            })
            .on('mouseleave', function () {
                $('.header-banner .point').addClass('hidden');
            });

    })();

    //主页导航  标签底部标识 点击跟随移动
    (function () {
        var navBorderX,
            newWidth,
            navActive = $('nav .navMain ul li.active');

        var navBorder = $('<div class="navBorder"></div>')
            .css({
                'position': 'absolute',
                'background': '#fd4c5d',
                'height': '3px',
                'top': '43px',
                'width': navActive.width(),
                'left': navActive.position().left
            });

        $('nav .navMain ul').append(navBorder);

        $('nav .navMain').find('ul li').on('click', function () {
            $('nav .navMain ul li').removeClass('active');
            $(this).addClass('active');

            navBorder.stop().animate({
                'width': $(this).width(),
                'left': $(this).position().left
            }, 300)
        });

    })();

    // 主页导航 滚动固定  一级菜单 二级菜单
    (function () {
        var timer,
            nav = $('nav'),
            nav_scrollTop = nav.offset().top,
            navMain_record = false,                  //记录鼠标是否移出导航列
            navMain_sub = $('nav .navMain_sub'),
            navMain_sub_con_ul = $('nav .navMain_sub .navMain_sub_con ul');

        navMain_sub.on('mouseenter', function (e) {
                navMain_record = true;
            })
            .on('mouseleave', function () {
                navMain_record = false;

                clearTimeout(timer);
                timer = setTimeout(function () {
                    navMain_sub_con_ul.addClass('hidden');
                    navMain_sub.removeClass('hover');
                }, 700);
            });

        nav.on('mouseover', '.navMain ul li', function () {

                var self = $(this);

                // 二级菜单项 定位    (  一级菜单项left偏移量 + 一级菜单项宽度的一半  -  二级菜单项left偏移量  )
                var selfSeat = (self.offset().left + self.outerWidth() / 2) - self.parents('.navMain').offset().left;
                var category = self.data('category');
                var sub_category = $('nav .navMain_sub .navMain_sub_con ul[data-category=' + category + ']');

                clearTimeout(timer);

                timer = setTimeout(function () {
                    if (sub_category.length > 0) {

                        navMain_sub_con_ul.addClass('hidden');
                        navMain_sub.addClass('hover');
                        var sub_categoryWidth = sub_category.outerWidth() / 2;
                        sub_category.removeClass('hidden').css({left: selfSeat - sub_categoryWidth});

                    } else {
                        sub_category.addClass('hidden');
                        navMain_sub.removeClass('hover');
                    }
                }, 300);
            })
            .on('mouseout', '.navMain ul li', function () {
                clearTimeout(timer);

                timer = setTimeout(function () {
                    if (navMain_record) {
                        return false;
                    } else {
                        navMain_sub_con_ul.addClass('hidden');
                        navMain_sub.removeClass('hover');
                    }
                }, 700);
            });

        //滚动条 固定定位
        $(document).scroll(function () {
            var scrollTop = $(this).scrollTop();

            if (scrollTop > nav_scrollTop) {
                nav.addClass('fixed');
            } else {
                nav.removeClass('fixed');
            }
        });

    })();

    // 无缝滚动切换广告
    (function () {
        var $this = $('.slider-wrap');
        var $thisCon = $('.slider-wrap .slider-con');
        var cutCount = $('.slider-wrap .slider-count');

        var thisLength = $this.find('li.slider-item').length;
        var thisWidth = $this.width();

        if (thisLength > 0) {
            for (var i = 0; i < thisLength; i++) {
                var setItem = '<span>' + i + '</span>';
                cutCount.append(setItem);
            }
            cutCount.find('span').first().addClass('active')
        }

        var liLen = 1;

        function sliderScroll(count) {

            // 根据广告图 设置宽度
            $thisCon.css({'width': thisWidth * thisLength});

            cutCount.find('span').removeClass('active');

            if (count) {
                liLen = count;
            }

            if (liLen >= thisLength) {
                liLen = 1;

                $thisCon.animate({'left': 0}, 300);
                cutCount.find('span').first().addClass('active')

            } else {
                cutCount.find('span').eq(liLen).addClass('active');
                $thisCon.animate({'left': -thisWidth * liLen + 'px'}, 300);

                liLen++;
            }
        }

        //  设置滚动间隔 3000
        var sliderInterval = setInterval(sliderScroll, 3000);

        cutCount.on('click', 'span', function () {
            var $this = $(this);
            var index = $this.html();

            sliderScroll(index);
        });

        $this.on('mouseenter', function () {
                //取消 滚动间隔
                clearInterval(sliderInterval)
            })
            .on('mouseleave', function () {
                //  重新设置滚动间隔
                sliderInterval = setInterval(sliderScroll, 3000);
            });

    })();

    //推荐 组件广告 hover "稍后再看"
    (function () {
        
        $('.recommend-module').on('mouseenter', '.recommend-grid li', function () {
                $(this).addClass('hover');
            })
            .on('mouseleave', '.recommend-grid li', function () {
                $(this).removeClass('hover');
            })
            .on('mouseenter', '.recommend-watch', function () {

                var offset = $(this).offset();
                var hint = $('<div></div>')
                    .addClass('recommend-watch-hint')
                    .html('稍后再看')
                    .css({
                        'top': offset.top - 78,
                        'left': offset.left - 20
                    });
                console.log(hint);
                $('body').append(hint)

            })
            .on('mouseleave', '.recommend-watch', function () {
                $('.recommend-watch-hint').remove();
            });

    })();

    //周榜 月榜 导航切换
    (function () {

        $('.area-tab-nav').on('click', 'a', function () {
            var self = $(this);
            self.siblings().removeClass('active');
            self.addClass('active');

            var nav = self.data('nav');
            var con = self.parents('section').find('.area-tab-con').find("div[data-con=" + nav + "]");

            con.siblings().addClass('hidden');
            con.removeClass('hidden');
        });

        $('.module-tab').on('click', 'a', function () {
            var self = $(this);
            self.siblings().removeClass('active');
            self.addClass('active');

            var nav = self.data('nav');
            var con = self.parents('section').find('.module-tab-con').find("div[data-con=" + nav + "]");

            con.siblings().addClass('hidden');
            con.removeClass('hidden');
        })

    })();

    // 左侧 "文章" hover 导航切换
    (function () {

        $('.article-tab-nav').on('mouseenter', 'a', function () {
            var self = $(this);
            self.siblings().removeClass('active');
            self.addClass('active');

            var nav = self.data('nav');
            var con = $('.article-tab-con').find("div[data-con=" + nav + "]");

            con.siblings().addClass('hidden');
            con.removeClass('hidden');
        })

    })();

});








