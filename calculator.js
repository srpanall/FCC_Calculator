var svgns = "http://www.w3.org/2000/svg";
var xlinkns = "http://www.w3.org/1999/xlink";
var numberID = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
var displayedExpression = "";
var expressionToEvaluate = "";
var answerValue = 0;
var resetScreen = 0;

function spot() {
  var spotSuffix = ["B", "D"];
  var gScreen = document.getElementById("screen");
  for (var l = 0; l < 2; l++) {
    for (var i = 8; i >= 1; i--) {
      var tempSpot = "spot" + spotSuffix[l] + i;
      var tempXSpot = 420 - 50 * i;
      var useScreen = document.createElementNS(svgns, "use");
      useScreen.setAttributeNS(xlinkns, "href", "#faded");
      useScreen.setAttribute("y", "40");
      useScreen.setAttribute("id", tempSpot);
      useScreen.setAttribute("x", tempXSpot);
      gScreen.appendChild(useScreen);
    }
  }
}

function makeDigits() {
  var numberFramePart = ["leftUpper", "leftLower", "top", "middle", "bottom", "rightUpper", "rightLower"];

  var numberUseLines = [
    [0, 1, 2, 4, 5, 6],
    [5, 6],
    [1, 2, 3, 4, 5],
    [2, 3, 4, 5, 6],
    [0, 3, 5, 6],
    [0, 2, 3, 4, 6],
    [0, 1, 3, 6, 4],
    [0, 2, 5, 6],
    [0, 1, 2, 3, 4, 5, 6],
    [0, 2, 3, 5, 6]
  ];

  for (var j = 0; j <= 9; j++) {
    var gDigit = document.getElementById(numberID[j]);

    for (var k = 0; k < numberUseLines[j].length; k++) {
      var tempLine = "#" + numberFramePart[numberUseLines[j][k]];
      var useDigit = document.createElementNS(svgns, "use");
      useDigit.setAttributeNS(xlinkns, "href", tempLine);
      gDigit.appendChild(useDigit);
    }
  }
}

function clearDisplay() {
  for (var i = 1; i <= 8; i++) {
    var nodeSourceID = "spotD" + i;
    var digitSpot = document.getElementById(nodeSourceID);
    digitSpot.setAttributeNS(xlinkns, "href", "#faded");
  }

  if (answerValue.indexOf(".") !== -1) {
    var decimalPoint = document.getElementById("decimalPlace");
    decimalPoint.parentNode.removeChild(decimalPoint);
  }

  displayedExpression = "";
  expressionToEvaluate = "";
  resetScreen = 0;
  var expressionNode = document.getElementById("expressionIn");
  expressionNode.textContent = displayedExpression;
}

function answerDisplay(answer) {
  var decimalPlace = answer.indexOf(".");
  var signAnswer = answer.indexOf("-");
  var maxNumberChar = 8 - signAnswer * signAnswer;
  var answerValue = Number(answer);
  var answerMaxPower10 = Math.floor(Math.log10(Math.abs(answerValue)));

  if (answerMaxPower10 > maxNumberChar) {
    var expressionNode = document.getElementById("expressionIn");
    expressionNode.textContent = "Error!";
    resetScreen = 1;
    //size error
/*    var tempAnswer = answerValue / Math.pow(10, answerMaxPower10);
    answer = tempAnswer.toString();

    //display EE answerMaxPower10
 */
  }

  var newDecimalPlace = answer.indexOf(".");

  if (newDecimalPlace !== -1) {
    if (answer.length > 9) {
      var decimalShifter = Math.pow(10, 8 - newDecimalPlace);
      var tempDecAnswer = answer * decimalShifter;

      tempDecAnswer = Math.round(tempDecAnswer);
      answerValue = tempDecAnswer / decimalShifter;
      answer=answerValue.toString();
    }

    answer = answer.replace(".", "");
    var parentDecimalNode = document.getElementById("screen");
    var decimalPointX = 16 + 50 * (8 - answer.length + newDecimalPlace);
    var decimalPoint = document.createElementNS(svgns, "use");

    decimalPoint.setAttributeNS(xlinkns, "href", "#point");
    decimalPoint.setAttribute("y", "110");
    decimalPoint.setAttribute("id", "decimalPlace");
    decimalPoint.setAttribute("x", decimalPointX);
    parentDecimalNode.appendChild(decimalPoint);
  }

  for (var i = 0; i < answer.length; i++) {
    var spotIndex = answer.length - i;
    var nodeSourceID = "spotD" + spotIndex;
    var digitSpot = document.getElementById(nodeSourceID);
    var digitKey = "#" + numberID[answer[i]];
    if (answer < 0 && spotIndex === answer.length) {
      digitKey = "#negative";
    }
    digitSpot.setAttributeNS(xlinkns, "href", digitKey);
  }

}

