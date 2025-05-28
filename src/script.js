document.addEventListener("DOMContentLoaded", function () {
  const display = document.getElementById('calc-display');
  const buttons = document.getElementsByClassName('btn');

  let currentvalue = "";

  const replacements = [
    { pattern: /sin\(/g, 'replacement': 'Math.sin(' },
    { pattern: /cos\(/g, 'replacement': 'Math.cos(' },
    { pattern: /tan\(/g, 'replacement': 'Math.tan(' },
    { pattern: /log₂\(/g, 'replacement': 'Math.log2(' },
    { pattern: /log\(/g, 'replacement': 'Math.log10(' },
    { pattern: /√/g, 'replacement': 'Math.sqrt' },
    { pattern: /π/g, 'replacement': 'Math.PI' },
    { pattern: /×/g, 'replacement': '*' },
    { pattern: /÷/g, 'replacement': '/' },
    { pattern: /eˣ/g, replacement: 'Math.exp(' } , // Open      
    { pattern: /([0-9a-zA-Z_]+)²/g, replacement: 'Math.pow($1, 2)' }  
  ];

  function transformExpression(expr) {
    replacements.forEach(({ pattern, replacement }) => {
      expr = expr.replace(pattern, replacement);
    });

    expr = expr.replace(/(\d)(Math\.\w+)/g, '$1*$2');
    expr = expr.replace(/(\d)\(/g, '$1*(');
    expr = expr.replace(/\)(\d)/g, ')*$1');
    return expr;
  }

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    button.addEventListener('click', function () {
      const value = button.innerText;
      const lastChar = currentvalue.slice(-1);


// Memory button logic
const memoryAction = button.getAttribute('data-memory');
if (memoryAction) {
  if (memoryAction === 'save') {
    // Save current display to memory
    fetch('http://localhost:3000/memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: display.value })
    });
  } else if (memoryAction === 'recall') {
    // Recall memory and append it to display
    fetch('http://localhost:3000/memory')
      .then(res => res.json())
      .then(data => {
        currentvalue += data.memory;
        display.value = currentvalue;
      });
  } else if (memoryAction === 'clear') {
    // Clear memory
    fetch('http://localhost:3000/memory/clear', { method: 'POST' });
  }
  return; // Stop further processing
}
      if (currentvalue === "Error") currentvalue = "";

      if (value === 'AC') {
        currentvalue = "";
      } else if (value === 'DEL') {
        currentvalue = currentvalue.slice(0, -1);
      } 
      else if (value === '=') {
        try {
          currentvalue = transformExpression(currentvalue);
          currentvalue = String(eval(currentvalue));
         
        } catch {
          currentvalue = "Error";
        }
      } else if (
        (lastChar === ')' && value === '(') ||
        (/\d/.test(lastChar) && value === '(') ||
        (lastChar === ')' && /\d/.test(value))
      ) {
        currentvalue += '*' + value;
      } else {
        currentvalue += value;
      }

      display.value = currentvalue;
    });
  }
});
