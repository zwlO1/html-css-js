var h1 = document.querySelector('#head')
var start = document.querySelector('#start')
var stop = document.querySelector('#stop')
var b = document.querySelector('b');
// console.log(h1);

var run = 0,
    timer; //0未执行  1已执行

start.onclick = function () {
    // var list = $('#list').val().replace(/ +/g, ' ').replace(/^ | $/g, '').split(' ');
    var list = document.querySelector('#list').value.replace(/ +/g, ' ').replace(/^ | $|\n/g, '').split(' ');
    console.log(list);

    if (!run) {
        // $('h1').html.replcae('吃这个!')
        h1.innerHTML = '今天吃什么？'
        this.innerHTML = '停止'

        //函数定时执行
        timer = setInterval(function () {
            var r = Math.ceil(Math.random() * list.length),
                food = list[r - 1];
            b.innerHTML = food
            var rTop = Math.ceil(Math.random() * (document.documentElement.clientHeight)),
                rLeft = Math.ceil(Math.random() * (document.documentElement.clientWidth - 50)),
                rSize = Math.ceil(Math.random() * (37 - 14) + 14);

            var span = document.createElement('span')
            // var text = document.createTextNode(food)
            // span.appendChild(text)
            // span.innerHTML = food   // console.log(span);
            // span.hidden
            // span.style.property = ({
            //     "top": rTop,
            //     "left": rLeft,
            //     "color": "rgba(0,0,0,." + Math.random() + ")",
            //     "fontSize": rSize + "px"
            // })

            $("<span class='temp'></span>").html(food).hide().css({
                "top": rTop,
                "left": rLeft,
                "color": "rgba(0,0,0,." + Math.random() + ")",
                "fontSize": rSize + "px"
            }).appendTo("body").fadeIn("slow", function () {
                $(this).fadeOut("slow", function () {
                    $(this).remove();
                });
            });
        }, 50)
        run = 1;
    } else {
        h1.innerHTML = '吃这个！'
        this.innerHTML = '换一个'
        clearInterval(timer)
        run = 0
    }
}

document.onkeydown = function enter(e) {
    var e = e || event;
    if (e.keyCode == 13) $("#start").trigger("click");
};
$i = 0;
$('#start').click(function () {
    $i++;
    if ($i >= 6) {
        $('#start').hide();
        $('#stop').show();
    }
})
$('#stop').click(function () {
    alert('这么作？今天别吃了！')
    $(this).hide();
})