function updateExpression(n) {
  var addTextDisplay = "";
  var addTextEval = "";

  if (resetScreen === 1) {
    clearDisplay();
    resetScreen = 0;
  }

  switch (n) {
    case "ans":
      addTextDisplay = answerValue;
      addTextEval = answerValue;
      break;
    case "clear":
      clearDisplay();
      displayedExpression = "";
      expressionToEvaluate = "";
      resetScreen = 1;
      break;
    case "del":
      displayedExpression = displayedExpression.slice(0, -1);
      expressionToEvaluate = expressionToEvaluate.slice(0, -1);
      break;
    case "div":
      addTextDisplay = "\u00F7";
      addTextEval = "/";
      break;
    case "equals":
      answerValue = eval(expressionToEvaluate).toString();
      console.log(answerValue);
      answerDisplay(answerValue);
      resetScreen = 1;
      break;
    case "minus":
      addTextDisplay = "\u2212";
      addTextEval = "-";
      break;
    case "plus":
      addTextDisplay = "+";
      addTextEval = "+";
      break;
    case "times":
      addTextDisplay = "\u00D7";
      addTextEval = "*";
      break;
    default:
      addTextDisplay = n;
      addTextEval = n;
  }

  var expressionNode = document.getElementById("expressionIn");
  var tempExpression = expressionNode.textContent;
  displayedExpression = displayedExpression + addTextDisplay;
  expressionToEvaluate = expressionToEvaluate + addTextEval;
  expressionNode.textContent = displayedExpression;
}

function makeNumberKeys() {
  var parentNode = document.getElementById("buttons");
  var originalNode = document.getElementById("keySource");
  var orderKeys = [7, 8, 9, 4, 5, 6, 1, 2, 3, ["dec", ".", "'.'"], 0, ["ANS", "ANS", "'ans'"]];
  var keyIndex = 0;
  var x = 0;
  var y = 90;

  //Makes number buttons    
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 3; j++) {
      var newNode = originalNode.cloneNode(true);
      var tempID = "key" + orderKeys[keyIndex];
      var tempTranslate = "translate(" + x + "," + y + ")";
      var tempText = orderKeys[keyIndex];
      var onclickFunction = "updateExpression(" + orderKeys[keyIndex] + ")";

      if (Array.isArray(orderKeys[keyIndex])) {
        tempID = "key" + orderKeys[keyIndex][0];
        tempText = orderKeys[keyIndex][1];
        onclickFunction = "updateExpression(" + orderKeys[keyIndex][2] + ")";
      }

      newNode.id = tempID;
      newNode.class = "numbers";
      newNode.setAttribute("transform", tempTranslate);
      parentNode.appendChild(newNode);

      var keyNode = document.getElementById(tempID);
      var c = keyNode.children;

      c[1].textContent = tempText;
      c[2].setAttribute("onclick", onclickFunction);
      x = x + 110;
      keyIndex++;

      if (i === 3 && j === 2) {
        c[1].setAttribute("font-size", "36");
        c[1].setAttribute("y", "50");
      }
    }

    x = 0;
    y = y + 80;
  }
}

function makeOperatorKeys() {
  var parentNode = document.getElementById("buttons");
  var originalNode = document.getElementById("keySource");
  var orderOperators = [
    ["CE", "CE", "'del'"],
    ["CA", "CA", "'clear'"],
    ["Divide", "\u00F7", "'div'"],
    ["Times", "\u00D7", "'times'"],
    ["Plus", "+", "'plus'"],
    ["Minus", "\u2212", "'minus'"],
    ["Equals", "=", "'equals'"]
  ];
  var keyIndex = 0;
  var x = 0;
  var y = 10;

  for (var k = 0; k < 5; k++) {
    for (var m = 0; m < 4; m++) {
      if (k !== 0 && m != 3) {
        x = 330;
        continue;
      }

      if (keyIndex > 6) {
        break;
      }

      var newNode = originalNode.cloneNode(true);
      var tempID = "key" + orderOperators[keyIndex][0];
      var tempTranslate = "translate(" + x + "," + y + ")";
      var onclickFunction = "updateExpression(" + orderOperators[keyIndex][2] + ")";
      newNode = originalNode.cloneNode(true);
      tempID = "key" + orderOperators[keyIndex][0];
      tempTranslate = "translate(" + x + "," + y + ")";
      onclickFunction = "updateExpression(" + orderOperators[keyIndex][2] + ")";
      newNode.id = tempID;
      newNode.class = "operations";
      newNode.setAttribute("transform", tempTranslate);
      parentNode.appendChild(newNode);

      var operatorNode = document.getElementById(tempID);

      var cOperator = operatorNode.children;
      cOperator[1].textContent = orderOperators[keyIndex][1];
      cOperator[2].setAttribute("onclick", onclickFunction);
      x = x + 110;
      if (keyIndex === 0 || keyIndex === 1) {
        cOperator[1].setAttribute("font-size", "36");
        cOperator[1].setAttribute("y", "50");
      }

      keyIndex++;
    }
    y = y + 80;
  }
  var tempNode = document.getElementById("keyEquals");
  var c = tempNode.children;
  
  c[0].setAttributeNS(xlinkns,"href","#enterKey");
  c[1].setAttribute("y", "102");
  c[2].setAttribute("height", "160");
                      
//  alert(c[0]);
  
  
}