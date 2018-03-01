/**
 * Created by Administrator on 2017/11/29.
 */
(function ($) {

    var sort = $('.sort');
    var sortCanopy = $('.sort-canopy');   //拖动排序 遮罩层
    var sortList = sort.find('.sort_lint ul li.item');


    sortList.on('click', function () {
        if (!sort.find('ul').hasClass('edit-state')) {

            $(this).addClass('active').siblings().removeClass('active');
        }
    });

    // 开启/关闭 排序
    sort.find('.sort_lint ul li.rank').on('click', function () {
        sort.find('ul').toggleClass('edit-state');
        sortCanopy.fadeToggle(300);
    });

    //关闭 排序
    sortCanopy.on('click', function () {
        sort.find('ul').toggleClass('edit-state');
        sortCanopy.fadeToggle(300);
    });

    // 移动排序
    sort.find('.sort_lint').on('mousedown', '.edit-state li.item', function (e) {

        var step = 0;

        // 桌面端只允许鼠标左键拖动
        if (e.type == 'mousedown' && e.which != 1) return;

        // 防止表单元素，a 链接，可编辑元素失效
        var tagName = e.target.tagName.toLowerCase();
        if (tagName == 'input' || tagName == 'textarea' || tagName == 'select' ||
            tagName == 'a' || $(e.target).prop('contenteditable') == 'true') {
            return;
        }


        var $this = $(this);
        var $doc = $(document);


        var offset = $this.offset();

        // 桌面端
        var pageY = e.pageY;
        var disY = pageY - offset.top;

        var clone = $this.clone()
            .css({
                'height': $this.height(),
                'background-color': '#fff'
            })
            .empty();

        var hasClone = 1;

        // 缓存计算
        var thisOuterHeight = $this.outerHeight();

        $doc.on('mousemove', function (e) {
                // 桌面端
                var pageY = e.pageY;

                if (hasClone) {
                    $this.before(clone)
                        .css({
                            'position': 'fixed',
                            'background-color': '#00a1d6',
                            'color': '#fff'
                        })
                        .appendTo($this.parent());

                    hasClone = 0;
                }

                var top = pageY - disY;

                var prev = clone.prev();
                var next = clone.next().not($this).not('.rank');

                // 超出首屏减去页面滚动条高度或宽度
                $this.css({
                    top: top - $doc.scrollTop()
                });

                // 向上排序
                if (prev.length && top < prev.offset().top + prev.outerHeight() / 2) {
                    step = step - 1;
                    clone.after(prev);

                    // 向下排序
                } else if (next.length && top + thisOuterHeight > next.offset().top + next.outerHeight() / 2) {
                    step = step + 1;
                    clone.before(next);
                }


            })
            .on('mouseup', function () {

                $doc.off('mousemove mouseup');

                // click 的时候也会触发 mouseup 事件，加上判断阻止这种情况
                if (!hasClone) {
                    clone.before($this.removeAttr('style')).remove();

                    $this.addClass('active').siblings().removeClass('active');

                    var thisRow = $this.data('sort');
                    var thisIndex = $this.index();

                    var $area = $('.sort_box');
                    var $areaRow = $area.children('section[data-sort = ' + thisRow + ']');

                    $area.append($areaRow);
                    $area.children('section').eq(thisIndex).before($areaRow);

                    var areaOffset = $areaRow.offset().top - 110;
                    $('html ,body').animate({scrollTop: areaOffset}, 500);

                }
            });

        return false;
    });


})(jQuery);