// Simple Calculator 
const prompt = require('prompt-sync')();
const firstnum = parseInt(prompt("Enter First Number: "));
const secondnum = parseInt(prompt("Enter second Number: "));
const addition = firstnum + secondnum;
console.log("The addition of Two numbers is "+addition);
const substraction = firstnum - secondnum;
console.log("The substraction of Two numbers is "+substraction);
const multiply = firstnum*secondnum;
console.log("The multiply of Two numbers is "+multiply);
const division = firstnum/secondnum;
console.log("The division of Two numbers is "+division);