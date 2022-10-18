const questions = 
[
    "select firstName, lastName from customers where email like \"%yahoo%\"",
    "select count(*) as countNull from Customers where Company is null",
    "select firstName, lastName from customers where email like \"%yahoo%\"",
    "select firstName, lastName from customers where email like \"%yahoo%\""
]

module.exports = {questions: questions}