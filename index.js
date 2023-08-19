const mysql = require("mysql2");
const inquirer = require("inquirer");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employees_db",
  },
  console.log("connected to empoyee database")
);

const questions = [
  {
    type: "list",
    name: "intro",
    message: "What would you like to do?",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employess",
      "Add A Department",
      "Add A Role",
      "Add An Employee",
      "Update An Employee Role",
    ],
  },
];

function init() {
    inquirer.prompt(questions).then((answers) => {
        if(answers.intro === 'View All Departments'){
            db.query((`SELECT * FROM department ORDER BY id`), function (err,results){
                console.table(results)
            })
        }
    })
}

init()