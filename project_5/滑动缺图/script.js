(function (window) {
    const l = 42, // 滑块边长
        r = 9, // 滑块半径
        w = 310, // canvas宽度 boder 1px
        h = 155, // canvas高度
        PI = Math.PI
    const L = l + r * 2 + 3 // 滑块实际边长

    function getRandomNumberByRange(start, end) {
        return Math.round(Math.random() * (end - start) + start)
    }

    function createCanvas(width, height) {
        const canvas = createElement('canvas')
        canvas.width = width
        canvas.height = height
        return canvas
    }

    function createImg(onload) {
        const img = createElement('img')
        //允许跨域
        img.crossOrigin = "Anonymous"
        img.onload = onload
        img.onerror = () => {
            img.src = getRandomImg()
        }
        img.src = getRandomImg()
        return img
    }

    function createElement(tagName, className) {
        const elment = document.createElement(tagName)
        elment.className = className
        return elment
    }

    function addClass(tag, className) {
        tag.classList.add(className)
    }

    function removeClass(tag, className) {
        tag.classList.remove(className)
    }

    function getRandomImg() {
        return 'https://picsum.photos/300/150/?image=' + getRandomNumberByRange(0, 1084)
    }

    function draw(ctx, x, y, operation) {
        ctx.beginPath() //开始或重制路径
        ctx.moveTo(x, y) //起点
        ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI) //画圆 圆心xy 半径r 起始角(弧度制)  1pi (rad弧度)=180°
        ctx.lineTo(x + l, y) //画线
        ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI)
        ctx.lineTo(x + l, y + l)
        ctx.lineTo(x, y + l)
        ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true) //true  逆时针绘制
        ctx.lineTo(x, y)
        ctx.lineWidth = 2
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.stroke() //绘制moveTo lineTo 路径
        ctx[operation]() // ?
        ctx.globalCompositeOperation = 'overlay' //设定如何将源(新)图像绘制在目标(已有)图像上
    }

    function sum(x, y) {
        return x + y
    }

    function square(x) {
        return x * x
    }

    class jigsaw {
        constructor({
            el,
            onSuccess,
            onFail,
            onRefresh
        }) {
            el.style.position = el.style.position || 'relative'
            this.el = el
            this.onSuccess = onSuccess
            this.onFail = onFail
            this.onRefresh = onRefresh
        }

        init() {
            this.initDOM()
            this.initImg()
            this.bindEvents()
        }

        initDOM() {
            const canvas = createCanvas(w, h) // 画布
            const block = canvas.cloneNode(true) // 拼图滑块
            const refreshIcon = createElement('div', 'refreshIcon') //刷新
            const sliderContainer = createElement('div', 'sliderContainer') //滑条容器
            const sliderMask = createElement('div', 'sliderMask') //左滑条
            const slider = createElement('div', 'slider') //滑块
            const sliderIcon = createElement('span', 'sliderIcon') //滑块图标
            const text = createElement('span', 'sliderText') //滑条内容

            block.className = 'block'
            text.innerHTML = '向右滑动填充拼图'

            const el = this.el
            el.appendChild(canvas)
            el.appendChild(refreshIcon)
            el.appendChild(block)
            el.appendChild(sliderContainer)
            sliderContainer.appendChild(sliderMask)
            sliderContainer.appendChild(text)
            sliderMask.appendChild(slider)
            slider.appendChild(sliderIcon)


            //给目标对象添加属性
            Object.assign(this, {
                canvas,
                refreshIcon,
                block,
                sliderContainer,
                sliderMask,
                slider,
                sliderIcon,
                text,
                canvasCtx: canvas.getContext('2d'), //指定绘图环境  返回指定的环境类型
                blockCtx: block.getContext('2d')
            })
        }

        initImg() {
            const img = createImg(() => {
                this.draw()
                this.canvasCtx.drawImage(img, 0, 0, w, h) //canvas 绘图
                this.blockCtx.drawImage(img, 0, 0, w, h)
                const y = this.y - r * 2 - 1
                const ImageData = this.blockCtx.getImageData(this.x - 3, y, L, L) //获取对应位置绘图数据
                this.block.width = L
                this.blockCtx.putImageData(ImageData, 0, y)
            })
            this.img = img
        }

        //重载
        draw() {
            // 随机创建滑块的位置
            this.x = getRandomNumberByRange(L + 10, w - (L + 10))
            this.y = getRandomNumberByRange(10 + r * 2, h - (L + 10))
            draw(this.canvasCtx, this.x, this.y, 'fill')
            draw(this.blockCtx, this.x, this.y, 'clip')
        }

        clean() {
            this.canvasCtx.clearRect(0, 0, w, h)
            this.blockCtx.clearRect(0, 0, w, h)
            this.block.width = w
        }

        bindEvents() {
            this.el.onselectstart = () => false //禁止选择文本 onselectstart适用input texteara的标签
            this.refreshIcon.onclick = () => {
                this.reset() //重置为默认值
                typeof this.onRefresh === 'function' && this.onRefresh() // ？
            }

            let originX, originY, trail = [],
                isMouseDown = false

            const handleDragStart = function (e) {
                originX = e.clientX || e.touches[0].clientX
                originY = e.clientY || e.touches[0].clientY
                isMouseDown = true
            }

            const handleDragMove = (e) => {
                if (!isMouseDown) return false
                const eventX = e.clientX || e.touches[0].clientX
                const eventY = e.clientY || e.touches[0].clientY
                const moveX = eventX - originX
                const moveY = eventY - originY
                if (moveX < 0 || moveX + 38 >= w) return false
                this.slider.style.left = moveX + 'px'
                const blockLeft = (w - 40 - 20) / (w - 40) * moveX
                this.block.style.left = blockLeft + 'px'

                addClass(this.sliderContainer, 'sliderContainer_active')
                this.sliderMask.style.width = moveX + 'px'
                trail.push(moveY)
            }

            const handleDragEnd = (e) => {
                if (!isMouseDown) return false
                isMouseDown = false
                const eventX = e.clientX || e.changedTouches[0].clientX
                if (eventX == originX) return false
                removeClass(this.sliderContainer, 'sliderContainer_active')
                this.trail = trail
                const {
                    spliced,
                    verified
                } = this.verify()
                if (spliced) {
                    if (verified) {
                        addClass(this.sliderContainer, 'sliderContainer_success')
                        typeof this.onSuccess === 'function' && this.onSuccess()
                    } else {
                        addClass(this.sliderContainer, 'sliderContainer_fail')
                        this.text.innerHTML = '再试一次'
                        this.reset()
                    }
                } else {
                    addClass(this.sliderContainer, 'sliderContainer_fail')
                    typeof this.onFail === 'function' && this.onFail()
                    setTimeout(() => {
                        this.reset()
                    }, 1000)
                }
            }
            this.slider.addEventListener('mousedown', handleDragStart)
            this.slider.addEventListener('touchstart', handleDragStart)
            document.addEventListener('mousemove', handleDragMove)
            document.addEventListener('touchmove', handleDragMove)
            document.addEventListener('mouseup', handleDragEnd)
            document.addEventListener('touchend', handleDragEnd)
        }

        verify() {
            const arr = this.trail // 拖动时y轴的移动距离
            const average = arr.reduce(sum) / arr.length
            const deviations = arr.map(x => x - average)
            const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length)
            const left = parseInt(this.block.style.left)
            return {
                spliced: Math.abs(left - this.x) < 10,
                verified: stddev !== 0, // 简单验证下拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作
            }
        }

        reset() {
            this.sliderContainer.className = 'sliderContainer'
            this.slider.style.left = 0
            this.block.style.left = 0
            this.sliderMask.style.width = 0
            this.clean()
            this.img.src = getRandomImg()
        }

    }

    window.jigsaw = {
        init: function (opts) {
            return new jigsaw(opts).init()
        }
    }
}(window))