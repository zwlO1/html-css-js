let switchDiv = document.querySelector('#switch')
let container = document.querySelector('.container')
let music = document.querySelector('audio')
// console.log(container);
console.log(music);
switchDiv.addEventListener('click', () => {
    // switchDiv.classList.toggle('switched')
    //开始快速  点击后慢速
    if (switchDiv.classList.contains('switched')) {
        switchDiv.classList.remove('switched')
        container.classList.remove('slow')
        //音乐淡出
        let t = setInterval(function () {
            if (music.volume > 0.1)
                music.volume -= 0.05
            else {
                music.pause();
                clearInterval(t)
            }
        }, 200)

    } else {
        switchDiv.classList.add('switched')
        container.classList.add('slow')
        //音乐淡入
        music.volume = 0.1;
        music.play();
        let t = setInterval(function () {
            if (music.volume <= 0.5)
                music.volume += 0.05
            else
                clearInterval(t)
        }, 200)

    }
})