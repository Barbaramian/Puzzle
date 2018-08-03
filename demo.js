function init() {
    this.blockW = 150;
    this.blockH = 150;
    this.gameW = parseInt($('.game').css('width'));
    this.gameH = parseInt($('.game').css('height'));
    this.column = this.gameW / this.blockW;
    this.row = this.gameH / this.blockH;
    bindEvent();
    createBlock();

}
// 有bug,当元素第一次做为目标元素后，再次作为被拖拽元素被移动时，会出现延迟，后正常
function bindEvent() {
    $('.start').click(function () {
        startGame();
    });
    $('.game').mousedown(function (e) {
        var target = e.target;
        $(target).on('dragstart', function (e) {
            window.targetLeft = $(this).position().left;
            window.targetTop = $(this).position().top;
            window.chaL = e.clientX - $(this).parent().position().left - $(this).position().left;
            window.chaT = e.clientY - $(this).parent().position().top - $(this).position().top;
            window.targetLeft1 = e.clientX - chaL - $(this).parent().position().left;
            window.targetTop1 = e.clientY - chaT - $(this).parent().position().top;

        })
        $('.game div').on('dragenter', function (e) {
            window.originLeft = $(this).position().left;
            window.originTop = $(this).position().top;
        }).on('dragover', function (e) {
            e.preventDefault();
        }).on('drop', function () {
            $(this).animate({
                'left': targetLeft,
                'top': targetTop
            }, 200, 'linear').attr('sort', targetTop / blockH + '-' + targetLeft / blockW);
            $(target).on('dragend', function (e) {
                $(this).css({
                    'left': targetLeft1,
                    'top': targetTop1
                })
                $(this).attr('sort', originTop / blockH + '-' + originLeft / blockW).animate({
                        'left': originLeft,
                        'top': originTop
                    }, 200, 'linear',
                    function () {
                        judge();
                    });
            });
            // judge();
        })

    });
}

function startGame() {
    $('.game div').addClass('block');
    messySort();
    bindEvent();
    // judge();
}
// 生成拼图
function createBlock() {
    for (var j = 0; j < row; j++) {
        for (var i = 0; i < column; i++) {
            this.div = document.createElement('div');
            $(div).css({
                'width': blockW + 'px',
                'height': blockH + 'px',
                'position': 'absolute',
                'background-image': 'url(demo.png)',
                'left': i * blockW + 'px',
                'top': j * blockH + 'px',
                'border': '1px solid #fff',
                'border-radius': '5px',
                'background-size': column * 100 + '% ' + row * 100 + '%',
                'background-position': -i * blockW + 'px ' + (-j * blockH) + 'px'
            });
            $(div).attr('id', j + '-' + i);
            $(div).attr('draggable', 'true');
            $('.game').append($(div));
        }
    }

}
// 判断是否成功
function judge() {
    var arrSort = [],
        arrOrder = [];
    for (var i = 0; i < blocks.length; i++) {
        var sort = blocks.eq(i).attr('sort');
        arrSort.push(sort);
    }
    for (var j = 0; j < blocks.length; j++) {
        var order = blocks.eq(j).attr('id');
        arrOrder.push(order);
    }
    // 成功判断条件
    if (arrOrder.toString() == arrSort.toString()) {
        alert('you are win');
        reload();
    }
}
// 散乱排序
function messySort() {
    var obj = {};
    this.blocks = $('.game div');
    // 得出行、列中总共可以排列图块位置
    for (var i = 0; i < blocks.length; i++) {
        this.blocksX = Number(blocks.eq(i).attr('id').split('-')[1]);
        this.blocksY = Number(blocks.eq(i).attr('id').split('-')[0]);
        var maxX = Math.max(blocksX, Number(blocks.eq(i - 1).attr('id').split('-')[1]));
        var maxY = Math.max(blocksY, Number(blocks.eq(i - 1).attr('id').split('-')[0]))
    }
    // 防止多个图块定位到同一位置，运用数组去重原理进行分辨
    var i = 0;
    while (i < blocks.length) {
        // 运用随机数随机排列位置
        var indexi = Math.floor(Math.random() * (maxX + 1));
        var indexj = Math.floor(Math.random() * (maxY + 1));
        if (!obj[indexi + '+' + indexj]) {
            this.blocks.eq(i).animate({
                'left': indexi * blockW + 'px',
                'top': indexj * blockH + 'px'
            },400,'linear').attr('sort', indexj + '-' + indexi);
            obj[indexi + '+' + indexj] = 'a';
            i++;

        }
    }
}

function reload() {
    $('.game').html('');
    bindEvent();
}

init();