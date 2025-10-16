function EmployeeInfo(name,Salary)
{
    console.log("Hello "+name+","+Salary+" is your Monthly Salary")
}

console.log("They are the details of Employee")

var EmpName="John"
var EmpSalary=80000

EmployeeInfo(EmpName, EmpSalary)
const EmpSkills= (skills)=> {
 console.log("Expert in "+ skills)
}
EmpSkills("java")

const student= require('./StudentInfo')
const person= require('./Person')

console.log("Student Name: "+student.getName())
console.log(student.Location())
console.log(student.dob)

console.log(student.Studentgrade())
console.log("grade is "+student.Studentgrade(55))

person1= new person("Jim","USA","myemail@gmail.com")
console.log("Using Person Module", person1.getPersonInfo())
console.log("Program Ends")