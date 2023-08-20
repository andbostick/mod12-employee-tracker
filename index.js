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
      "View All Employees",
      "Add A Department",
      "Add A Role",
      "Add An Employee",
      "Update An Employee Role",
    ],
  },
];

function init() {
  inquirer.prompt(questions).then((answers) => {
    if (answers.intro === "View All Departments") {
      db.query(`SELECT * FROM department ORDER BY id`, function (err, results) {
        console.table(results);
      });
    }
    if (answers.intro === "View All Roles") {
      db.query(`SELECT * FROM role ORDER BY id`, function (err, results) {
        console.table(results);
      });
    }
    if (answers.intro === "View All Employees") {
      db.query(`SELECT * FROM employee ORDER BY id`, function (err, results) {
        console.table(results);
      });
    }
    if (answers.intro === "Add A Department") {
      inquirer.prompt([
        {
            type:'input',
          message: "Name of the Department",
          name: 'name',

        },
      ]).then((answers) => {
        db.query(`INSERT INTO department (name) VALUES (?)`,answers.name,function(err, results){
            if(err){
                console.log(err)
            }
            console.log(results)
        })
      });
    }
  });
}

init();
