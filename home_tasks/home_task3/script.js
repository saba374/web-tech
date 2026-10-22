
var firstNumber = 0;
var operatorSign = "";

function number(value) {
    document.getElementById("display").value += value;
}

function operator(op) {
    firstNumber = Number(document.getElementById("display").value);
    operatorSign = op;
    document.getElementById("display").value = "";
}

function calculate() {
    var secondNumber = Number(document.getElementById("display").value);
    var result = 0;

    if (operatorSign == "+") {
        result = firstNumber + secondNumber;
    }
    else if (operatorSign == "-") {
        result = firstNumber - secondNumber;
    }
    else if (operatorSign == "*") {
        result = firstNumber * secondNumber;
    }
    else if (operatorSign == "/") {
        if (secondNumber == 0) {
            document.getElementById("display").value = "Error";
            return;
        }
        result = firstNumber / secondNumber;
    }

    document.getElementById("display").value = result;
}

function clearDisplay() {
    document.getElementById("display").value = "";
    firstNumber = 0;
    operatorSign = "";
}

function backspace() {
    var display = document.getElementById("display");
    display.value = display.value.slice(0, -1);
}

function percentage() {
    var display = document.getElementById("display");
    display.value = Number(display.value) / 100;
}

function changeSign() {
    var display = document.getElementById("display");
    display.value = Number(display.value) * -1;
}

function decimal() {
    var display = document.getElementById("display");

    if (!display.value.includes(".")) {
        display.value += ".";
    }
}
