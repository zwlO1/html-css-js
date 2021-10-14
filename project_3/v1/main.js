/**
 * 
 * 
 * 
 * 历史记录
 * 正负号  
 * 小数运算
 * 取余运算
 */



const buttonContainer = document.querySelector('.buttons')
const prevElement = document.querySelector('.prev')
const currentElement = document.querySelector('.current')

let currentNumber = '',
    pervNumber = '',
    sign = ''

//委托事件  事件冒泡
buttonContainer.addEventListener('click', e => {
    // console.log(this); //window

    if (e.target == buttonContainer) return //父元素不执行
    const type = e.target.dataset.type
    const text = e.target.textContent
    if (type === 'equal') {
        calculate()
    } else if (type === 'operate') {
        operate(text)
    } else if (type === 'delete') {
        deleteFn()
    } else if (type === 'clear') {
        clear()
    } else {
        pushNumber(text)
    }
    updata()

})

//函数声明提升
//数字输入
function pushNumber(num) {
    currentNumber = currentNumber + num //字符串拼接
    console.log(currentNumber);
}
//AC
function clear() {
    currentNumber = ''
    pervNumber = ''
    sign = ''
}

//del
function deleteFn() {
    if (!currentNumber.toString().length) return //if(!0) 当长度为0时
    currentNumber = currentNumber.toString().slice(0, -1) //删除一位
}

//运算操作
//运算操作后 结果成为过去 结果置空
function operate(text) {
    if (!currentNumber.toString().length) return
    sign = text
    pervNumber = currentNumber
    currentNumber = ''
}

function calculate() {
    let result = 0
    const prev = Number(pervNumber)
    const current = Number(currentNumber)
    switch (sign) {
        case '+':
            result = prev + current
            break
        case '-':
            result = prev - current
            break
        case '*':
            result = prev * current
            break
        case '÷':
            if (current == 0)
                alert('操作错误，除数不能为0！')
            else
                result = prev / current
            break
        default:
            return;
    }
    // currentNumber = result.toFixed(3)
    currentNumber = result
    sign = ''
    pervNumber = ''
}

function updata() {
    currentElement.textContent = currentNumber;
    if (sign) {
        prevElement.textContent = `${pervNumber} ${sign}`
    } else {
        prevElement.textContent = ''
    }
}