// Get all necessary DOM nodes
const dataCurrent = document.querySelector('[data-current]');
const dataPrevious = document.querySelector('[data-previous]');
const dataNumber = document.querySelectorAll('[data-number]');
const dataDecimal = document.querySelector('[data-decimal]');
const dataOperator = document.querySelectorAll('[data-operator]');
const dataEquals = document.querySelector('[data-equals]');
const dataAllClear = document.querySelector('[data-all-clear]');
const dataClear = document.querySelector('[data-clear]');

// Declare necessary variables
let activeOperator = true;
let chosenOperator = '';

// For basic math operators
function add(a, b){
    return a + b;
}

function subtract(a, b){
    return a - b;
}

function multiply(a, b){
    return a * b;
}

function divide(a, b){
    if(b === 0) return "*Crashes*";
    return a / b;
}

function modulo(a, b){
    return a % b;
}

// Takes an operator and 2 numbers, then calls a math operator function  
function operate(number1, number2, operator){
    number1 = +number1;
    number2 = +number2;
    switch(operator){
        case '+':
            return add(number1, number2);
        case '-':
            return subtract(number1, number2);
        case '×':
            return multiply(number1, number2);
        case '÷':
            return divide(number1, number2);
        case '%':
            return modulo(number1, number2);
        default:
            return null;
    }
}

// Display the numbers when the number buttons are clicked
dataNumber.forEach((btn) => {
    btn.addEventListener('click', () => displayNumber(btn.textContent));
});
 
function displayNumber(number){
    if(dataCurrent.value.charAt(0) == 0 && dataCurrent.value.charAt(1) != '.'){
        dataCurrent.value = '';
    } 
    dataCurrent.value += number;
    if(dataCurrent.value.length > 13){
        dataCurrent.value = (+dataCurrent.value).toExponential(2);
    }
    activeOperator = true;
}

// Display the decimal when the decimal button is clicked
dataDecimal.addEventListener('click', () => displayDecimal(dataDecimal.textContent));

function displayDecimal(decimal){
    dataCurrent.value.includes('.') ? null : dataCurrent.value += decimal; 
}

// Display operators, calculate when several operations are stringed together
dataOperator.forEach((btn) => {
    btn.addEventListener('click', () => displayOperator(btn.textContent));
});

function displayOperator(operator){
    if(activeOperator){
        if(operator === '/') operator = '÷';
        if(operator === '*') operator = '×';
        if(chosenOperator != '' && dataPrevious.value.includes(chosenOperator)){
            const previousOperator = dataPrevious.value.slice(-1);
            const newValue = operate(dataPrevious.value.slice(0, -1), dataCurrent.value, previousOperator);
            dataPrevious.value = `${newValue} ${operator}`;
            dataCurrent.value = '0';
        }
        else{
            dataPrevious.value = `${dataCurrent.value} ${operator}`;
            dataCurrent.value = '0';
        }
        chosenOperator = operator;
        activeOperator = false;
    }
}

// Calculates when clicked on equals 
dataEquals.addEventListener('click', displayResult);

function displayResult(){
    dataCurrent.value =  operate(dataPrevious.value.slice(0, -1), dataCurrent.value, chosenOperator);
    if(dataCurrent.value.length > 8){
        dataCurrent.value = (+dataCurrent.value).toExponential(2);
    }
    else if(dataCurrent.value.includes('.') && dataCurrent.value.length > 8){
        dataCurrent.value = (+dataCurrent.value).toFixed(2);
    }
    dataPrevious.value = '';  
}

// Clear the last number in dataCurrent
dataClear.addEventListener('click', clear);

function clear(){
    dataCurrent.value = dataCurrent.value.slice(0, -1);
    if(dataCurrent.value === '') dataCurrent.value = '0';
}

// Clear all, start fresh again
dataAllClear.addEventListener('click', allClear);

function allClear(){
    dataPrevious.value = '';
    chosenOperator = '';
    dataCurrent.value = '0';
    activeOperator = true;
}

// Able to use the keyboard, 
window.addEventListener('keydown', setInput);

function setInput(e){
    if(e.key >= 0 && e.key <= 9) displayNumber(e.key);
    if(e.key === ".") displayDecimal();
    if(e.key === "=" || e.key === "Enter") displayResult();
    if(e.key === "Backspace") clear();
    if(e.key === "Escape") allClear();
    if(e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/"){
        displayOperator(e.key);
    }
}