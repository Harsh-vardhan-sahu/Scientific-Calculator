document.addEventListener("DOMContentLoaded",function(){
    const display=document.getElementById('calc-display');
    const buttons=document.getElementsByClassName('btn');

    let currentvalue = "";

for (let i = 0; i < buttons.length; i++) {
const button = buttons[i];
button.addEventListener('click', function () {
 const value = button.innerText;
 const lastChar = currentvalue.slice(-1);
 if (value === 'AC') {
   currentvalue = "";
 } else if(value=='DEL'){
   currentvalue=currentvalue.slice(0,-1);
 }
 else if((lastChar === ')' && value === '(') ||
(/\d/.test(lastChar) && value === '(') ||
(lastChar === ')' && /\d/.test(value))
){
currentvalue += '*' + value;
}
 else if (value === '=') {
   try {
     currentvalue = eval(currentvalue.replace(/×/g, '*'));
   } catch {
     currentvalue = "Error";
   }
 } else {
   currentvalue += value;
 }
    
 display.value = currentvalue;
});
}

 });