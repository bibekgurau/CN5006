const dateofBirth= "11/08/2005"

const getStudentName= () =>
{
    return "Write Your Name here"
}
const getCampusName = () =>
{
    return ("UEL Campus ")
}

exports.getName=getStudentName
exports.Location=getCampusName
exports.dob=dateofBirth

exports.Studentgrade=(marks)=>
{
    if(marks>50 && marks<70) return ("B grade")
        else
           return ("A grade")
}