console.log("This is my First program")
console.log("My Monthly salary is 50000 pound")

const num1 = 4;
const num2 = 8; 
// Adding two numbers 
const sum = num1+num2;
//displaying sum of Two Numbers 
console.log(sum +" is the total of "+num1 +"and "+num2);

//Checking if a number is positive or Negative 
const prompt = require('prompt-sync')();
console.log("Starting");
const name = prompt('Enter your Name: ');
console.log(`Hello, ${name}`);

const number = parseInt(prompt("Enter a Number: "));

if(number>0){
    console.log("The number is positive");
}
else{
    console.log("The number is Negative");
}
