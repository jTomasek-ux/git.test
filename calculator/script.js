const display = document.querySelector("display");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const equalButtons = document.querySelector("#equals");

numberButtons.forEach ((button) => {
    button.addEventListener('click', () => {
    display.textContent += button.textContent
    });
});

let currentOperator = "";
let firstNum = "";

operatorButtons.forEach ((button) =>{
    button.addEventListener('click', () => {
    firstNum = display.textContent;
    currentOperator = button.textContent;
    display.textContent = "";
    });
})



function operate(num1 , num2, operator){
    if (operator === "+"){
        return add(num1, num2);
    } 
    else if(operator === "-"){
        return subtract(num1, num2);
    } 
    else if(operator === "*"){
        return multiply(num1, num2);
    } 
    else if(operator === "/"){
        return divide(num1, num2);
    } 
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

