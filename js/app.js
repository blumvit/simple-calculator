'use strict';

const buttons = document.querySelectorAll(".button");
const historyField = document.getElementById("history");
const resultatField = document.getElementById("result");

let computingHistory = "";

let result = [];

function switchInput(inputString) {
    switch (inputString) {
        case ("+"):
            historyUpdate(inputString);
            calculate();
            break;
        case ("-"):
            historyUpdate(inputString);
            calculate();
            break;
        case ("*"):
            historyUpdate(inputString);
            calculate();
            break;
        case ("/"):
            historyUpdate(inputString);
            calculate();
            break;
        case ("="):
            equals();
            break;
        case ("<"):
            del();
            break;
        case ("AC"):
            del("all");
            break;

        default:
            historyUpdate(inputString);
            calculate();
    }
}

buttons.forEach(element => {
    element.addEventListener("click", () => {

        if (element.firstChild) {

            let inputString = element.firstChild.textContent;

            switchInput(inputString);
        }
    });
});

function historyUpdate(symbol) {

    // Erster Operator darf nur ein Minus sein
    if (computingHistory == "" && symbol == "-" || computingHistory == "" && !isOperator(symbol)) {
        if (symbol == "."){
            computingHistory = "0" + symbol;
        } else {
            computingHistory = symbol;
        }
    } else if (computingHistory != "") {
        if (isOperator(symbol) && isOperator(computingHistory.charAt(computingHistory.length - 1))) {
            if (computingHistory.length != 1) {
                computingHistory = computingHistory.replace(computingHistory.charAt(computingHistory.length - 1), symbol);
            }
        } else {
            // let tmpLastNumber = computingHistory.split(/([+\-*/])/);
            // tmpLastNumber = tmpLastNumber.filter(item => item); 
            // if (symbol == "." && tmpLastNumber.length > 1) {
            //     let lastNumber = tmpLastNumber[tmpLastNumber.length - 1].split(); 
            //         console.log(lastNumber)
            //     if (!lastNumber.includes(".")) {
            //         computingHistory = computingHistory + symbol;
            //     }    
            // } else {
            //     computingHistory = computingHistory + symbol;
            // }
            computingHistory = computingHistory + symbol;

        }
    }
    historyField.innerHTML = computingHistory;
}


function isOperator(pattern) {
    if (pattern === "+" || pattern === "-" || pattern === "/" ||
        pattern === "*" || pattern === "=" || pattern === "<" ||
        pattern === "." || pattern === ",") {
        return true;
    } else {
        return false;
    }
}

function del(all) {
    if (typeof all !== "undefined") {
        computingHistory = "";
        historyField.innerHTML = computingHistory;
    } else {
        computingHistory = computingHistory.substr(0, computingHistory.length - 1);
        historyField.innerHTML = computingHistory;
    }
    calculate();
}


function calculate() {
    result = computingHistory.split(/([+\-*/])/);
    result = result.filter(item => item);   // Schneidet vom Split erzeugte leere Element ab
    
    let moreThenOne = (result.length > 2)? true : false;    // Gibt true zurück, wenn es zwei Zahlen fürs Rechnen gibt

    // Falls am Anfang ein Minus steht, muss das mit naechster Zahl verbunden verden
    if (result[0] == "-" && moreThenOne) {
        result[0] = result[0] + result[1];
        result.splice(1, 1);
    }
    
    while (result.includes("*") || result.includes("/")) {
        if (result.includes("*") && result.includes("/")) {
            if (result.indexOf("*") < result.indexOf("/")) {
                let index = result.indexOf("*");
                if (result[index + 1]) {    // Falls es Zweite zahl gibt, wird die vom Operator stehende Zahl mit folgender Zahl multipliziert. Resultat wird erste Zahl überschreiben.
                    result[index - 1] = parseFloat(result[index - 1]) * parseFloat(result[index + 1]);
                    result.splice(index, 2);    // Entfernen operator und folgende Zahl falls vorhanden
                }
            } else {
                let index = result.indexOf("/");
                if (result[index + 1]) {
                    result[index - 1] = parseFloat(result[index - 1]) / parseFloat(result[index + 1]);
                    result.splice(index, 2);    // Entfernen operator und folgende Zahl falls vorhanden
                }
            }
        } else if (result.includes("*")) {
            let index = result.indexOf("*");
                if (result[index + 1]) {
                    result[index - 1] = parseFloat(result[index - 1]) * parseFloat(result[index + 1]);
                }                        
                result.splice(index, 2);
        } else {
            let index = result.indexOf("/");
            if (result[index + 1]) {
                result[index - 1] = parseFloat(result[index - 1]) / parseFloat(result[index + 1]);
            }   
                result.splice(index, 2);
        }
    }
    while (result.includes("+") || result.includes("-")) {
        if (result.includes("+") && result.includes("-")) {
            if (result.indexOf("+") < result.indexOf("-")) {
                let index = result.indexOf("+");
                if (result[index + 1]) {
                    result[index - 1] = parseFloat(result[index - 1]) + parseFloat(result[index + 1]);
                }
                result.splice(index, 2);
            } else {
                let index = result.indexOf("-");
                if (result[index + 1]) {
                    result[index - 1] = parseFloat(result[index - 1]) - parseFloat(result[index + 1]);
                }
                result.splice(index, 2);
            }
        } else if (result.includes("+")) {
            let index = result.indexOf("+");
            if (result[index + 1]) {
                result[index - 1] = parseFloat(result[index - 1]) + parseFloat(result[index + 1]);
            }
                result.splice(index, 2);
        } else {
            let index = result.indexOf("-");
            if (result[index + 1]) {
                result[index - 1] = parseFloat(result[index - 1]) - parseFloat(result[index + 1]);
            }
                result.splice(index, 2);
        }
    }
    
    resultUpdate(moreThenOne);

}

function resultUpdate(moreThenOne) {
    if (moreThenOne){
        resultatField.innerHTML = result;
    } else {
        resultatField.innerHTML = "";   // Falls es nur eine Zahl mit oder ohne Operator gibt, Resultat soll nicht angezeigt werden
    }
}

function equals() {
    computingHistory = "";
    resultatField.innerHTML = ""; 
    if (result[0] || result == 0){
        historyUpdate(result[0].toString());
    }
}


document.addEventListener('keydown', logKey);

function logKey(key) {
    console.log(key)
//   log.textContent += ` ${e.code}`;

    if (Number.isInteger(parseInt(key.key)) || isOperator(key.key)) {
        if (key.key === ",") {
            switchInput(".");
        } else {
            switchInput(key.key);
        }
    }
    if (key.key == "Enter") {
        switchInput("=");
    }
    if (key.key == "Backspace") {
        switchInput("<");
    }
    if (key.key == "Escape") {
        switchInput("AC");
    }
    
}