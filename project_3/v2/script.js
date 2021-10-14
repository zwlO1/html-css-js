/**
 * 历史记录
 * 多项表达式形式的计算  3+2/5
 * 
 * 
 * 正负号  
 * 小数运算
 * 百分号运算
 */


//
const buttonContainer = document.querySelector('.buttons')
const prevElement = document.querySelector('.prev')
const currentElement = document.querySelector('.current')
const s = document.querySelector('.s')
const c = document.querySelector('.c')
const history = document.querySelector('.history')
let ul = document.querySelector('.ul')

//正在输入 已输入 操作符 记录
let currentNumber = '',
    pervNumber = '',
    operator = '',
    arry = []

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
    } else if (type === 'sign') {
        sign()
    } else if (type === 'mr') {
        mr()
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
    operator = ''
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
    calculate() //每次操作符都计算一次值  
    operator = text
    pervNumber = currentNumber
    currentNumber = ''
}

function calculate() {
    let result = 0
    const prev = Number(pervNumber)
    const current = Number(currentNumber)
    switch (operator) {
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
            if (current == 0) {
                alert('操作错误，除数不能为0！')
                console.log('操作错误，除数不能为0！')
            } else
                result = prev / current
            break
        case '%':
            if (current != 0) {
                alert('操作错误!')
                console.log('操作错误!')
            }
            result = prev / 100
            break
        default:
            return;
    }
    console.log(`${pervNumber}${operator}${currentNumber}=${result}`);
    // s.push = `${pervNumber}${operator}${currentNumber}=${result}`;
    arry.push(`${pervNumber}${operator}${currentNumber}=${result}`);
    // console.log(arry);
    // currentNumber = result.toFixed(3)
    currentNumber = result
    operator = ''
    pervNumber = ''
}

function mc() {}

function mAdd() {}

function mReduce() {}

function mr() {}

//正负号
function sign() {
    if (!currentNumber.toString().length) return
    currentNumber = -currentNumber
}

function updata() {
    currentElement.textContent = currentNumber;
    if (operator) {
        prevElement.textContent = `${pervNumber} ${operator}`
    } else {
        prevElement.textContent = ''
    }
    // console.log(arry);
}

//history
function loadHistory() {
    if (arry.length) {
        ul.innerHTML = null;
        for (let item of arry) {
            let li = document.createElement('li')
            let textNoed = document.createTextNode(item)
            li.appendChild(textNoed)
            ul.appendChild(li)
        }
    } else {
        ul.innerHTML = null;
    }
}

function showHistory() {
    // console.log(this); //window
    s.style.display = 'none';
    c.style.display = 'inline-block';
    history.style.display = 'block'
    loadHistory();
}

function showCalculator() {
    c.style.display = 'none';
    s.style.display = 'inline-block';
    history.style.display = 'none'

}
//clear history
function clearHistory() {
    arry = [];
    ul.innerHTML = null;
    console.log('历史已清空');
}