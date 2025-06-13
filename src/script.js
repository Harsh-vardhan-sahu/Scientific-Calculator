document.addEventListener("DOMContentLoaded", function () {
  const display = document.getElementById('calc-display');
  const buttons = document.getElementsByClassName('btn');

  let currentValue = "";

  const replacements = [
    { pattern: /log₂\(/gi, replacement: 'Math.log2(' },
    { pattern: /log\(/gi, replacement: 'Math.log10(' },// log₂ must come first
    { pattern: /sin\(/g, replacement: 'Math.sin(' },
    { pattern: /cos\(/g, replacement: 'Math.cos(' },
    { pattern: /tan\(/g, replacement: 'Math.tan(' },
    { pattern: /√/g, replacement: 'Math.sqrt(' },
    { pattern: /π/g, replacement: 'Math.PI' },
    { pattern: /×/g, replacement: '*' },
    { pattern: /÷/g, replacement: '/' },
    { pattern: /eˣ\(/g, replacement: 'Math.exp(' },
    { pattern: /\)(?:\s*)²/g, replacement: '), 2)' },
    { pattern: /([0-9a-zA-Z_]+)²/g, replacement: 'Math.pow($1, 2)' }
  ];

  function transformExpression(expr) {
    replacements.forEach(({ pattern, replacement }) => {
      expr = expr.replace(pattern, replacement);
    });

    // Add implied multiplication
    expr = expr.replace(/(\d)(Math\.\w+)/g, '$1*$2');
    expr = expr.replace(/(\d)\(/g, '$1*(');
    expr = expr.replace(/\)(\d)/g, ')*$1');

    return expr;
  }

  function evaluateExpression(expr) {
    try {
      const result = Function('"use strict"; return (' + expr + ')')();
      return isNaN(result) ? "Error" : String(result);
    } catch {
      return "Error";
    }
  }

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    button.addEventListener('click', function () {
      const value = button.innerText;
      const memoryAction = button.getAttribute('data-memory');
      const lastChar = currentValue.slice(-1);

      if (currentValue === "Error") currentValue = "";

      // Handle memory buttons
      if (memoryAction) {
        if (memoryAction === 'save') {
          fetch('http://localhost:3000/memory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: display.value })
          });
        } else if (memoryAction === 'recall') {
          fetch('http://localhost:3000/memory')
            .then(res => res.json())
            .then(data => {
              currentValue += data.memory;
              display.value = currentValue;
            });
        } else if (memoryAction === 'clear') {
          fetch('http://localhost:3000/memory/clear', { method: 'POST' });
        }
        return;
      }

      // Handle regular buttons
      if (value === 'AC') {
        currentValue = "";
      } else if (value === 'DEL') {
        currentValue = currentValue.slice(0, -1);
      } else if (value === '=') {
        const transformed = transformExpression(currentValue);
        console.log("Transformed:", transformed);
        currentValue = evaluateExpression(transformed);
      }else if (value === 'x²') {
        currentvalue += '²';  // Append superscript 2
      }  else if (
        (lastChar === ')' && value === '(') ||
        (/\d/.test(lastChar) && value === '(') ||
        (lastChar === ')' && /\d/.test(value))
      ) {
        currentValue += '*' + value;
      } else {
        currentValue += value;
      }

      display.value = currentValue;
    });
  }
});
